/*
	This file is a node.js module.

	This is a sample implementation of UDF-compatible datafeed wrapper for yahoo.finance.
	Some algorithms may be icorrect because it's rather an UDF implementation sample
	then a proper datafeed implementation.
*/

var http = require("http"),
	url = require("url"),
	symbolsDatabase = require("./symbols_database");

var datafeedHost = "chartapi.finance.yahoo.com";
var defaultResponseHeader = {"Content-Type": "text/plain", 'Access-Control-Allow-Origin': '*'};


function httpGet(path, callback)
{
	var options = {
		host: datafeedHost,
		path: path
	};

	onDataCallback = function(response) {
		var result = '';

		response.on('data', function (chunk) {
			result += chunk
		});

		response.on('end', function () {
			callback(result)
		});
	}

	http.request(options, onDataCallback).end();
}


function convertYahooHistoryToUDFFormat(data) {

	// input: string "yyyy-mm-dd" (UTC)
	// output: milliseconds from 01.01.1970 00:00:00.000 UTC
	function parseDate(input) {
		var parts = input.split('-');
		return Date.UTC(parts[0], parts[1]-1, parts[2]);
	}

	var result = {
		t: [], c: [], o: [], h: [], l: [], v: [],
		s: "ok"
	};

	var lines = data.split('\n');

	for (var i = lines.length - 2; i > 0; --i) {
		var items = lines[i].split(",");

		var time = parseDate(items[0]) / 1000;

		result.t.push(time);
		result.o.push(parseFloat(items[1]));
		result.h.push(parseFloat(items[2]));
		result.l.push(parseFloat(items[3]));
		result.c.push(parseFloat(items[4]));
		result.v.push(parseFloat(items[5]));
	}

	return result;
}


RequestProcessor = function(action, query, response) {

	this.sendError = function(error, response) {
		response.writeHead(200, defaultResponseHeader);
		response.write("{\"s\":\"error\",\"errmsg\":\"" + error + "\"}");
		response.end();

		console.log(error);
	}

	this.sendConfig = function(response) {

		var config = {
			supports_search: true,
			supports_group_request: false,
			exchanges: [
				{value: "", name: "All Exchanges", desc: ""},
				{value: "NYQ", name: "NYQ", desc: "NYQ"},
				{value: "NMS", name: "NMS", desc: "NMS"}
			],
			symbolsTypes: [
				{name: "All types", value: ""},
				{name: "Stock", value: "stock"},
				{name: "Index", value: "index"}
			],
			supportedResolutions: [ "15", "30", "D", "2D", "3D", "W", "3W", "M", '6M' ]
		};

		response.writeHead(200, defaultResponseHeader);
		response.write(JSON.stringify(config));
		response.end();
	}


	this.sendSymbolSearchResults = function(query, type, exchange, maxRecords, response) {
		if (!maxRecords) {
			throw "wrong_query";
		}

		var result = symbolsDatabase.search(query, type, exchange, maxRecords);

		response.writeHead(200, defaultResponseHeader);
		response.write(JSON.stringify(result));
		response.end();
	}


	this._pendingRequestType = "";
	this._lastYahooResponse = null;

	this.finance_charts_json_callback = function(data) {
		if (_pendingRequestType == "data") {
			_lastYahooResponse = data.series;
		}
		else if (_pendingRequestType == "meta") {
			_lastYahooResponse = data.meta;
		}
	}


	this._mockupSymbolInfo = function(symbolName, response) {
		var info = {
			"name": symbolsDatabase.sessionsDemoSymbol,
			"exchange-traded": "MOCK",
			"exchange-listed": "MOCK",
			"timezone": "UTC",
			"minmov": 1,
			"minmov2": 0,
			"pricescale": 100,
			"pointvalue": 1,
			"session": "0900-1630|1000-1400,1600-1900:2|1300-1700:3",
			"has_intraday": true,
			"intraday_multipliers": [15],
			"has_dwm": false,
			"has_no_volume": true,
			"ticker": symbolsDatabase.sessionsDemoSymbol,
			"description": "Mockup symbol with mockup data",
			"type": "stock"
		};

		response.writeHead(200, defaultResponseHeader);
		response.write(JSON.stringify(info));
		response.end();
	}


	this.sendSymbolInfo = function(symbolName, response) {
		if (symbolName.indexOf(symbolsDatabase.sessionsDemoSymbol) >= 0) {
			this._mockupSymbolInfo(symbolName, response);
			return;
		}

		var symbolInfo = symbolsDatabase.symbolInfo(symbolName);

		if (symbolInfo == null) {
			throw "unknown_symbol " + symbolName;
		}

		var address = "/instrument/1.0/" + encodeURIComponent(symbolInfo.name) + "/chartdata;type=quote;/json";
		var that = this;

		console.log("Requesting symbol info: " + datafeedHost + address);

		httpGet(address, function(result) {
			_pendingRequestType = "meta";

			try {
				with (that) {
					eval(result);
				}
			}
			catch (error) {
				that.sendError("invalid symbol", response);
				return;
			}

			var lastPrice = _lastYahooResponse["previous_close"] + "";

			//	BEWARE: this `pricescale` parameter computation algorithm is wrong and works
			//	for symbols with 10-based minimal movement value only
			var pricescale = lastPrice.indexOf('.') > 0
				? Math.pow(10, lastPrice.split('.')[1].length)
				: 10;

			var info = {
				"name": symbolInfo.name,
				"exchange-traded": _lastYahooResponse["Exchange-Name"],
				"exchange-listed": _lastYahooResponse["Exchange-Name"],
				"timezone": "America/New_York",
				"minmov": 1,
				"minmov2": 0,
				"pricescale": pricescale,
				"pointvalue": 1,
				"session": "0900-1630",
				"has_intraday": false,
				"has_no_volume": symbolInfo.type != "stock",
				"ticker": _lastYahooResponse["ticker"],
				"description": symbolInfo.description.length > 0 ? symbolInfo.description : symbolInfo.name,
				"type": symbolInfo.type
			};

			response.writeHead(200, defaultResponseHeader);
			response.write(JSON.stringify(info));
			response.end();
		});
	}


	this._mockupSymbolHistory = function(startDateTimestamp, resolution, response) {
		var sessions = {
			'default': [{
					start: 9 * 60,
					end: 16 * 60 + 30
				}
			],

			//	Monday
			'2':  [{
					start: 10 * 60,
					end: 14 * 60
				}, {
					start: 16 * 60,
					end: 19 * 60
				}
			],

			//	Tuesday
			'3': [{
					start: 13 * 60,
					end: 17 * 60
				}
			]
		};

		var result = {
			t: [], c: [], o: [], h: [], l: [], v: [],
			s: "ok"
		};

		var today = new Date(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''))
		today.setHours(0, 0, 0, 0);

		var daysCount = parseInt(Math.max((today.valueOf()/1000 - startDateTimestamp) / (60 * 60 * 24), 1));
		var median = 40;

		for (var day = daysCount; day >= 0; day--) {
			var date = new Date(today.valueOf() - day * 24 * 60 * 60 * 1000);
			var dayIndex = date.getDay() + 1;

			if (dayIndex == 1 || dayIndex == 7) {
				continue;
			}

			var daySessions = sessions.hasOwnProperty(dayIndex)
				? sessions[dayIndex]
				: sessions['default'];

			for (var i = 0; i < daySessions.length; ++i) {
				var session = daySessions[i];

				var barsCount = (session.end - session.start) / resolution;

				for (var barIndex = 0; barIndex < barsCount; barIndex++) {
					var barTime = date.valueOf() / 1000 + session.start * 60 + barIndex * resolution * 60 - date.getTimezoneOffset() * 60;

					//console.log(barTime + ": " + new Date(barTime * 1000));

					result.t.push(barTime);

					var open = median + Math.random() * 4 - Math.random() * 4;
					var close = median + Math.random() * 4 - Math.random() * 4;

					result.o.push(open);
					result.h.push(Math.max(open, close) + Math.random() * 4);
					result.l.push(Math.min(open, close) - Math.random() * 4);
					result.c.push(close);

					median = close;

					if (median < 10) {
						median = 10;
					}
				}
			}
		}

		response.writeHead(200, defaultResponseHeader);
		response.write(JSON.stringify(result));
		response.end();
	}


	this.sendSymbolHistory = function(symbol, startDateTimestamp, resolution, response) {

		console.log("History request: " + symbol + ", " + resolution);

		if (symbol.indexOf(symbolsDatabase.sessionsDemoSymbol) >= 0) {
			this._mockupSymbolHistory(startDateTimestamp, resolution, response);
			return;
		}

		var symbolInfo = symbolsDatabase.symbolInfo(symbol);

		if (symbolInfo == null) {
			throw "unknown_symbol";
		}

		var requestLeftDate = new Date(startDateTimestamp * 1000);

		var year = requestLeftDate.getFullYear();
		var month = requestLeftDate.getMonth();
		var day = requestLeftDate.getDate();

		if (resolution != "d" && resolution != "w" && resolution != "m") {
			throw "Unsupported resolution: " + resolution;
		}

		var address = "ichart.finance.yahoo.com/table.csv?s=" + symbolInfo.name +
			"&a=" + month +
			"&b=" + day  +
			"&c=" + year +
			"&g=" + resolution +
			"&ignore=.csv";

		console.log("Requesting data: " + address);

		var that = this;

		httpGet(address, function(result) {
			response.writeHead(200, defaultResponseHeader);
			response.write(JSON.stringify(convertYahooHistoryToUDFFormat(result)));
			response.end();
		});
	}


	try
	{
		if (action == "/config") {
			this.sendConfig(response);
		}
		else if (action == "/symbols" && !!query["symbol"]) {
			this.sendSymbolInfo(query["symbol"], response);
		}
		else if (action == "/search") {
			this.sendSymbolSearchResults(query["query"], query["type"], query["exchange"], query["limit"], response);
		}
		else if (action == "/history") {
			this.sendSymbolHistory(query["symbol"], query["from"], query["resolution"].toLowerCase(), response);
		}
		else {
			throw "wrong_request_format";
		}
	}
	catch (error) {
		this.sendError(error, response)
	}
}


//	Usage:
//		/config
//		/symbols?symbol=A
//		/search?query=B&limit=10
//		/history?symbol=C&from=DATE&resolution=E

http.createServer(function(request, response) {

	var uri = url.parse(request.url, true);
	var action = uri.pathname;

	new RequestProcessor(action, uri.query, response);

}).listen(8888);

console.log("Datafeed running at\n => http://localhost:8888/\nCTRL + C to shutdown");
