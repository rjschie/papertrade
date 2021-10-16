# Paper Trade

#### Showing a chart

1. Make REST request for `/klines?symbol=<symbol>&interval=<interval>`
2. Open WS connection at `/stream` for `<symbol>@kline\_<interval>
3. Display klines from REST request, and add klines for each update of WS
