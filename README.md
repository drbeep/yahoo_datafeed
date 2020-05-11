UDF-compatible Quandl/Yahoo data server
==============

This repository contains a sample of UDF-compatible data server.

Register for free at www.quandl.com to get a free API key.

Use NodeJS to launch `yahoo.js` with your Quandl key:

```bash
QUANDL_API_KEY=YOUR_KEY nodejs yahoo.js
```
Change the source URL in `index.html` file of the Charting Library:

```javascript
datafeed: new Datafeeds.UDFCompatibleDatafeed("http://localhost:8888")
```
Save the file and restart the Charting Library server.
