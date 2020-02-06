UDF-compatible Quandl/Yahoo datafeed
==============

This repository contains a sample implementation of server-side UDF-compatible data source.

Register for free at www.quandl.com to get free API key.

Use NodeJS to launch yahoo.js with your Quandl key:

```bash
QUANDL_API_KEY=YOUR_KEY nodejs yahoo.js
```
And change source URL in index.html file of Charting Library:

```javascript
datafeed: new Datafeeds.UDFCompatibleDatafeed("http://localhost:8888")
```
Save file and restart Charting Library server.
