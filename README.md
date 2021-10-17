# Paper Trade

#### Showing a chart

1. Make REST request for `/klines?symbol=<symbol>&interval=<interval>`
2. Open WS connection at `/stream` for `<symbol>@kline\_<interval>
3. Display klines from REST request, and add klines for each update of WS

#### TODO

1. Add wallet (add funds)
2. Add open orders
3. Add order history
4. Reconcile on page load
   4.5. Reconcile while page loaded
5. Trade more pairs
6. KLines
