/*
	This file is a node.js module intended for use in different UDF datafeeds.
*/

//	This list should contain all the symbosl available through your datafeed.
//	The current version is extremely incomplete (as it's just a sample): Yahoo has much more of them.
var symbols = [
{ name: "^GDAXI", description:"DAX", exchange:"GER", type:"index" },
{ name: "^NSEI", description:"CNX NIFTY", exchange:"NSI", type:"index" },
{ name: "A", description:"Agilent Technologies Inc.", exchange:"NYQ", type:"stock" },
{ name: "AA", description:"Alcoa Inc.", exchange:"NYQ", type:"stock" },
{ name: "AAL", description:"American Airlines Group Inc.", exchange:"NMS", type:"stock" },
{ name: "AAPL", description:"Apple Inc.", exchange:"NMS", type:"stock" },
{ name: "ABB", description:"ABB Ltd.", exchange:"NYQ", type:"stock" },
{ name: "ABBV", description:"AbbVie Inc.", exchange:"NYQ", type:"stock" },
{ name: "ABT", description:"Abbott Laboratories", exchange:"NYQ", type:"stock" },
{ name: "ABX", description:"Barrick Gold Corporation", exchange:"NYQ", type:"stock" },
{ name: "ACDU", description:"Accredited Business Consolidators Corp.", exchange:"PNK", type:"stock" },
{ name: "ACHN", description:"Achillion Pharmaceuticals, Inc.", exchange:"NMS", type:"stock" },
{ name: "ACI", description:"Arch Coal Inc.", exchange:"NYQ", type:"stock" },
{ name: "ACN", description:"Accenture plc", exchange:"NYQ", type:"stock" },
{ name: "ACT", description:"Actavis plc", exchange:"NYQ", type:"stock" },
{ name: "ADBE", description:"Adobe Systems Inc.", exchange:"NMS", type:"stock" },
{ name: "ADSK", description:"Autodesk, Inc.", exchange:"NMS", type:"stock" },
{ name: "AEO", description:"American Eagle Outfitters, Inc.", exchange:"NYQ", type:"stock" },
{ name: "AGNC", description:"American Capital Agency Corp.", exchange:"NMS", type:"stock" },
{ name: "AIG", description:"American International Group, Inc.", exchange:"NYQ", type:"stock" },
{ name: "AKAM", description:"Akamai Technologies, Inc.", exchange:"NMS", type:"stock" },
{ name: "ALU", description:"Alcatel-Lucent", exchange:"NYQ", type:"stock" },
{ name: "ALXN", description:"Alexion Pharmaceuticals, Inc.", exchange:"NMS", type:"stock" },
{ name: "AMAT", description:"Applied Materials, Inc.", exchange:"NMS", type:"stock" },
{ name: "AMD", description:"Advanced Micro Devices, Inc.", exchange:"NYQ", type:"stock" },
{ name: "AMGN", description:"Amgen Inc.", exchange:"NMS", type:"stock" },
{ name: "AMZN", description:"Amazon.com Inc.", exchange:"NMS", type:"stock" },
{ name: "ANF", description:"Abercrombie & Fitch Co.", exchange:"NYQ", type:"stock" },
{ name: "ANR", description:"Alpha Natural Resources, Inc.", exchange:"NYQ", type:"stock" },
{ name: "APA", description:"Apache Corp.", exchange:"NYQ", type:"stock" },
{ name: "APC", description:"Anadarko Petroleum Corporation", exchange:"NYQ", type:"stock" },
{ name: "APPA", description:"AP Pharma Inc.", exchange:"", type:"stock" },
{ name: "APPAD", description:"Heron Therapeutics, Inc.", exchange:"", type:"stock" },
{ name: "ARC", description:"ARC Document Solutions, Inc.", exchange:"NYQ", type:"stock" },
{ name: "ARIA", description:"Ariad Pharmaceuticals Inc.", exchange:"NMS", type:"stock" },
{ name: "ARNA", description:"Arena Pharmaceuticals, Inc.", exchange:"NMS", type:"stock" },
{ name: "ARR", description:"ARMOUR Residential REIT, Inc.", exchange:"NYQ", type:"stock" },
{ name: "ATTY", description:"1-800-ATTORNEY Inc.", exchange:"PNK", type:"stock" },
{ name: "AUXL", description:"Auxilium Pharmaceuticals Inc.", exchange:"NMS", type:"stock" },
{ name: "AVGO", description:"Avago Technologies Limited", exchange:"NMS", type:"stock" },
{ name: "AVNR", description:"Avanir Pharmaceuticals, Inc.", exchange:"NMS", type:"stock" },
{ name: "AWAY", description:"HomeAway, Inc.", exchange:"NMS", type:"stock" },
{ name: "AXP", description:"American Express Company", exchange:"NYQ", type:"stock" },
{ name: "AZO", description:"AutoZone, Inc.", exchange:"NYQ", type:"stock" },
{ name: "BA", description:"The Boeing Company", exchange:"NYQ", type:"stock" },
{ name: "BAC", description:"Bank of America Corporation", exchange:"NYQ", type:"stock" },
{ name: "BAX", description:"Baxter International Inc.", exchange:"NYQ", type:"stock" },
{ name: "BBBY", description:"Bed Bath & Beyond Inc.", exchange:"NMS", type:"stock" },
{ name: "BBRY", description:"BlackBerry Limited", exchange:"NMS", type:"stock" },
{ name: "BBT", description:"BB&T Corporation", exchange:"NYQ", type:"stock" },
{ name: "BBY", description:"Best Buy Co., Inc.", exchange:"NYQ", type:"stock" },
{ name: "BIDU", description:"Baidu, Inc.", exchange:"NMS", type:"stock" },
{ name: "BIEL", description:"BioElectronics Corporation", exchange:"PNK", type:"stock" },
{ name: "BIIB", description:"Biogen Idec Inc.", exchange:"NMS", type:"stock" },
{ name: "BK", description:"The Bank of New York Mellon Corporation", exchange:"NYQ", type:"stock" },
{ name: "BLK", description:"BlackRock, Inc.", exchange:"NYQ", type:"stock" },
{ name: "BMO", description:"Bank of Montreal", exchange:"NYQ", type:"stock" },
{ name: "BMY", description:"Bristol-Myers Squibb Company", exchange:"NYQ", type:"stock" },
{ name: "BP", description:"BP plc", exchange:"NYQ", type:"stock" },
{ name: "BRCD", description:"Brocade Communications Systems, Inc.", exchange:"NMS", type:"stock" },
{ name: "BRCM", description:"Broadcom Corp.", exchange:"NMS", type:"stock" },
{ name: "BRK-B", description:"Berkshire Hathaway Inc.", exchange:"NYQ", type:"stock" },
{ name: "BTU", description:"Peabody Energy Corp.", exchange:"NYQ", type:"stock" },
{ name: "BX", description:"The Blackstone Group L.P.", exchange:"NYQ", type:"stock" },
{ name: "C", description:"Citigroup Inc.", exchange:"NYQ", type:"stock" },
{ name: "CHK", description:"Chesapeake Energy Corporation", exchange:"NYQ", type:"stock" },
{ name: "CII.TA", description:"", exchange:"TLV", type:"stock" },
{ name: "CNP", description:"CenterPoint Energy, Inc.", exchange:"NYQ", type:"stock" },
{ name: "COLE", description:"Cole Real Estate Investments, Inc.", exchange:"NYQ", type:"stock" },
{ name: "COWID", description:"CoroWare, Inc.", exchange:"", type:"stock" },
{ name: "CSCO", description:"Cisco Systems, Inc.", exchange:"NMS", type:"stock" },
{ name: "CXM", description:"Cardium Therapeutics Inc.", exchange:"", type:"stock" },
{ name: "D", description:"Dominion Resources, Inc.", exchange:"NYQ", type:"stock" },
{ name: "DAL", description:"Delta Air Lines Inc.", exchange:"NYQ", type:"stock" },
{ name: "DANG", description:"E-Commerce China Dangdang Inc.", exchange:"NYQ", type:"stock" },
{ name: "DBD", description:"Diebold, Incorporated", exchange:"NYQ", type:"stock" },
{ name: "DCM", description:"NTT DOCOMO, Inc.", exchange:"NYQ", type:"stock" },
{ name: "DD", description:"E. I. du Pont de Nemours and Company", exchange:"NYQ", type:"stock" },
{ name: "DDD", description:"3D Systems Corp.", exchange:"NYQ", type:"stock" },
{ name: "DE", description:"Deere & Company", exchange:"NYQ", type:"stock" },
{ name: "DE.AS", description:"", exchange:"AMS", type:"stock" },
{ name: "DECK", description:"Deckers Outdoor Corp.", exchange:"NMS", type:"stock" },
{ name: "DEI", description:"Douglas Emmett Inc", exchange:"NYQ", type:"stock" },
{ name: "DHI", description:"DR Horton Inc.", exchange:"NYQ", type:"stock" },
{ name: "DIS", description:"The Walt Disney Company", exchange:"NYQ", type:"stock" },
{ name: "DLTR", description:"Dollar Tree, Inc.", exchange:"NMS", type:"stock" },
{ name: "DNDN", description:"Dendreon Corp.", exchange:"NMS", type:"stock" },
{ name: "DO", description:"Diamond Offshore Drilling, Inc.", exchange:"NYQ", type:"stock" },
{ name: "DOV", description:"Dover Corporation", exchange:"NYQ", type:"stock" },
{ name: "DOW", description:"The Dow Chemical Company", exchange:"NYQ", type:"stock" },
{ name: "DPM", description:"DCP Midstream Partners LP", exchange:"NYQ", type:"stock" },
{ name: "DRI", description:"Darden Restaurants, Inc.", exchange:"NYQ", type:"stock" },
{ name: "DRX.IR", description:"", exchange:"ISE", type:"stock" },
{ name: "DRYN", description:"DRAYTON RICHDALE NEW", exchange:"PNK", type:"stock" },
{ name: "DRYS", description:"DryShips, Inc.", exchange:"NMS", type:"stock" },
{ name: "DSCY", description:"Discovery Oil Ltd.", exchange:"PNK", type:"stock" },
{ name: "DV", description:"DeVry Education Group Inc.", exchange:"NYQ", type:"stock" },
{ name: "DVN", description:"Devon Energy Corporation", exchange:"NYQ", type:"stock" },
{ name: "EA", description:"Electronic Arts Inc.", exchange:"NMS", type:"stock" },
{ name: "EBAY", description:"eBay Inc.", exchange:"NMS", type:"stock" },
{ name: "EBIX", description:"Ebix Inc.", exchange:"NMS", type:"stock" },
{ name: "ECRTF", description:"Colombia Crest Gold Corp.", exchange:"PNK", type:"stock" },
{ name: "ECYT", description:"Endocyte, Inc.", exchange:"NMS", type:"stock" },
{ name: "ED", description:"Consolidated Edison, Inc.", exchange:"NYQ", type:"stock" },
{ name: "EMC", description:"EMC Corporation", exchange:"NYQ", type:"stock" },
{ name: "ENT", description:"Global Eagle Entertainment Inc.", exchange:"NCM", type:"stock" },
{ name: "ERBB", description:"Tranzbyte Corporation", exchange:"PNK", type:"stock" },
{ name: "ESI", description:"ITT Educational Services Inc.", exchange:"NYQ", type:"stock" },
{ name: "ESRX", description:"Express Scripts Holding Company", exchange:"NMS", type:"stock" },
{ name: "ETFC", description:"E*TRADE Financial Corporation", exchange:"NMS", type:"stock" },
{ name: "ETP", description:"Energy Transfer Partners, L.P.", exchange:"NYQ", type:"stock" },
{ name: "EXC", description:"Exelon Corporation", exchange:"NYQ", type:"stock" },
{ name: "EXPE", description:"Expedia Inc.", exchange:"NMS", type:"stock" },
{ name: "EZCH", description:"EZchip Semiconductor Ltd.", exchange:"NMS", type:"stock" },
{ name: "F", description:"Ford Motor Co.", exchange:"NYQ", type:"stock" },
{ name: "FBEC", description:"Frontier Beverage Company, Inc.", exchange:"PNK", type:"stock" },
{ name: "FCEL", description:"FuelCell Energy Inc.", exchange:"NGM", type:"stock" },
{ name: "FRE.AX", description:"Freshtel Holdings Limited", exchange:"ASX", type:"stock" },
{ name: "GALE", description:"Galena Biopharma, Inc.", exchange:"NCM", type:"stock" },
{ name: "GCMI", description:"Geos Communications, Inc.", exchange:"PNK", type:"stock" },
{ name: "GD", description:"General Dynamics Corp.", exchange:"NYQ", type:"stock" },
{ name: "GE", description:"General Electric Company", exchange:"NYQ", type:"stock" },
{ name: "GTAT", description:"GT Advanced Technologies Inc.", exchange:"NMS", type:"stock" },
{ name: "HD", description:"The Home Depot, Inc.", exchange:"NYQ", type:"stock" },
{ name: "HIPCF", description:"HIP Energy Corp.", exchange:"PNK", type:"stock" },
{ name: "HVYB", description:"Home Valley Bancorp Inc.", exchange:"PNK", type:"stock" },
{ name: "IBM", description:"International Business Machines Corporation", exchange:"NYQ", type:"stock" },
{ name: "INTC", description:"Intel Corporation", exchange:"NMS", type:"stock" },
{ name: "JPM", description:"JPMorgan Chase & Co.", exchange:"NYQ", type:"stock" },
{ name: "KERX", description:"Keryx Biopharmaceuticals Inc.", exchange:"NCM", type:"stock" },
{ name: "KMP", description:"Kinder Morgan Energy Partners, L.P.", exchange:"NYQ", type:"stock" },
{ name: "KO", description:"The Coca-Cola Company", exchange:"NYQ", type:"stock" },
{ name: "LINE", description:"Linn Energy, LLC", exchange:"NMS", type:"stock" },
{ name: "LLY", description:"Eli Lilly and Company", exchange:"NYQ", type:"stock" },
{ name: "LULU", description:"Lululemon Athletica Inc.", exchange:"NMS", type:"stock" },
{ name: "LUV", description:"Southwest Airlines Co.", exchange:"NYQ", type:"stock" },
{ name: "LYG", description:"Lloyds Banking Group plc", exchange:"NYQ", type:"stock" },
{ name: "MCD", description:"McDonald's Corp.", exchange:"NYQ", type:"stock" },
{ name: "MNST", description:"Monster Beverage Corporation", exchange:"NMS", type:"stock" },
{ name: "MO", description:"Altria Group Inc.", exchange:"NYQ", type:"stock" },
{ name: "MPEL", description:"Melco Crown Entertainment Limited", exchange:"NMS", type:"stock" },
{ name: "MSFT", description:"Microsoft Corporation", exchange:"NMS", type:"stock" },
{ name: "NLY", description:"Annaly Capital Management, Inc.", exchange:"NYQ", type:"stock" },
{ name: "NUS", description:"Nu Skin Enterprises Inc.", exchange:"NYQ", type:"stock" },
{ name: "OLED", description:"Universal Display Corp.", exchange:"NMS", type:"stock" },
{ name: "PLPE", description:"PeopleString Corporation", exchange:"", type:"stock" },
{ name: "PNRA", description:"Panera Bread Company", exchange:"NMS", type:"stock" },
{ name: "PPJE", description:"PPJ Enterprise", exchange:"PNK", type:"stock" },
{ name: "PRAN", description:"Prana Biotechnology Limited", exchange:"NCM", type:"stock" },
{ name: "RAD", description:"Rite Aid Corporation", exchange:"NYQ", type:"stock" },
{ name: "SAM", description:"Boston Beer Co. Inc.", exchange:"NYQ", type:"stock" },
{ name: "SAN", description:"Banco Santander, S.A.", exchange:"NYQ", type:"stock" },
{ name: "SCTY", description:"SolarCity Corporation", exchange:"NMS", type:"stock" },
{ name: "SD", description:"SandRidge Energy, Inc.", exchange:"NYQ", type:"stock" },
{ name: "SMXMF", description:"Samex Mining Corp.", exchange:"PNK", type:"stock" },
{ name: "SPDE", description:"Speedus Corp.", exchange:"PNK", type:"stock" },
{ name: "STCA", description:"Statmon Technologies Corp.", exchange:"PNK", type:"stock" },
{ name: "STZ", description:"Constellation Brands Inc.", exchange:"NYQ", type:"stock" },
{ name: "SU", description:"Suncor Energy Inc.", exchange:"NYQ", type:"stock" },
{ name: "T", description:"AT&T, Inc.", exchange:"NYQ", type:"stock" },
{ name: "TEG.AX", description:"Triangle Energy (Global) Limited", exchange:"ASX", type:"stock" },
{ name: "TTW.V", description:"TIMES THREE WIRELESS INC", exchange:"VAN", type:"stock" },
{ name: "UA", description:"Under Armour, Inc.", exchange:"NYQ", type:"stock" },
{ name: "UCD.SG", description:"UC RESOURCES", exchange:"STU", type:"stock" },
{ name: "USB", description:"U.S. Bancorp", exchange:"NYQ", type:"stock" },
{ name: "VLG.MC", description:"", exchange:"MCE", type:"stock" },
{ name: "VZ", description:"Verizon Communications Inc.", exchange:"NYQ", type:"stock" },
{ name: "WDC", description:"Western Digital Corporation", exchange:"NMS", type:"stock" },
{ name: "WFC", description:"Wells Fargo & Company", exchange:"NYQ", type:"stock" },
{ name: "WLT", description:"Walter Energy, Inc.", exchange:"NYQ", type:"stock" },
{ name: "XOM", description:"Exxon Mobil Corporation", exchange:"NYQ", type:"stock" },
{ name: "YORK", description:"York Research Corp.", exchange:"PNK", type:"stock" },
{ name: "ZNNC", description:"Zann Corp.", exchange:"PNK", type:"stock" }];


var symbolsMap = {};

for (var i = 0; i < symbols.length; ++i) {
	symbolsMap[symbols[i].name] = symbols[i];
}



function searchResultFromDatabaseItem(item) {
	return {
		symbol: item.name,
		full_name: item.name,
		description: item.description,
		exchange: item.exchange,
		type: item.type
	};
}



exports.search = function (searchText, type, exchange, maxRecords) {
	var MAX_SEARCH_RESULTS = !!maxRecords ? maxRecords : 50;

	var results = [];
	var queryIsEmpty = !searchText || searchText.length == 0;

	for (var i = 0; i < symbols.length; ++i) {

		var item = symbols[i];

		if (type && type.length > 0 && item.type != type) {
			continue;
		}

		if (exchange && exchange.length > 0 && item.exchange != exchange) {
			continue;
		}

		if (queryIsEmpty || item.name.indexOf(searchText) == 0) {
			results.push(searchResultFromDatabaseItem(item));
		}

		if (results.length >= MAX_SEARCH_RESULTS) {
			break;
		}
	}

	return results;
}


exports.symbolInfo = function (symbolName) {
	if (!symbolsMap.hasOwnProperty(symbolName)) {
		return null;
	}

	return symbolsMap[symbolName];
}