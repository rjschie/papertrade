import { browser } from '$app/env';
import Big from 'big.js';
import { writable } from 'svelte/store';
import type { Subscriber, Readable } from 'svelte/store';

export interface Asset {
  type: 'currency' | 'coin';
  available: Big;
  balance: Big;
}

export function isAsset(asset: unknown): asset is Asset {
  return (
    (asset as Asset).type !== undefined &&
    (asset as Asset).available !== undefined &&
    (asset as Asset).balance !== undefined
  );
}

const supportedCurrencies = ['USD'];

class Wallet {
  #pauseUpdating = false;
  #store = writable(this);
  #wallet: Map<string, Asset>;

  constructor() {
    this.#wallet = new Map();
    if (browser) {
      try {
        this.#wallet = this._loadStore();
      } catch (e) {
        // no op
      }
    }
  }

  get size() {
    return this.#wallet.size;
  }

  get coins(): Array<[string, Asset]> {
    return [...this.#wallet.entries()].filter(([, asset]) => {
      return asset.type === 'coin';
    });
  }

  get currencies(): Array<[string, Asset]> {
    return [...this.#wallet.entries()].filter(([, asset]) => {
      return asset.type === 'currency';
    });
  }

  get(symbol: string): Asset | undefined {
    return this.#wallet.get(symbol);
  }

  has(symbol: string): boolean {
    return this.#wallet.has(symbol);
  }

  add(symbol: string, amount: Big): void {
    if (!(amount instanceof Big)) amount = Big(amount);
    this._updateAsset(symbol, amount);
  }

  subtract(symbol: string, amount: Big): void {
    if (!(amount instanceof Big)) amount = Big(amount);
    this._updateAsset(symbol, amount.mul(-1));
  }

  convert(
    from: { symbol: string; amount: Big },
    to: { symbol: string; amount: Big }
  ): void {
    this.#pauseUpdating = true;

    this.subtract(from.symbol, from.amount);
    this.add(to.symbol, to.amount);

    this.#pauseUpdating = false;
    this._updateStore();
  }

  subscribe(subscriber: Subscriber<this>) {
    return this.#store.subscribe(subscriber);
  }

  toJSON() {
    try {
      return JSON.stringify(Object.fromEntries(this.#wallet.entries()));
    } catch (e) {
      return '{}';
    }
  }

  private _loadStore() {
    const json = JSON.parse(localStorage.getItem('wallet'));
    const entries = Object.entries(json ?? {});
    const assetEntries = entries.reduce<Array<[string, Asset]>>(
      (sum, [symbol, asset]) => {
        if (!isAsset(asset)) return sum;
        return [
          ...sum,
          [
            symbol,
            {
              ...asset,
              available: Big(asset.available),
              balance: Big(asset.balance),
            },
          ],
        ];
      },
      []
    );

    return new Map(assetEntries);
  }

  private _updateAsset(symbol: string, amount: Big) {
    const prevAvailable = this.get(symbol)?.available ?? Big(0);
    const prevBalance = this.get(symbol)?.balance ?? Big(0);

    this.#wallet.set(symbol, {
      type: supportedCurrencies.includes(symbol) ? 'currency' : 'coin',
      available: amount.plus(prevAvailable),
      balance: amount.plus(prevBalance),
    });

    this._updateStore();
  }

  private _updateStore() {
    if (this.#pauseUpdating) return;
    if (browser) {
      localStorage.setItem('wallet', this.toJSON());
    }
    this.#store.set(this);
  }
}

export const wallet: Readable<Wallet> = new Wallet();
