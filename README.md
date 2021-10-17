# Paper Trade

#### Showing a chart

1. Make REST request for `/klines?symbol=<symbol>&interval=<interval>`
1. Open WS connection at `/stream` for `<symbol>@kline\_<interval>
1. Display klines from REST request, and add klines for each update of WS

#### TODO

- [x] Add wallet (add funds)
- [ ] Add transaction history (deposits & trades)
- [ ] Add open orders
- [ ] Reconcile on page load
- [ ] Trade more pairs
- Misc. improvements
  - [ ] Form validation
    - [ ] order book
    - [ ] wallet deposit / withdraw
  - [ ] Modal tabbing
    - use global "context" store
  - [ ] table sorting
  - [ ] "App feel"
- [ ] KLines
- [ ] Reconcile while page loaded
