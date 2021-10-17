import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

interface TradeContext {
  raw: string;
  baseCoin: string;
  quoteCoin: string;
}

export const tradeContext: Writable<TradeContext> = writable({
  raw: 'BTC_USD',
  baseCoin: 'BTC',
  quoteCoin: 'USD',
});
