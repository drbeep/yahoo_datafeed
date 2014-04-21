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

	//	yyyy-mm-dd
	function parseDate(input) {
		var parts = input.split('-');
		return new Date(parts[0], parts[1]-1, parts[2]);
	}

	var result = {
		t: [], c: [], o: [], h: [], l: [], v: [],
		s: "ok"
	};

	var lines = data.split('\n');

	for (var i = lines.length - 2; i > 0; --i) {
		var items = lines[i].split(",");

		var time = parseDate(items[0]).valueOf() / 1000;
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
				{value: "NMS", name: "NMS", desc: "NMS"},
				{value: "PNK", name: "PNK", desc: "PNK"},
				{value: "MCE", name: "MCE", desc: "MCE"},
				{value: "NCM", name: "NCM", desc: "NCM"}
			],
			symbolsTypes: [
				{name: "All types", value: ""},
				{name: "Stock", value: "stock"},
				{name: "Index", value: "index"}
			]
		};

		response.writeHead(200, defaultResponseHeader);
		response.write(JSON.stringify(config));
		response.end();
	}


	this.sendSymbolSearchResults = function(query, maxRecords, response) {
		if (!query || !maxRecords) {
			throw "wrong_query";
		}

		var result = symbolsDatabase.search(query, maxRecords);

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


	this.sendSymbolInfo = function(symbolName, response) {
		var symbolInfo = symbolsDatabase.symbolInfo(symbolName);

		if (symbolInfo == null) {
			throw "unknown_symbol";
		}

		var address = "/instrument/1.0/" + encodeURIComponent(symbolInfo.name) + "/chartdata;type=quote;/json";
		var that = this;

		console.log(datafeedHost + address);

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
				"timezone": _lastYahooResponse["timezone"],
				"minmov": 1,
				"minmov2": 0,
				"pricescale": pricescale,
				"pointvalue": 1,
				"timezone": "UTC",
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


	this.sendSymbolHistory = function(symbol, startDate, resolution, response) {

		var symbolInfo = symbolsDatabase.symbolInfo(symbol);

		if (symbolInfo == null) {
			throw "unknown_symbol";
		}

		var now = new Date();

		var year = now.getFullYear();
		var month = now.getMonth();
		var day = now.getDate();

		if (resolution != "d" && resolution != "w" && resolution != "m") {
			throw "Unsupported resolution";
		}

		var address = "ichart.finance.yahoo.com/table.csv?s=" + symbolInfo.name +
			"&a=" + month +
			"&b=" + day  +
			"&c=" + (year - 1) +
			"&g=" + resolution +
			"&ignore=.csv";

		console.log("Requesting " + address);

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
			this.sendSymbolSearchResults(query["query"], query["limit"], response);
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