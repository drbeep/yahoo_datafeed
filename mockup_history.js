MockupHistoryProvider = (function() {
	var that = {};

	that.symbols = function() {
		return _symbols.map(function(x) {return x.name; } );
	};


	that.isMockupSymbolName = function(name) {
		return _symbols.filter(function(x) {return x.name == name; } ).length > 0;
	};


	that.symbolInfo = function(name) {
		var symbolRecords = _symbols.filter(function(x) {return x.name == name; } );
		if (symbolRecords.length === 0) {
			throw name + " is not a mockup symbol name";
		}
		var symbolRecord = symbolRecords[0];

		var symbolInfo = applyPatch({}, _mockupSymbolInfo);
		symbolInfo.name = symbolInfo.ticker = name;
		symbolInfo.description = "Mockup symbol #" + (_symbols.indexOf(symbolRecord));

		return applyPatch(symbolInfo, symbolRecord.symbolInfoPatch);
	};

	that.history = function(name, resolution, leftDate) {
		return mockupSymbolHistory(name, resolution, leftDate);
	};


	var _symbols = [
		{
			name: "M-COMPLEX",
			symbolInfoPatch: {
				session: "0900-1630|1000-1400,1600-1900:2|1300-1700:3",
			},
			tradingSessions:  {
				tradesOnWeekends: false,

				'default': [{
						start: 9 * 60,
						end: 16 * 60 + 30
					}
				],

				//	Monday
				2:  [{
						start: 10 * 60,
						end: 14 * 60
					}, {
						start: 16 * 60,
						end: 19 * 60
					}
				],

				//	Tuesday
				3: [{
						start: 13 * 60,
						end: 17 * 60
					}
				]
			}
		}, {
			name: "M-24X7",
			symbolInfoPatch: {
				session: "24x7",
				timezone: "Europe/London",
				supported_resolutions: ["1", "15", "60"],
				intraday_multipliers: ["1", "15", "60"]
			},
			tradingSessions:  {
				tradesOnWeekends: true,
				'default': [{
						start: 0,
						end: 24 * 60
					}
				],
			}
		}
	];

	var _mockupSymbolInfo = {
		"exchange-traded": "MOCK",
		"exchange-listed": "MOCK",
		"timezone": "UTC",
		"minmov": 1,
		"minmov2": 0,
		"pricescale": 100,
		"pointvalue": 1,
		"session": "24x7",
		"has_intraday": true,
		"intraday_multipliers": ["5", "10", "15"],
		"supported_resolutions": ["5", "10", "15", "W"],
		"has_weekly_and_monthly": true,
		"has_dwm": true,
		"has_no_volume": true,
		"type": "stock"
	};


	function applyPatch(subject, patch) {
		for (var p in patch) {
			subject[p] = patch[p];
		}
		return subject;
	}


	function mockupSymbolHistory(symbol, resolution, startDateTimestamp) {
		var symbolRecords = _symbols.filter(function(x) {return x.name == symbol; } );
		if (symbolRecords.length === 0) {
			throw symbol + " is not a mockup symbol name";
		}

		var sessions = symbolRecords[0].tradingSessions;

		var result = {
			t: [], c: [], o: [], h: [], l: [], v: [],
			s: "ok"
		};

		var today = new Date();
		today.setHours(0, 0, 0, 0);

		var daysCount = parseInt(Math.max((today.valueOf()/1000 - startDateTimestamp) / (60 * 60 * 24), 1));
		var median = 40;

		for (var day = daysCount; day >= 0; day--) {
			var date = new Date(today.valueOf() - day * 24 * 60 * 60 * 1000);
			var dayIndex = date.getDay() + 1;

			if (!sessions.tradesOnWeekends && dayIndex == 1 || dayIndex == 7) {
				continue;
			}

			var daySessions = sessions.hasOwnProperty(dayIndex)
				? sessions[dayIndex]
				: sessions.default;

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

		return result;
	}


	return that;
})();


module.exports = MockupHistoryProvider;