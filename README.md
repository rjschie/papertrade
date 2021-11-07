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
- [x] Order vs Deposit/Withdraw stores
- Update Order Info UX
  - [ ] show more order info
  - [ ] cancel orders
- [ ] Load Trade pairs
- [ ] KLines
- [ ] Reconcile on page load
- [ ] Reconcile during page loaded
- Order book improvements
  - [ ] Show "assets" below order book
    - with deposit/withdraw buttons
  - [ ] Slider 0 to 100% of available
- [ ] Animations

#### TODO persistence

- [ ] Serverless API
