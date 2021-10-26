# Paper Trade

#### Showing a chart

1. Make REST request for `/klines?symbol=<symbol>&interval=<interval>`
1. Open WS connection at `/stream` for `<symbol>@kline\_<interval>`
1. Display klines from REST request, and add klines for each update of WS

#### TODO

- [x] Add wallet (add funds)
- [x] Add transaction history (deposits & trades)
- [x] Add open orders
- Misc. improvements
  - [x] Table component
  - [x] Table sorting
  - [~] Accessibility
  - Form revamps
    - [x] semantic
    - [x] clearing inputs
    - [x] validation component
    - [x] validate available balances
  - [x] Snackbars
- [ ] Order vs Deposit/Withdraw stores
- [ ] Load Trade pairs
- [ ] Reconcile on page load
- [ ] KLines
- [ ] Animations
- [ ] Reconcile during page loaded

#### TODO persistence

- [ ] Serverless API
