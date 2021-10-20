import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

type TradeContext = {
  raw: string;
  baseCoin: string;
  quoteCoin: string;
};

export const tradeContext: Writable<TradeContext> = writable({
  raw: 'BTC_USD',
  baseCoin: 'BTC',
  quoteCoin: 'USD',
});
