import { browser, dev } from '$app/env';
import Big from 'big.js';
import { writable } from 'svelte/store';
import type { Subscriber, Readable } from 'svelte/store';

export interface Asset {
  amount: Big;
}

class Wallet {
  #pauseUpdating = false;
  #store = writable(this);
  #wallet: Map<string, Asset> = new Map();

  constructor() {
    if (dev && browser) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).Wallet = this;
    }
  }

  get(coin: string): Asset | undefined {
    return this.#wallet.get(coin);
  }

  add(coin: string, amount: Big | number): void {
    if (!(amount instanceof Big)) amount = Big(amount);
    this._updateAsset(coin, amount);
    this._updateStore();
  }

  subtract(coin: string, amount: Big | number): void {
    if (!(amount instanceof Big)) amount = Big(amount);
    this._updateAsset(coin, amount.mul(-1));
    this._updateStore();
  }

  convert(
    from: { coin: string; amount: Big },
    to: { coin: string; amount: Big }
  ): void {
    this.#pauseUpdating = true;

    this.subtract(from.coin, from.amount);
    this.add(to.coin, to.amount);

    this.#pauseUpdating = false;
    this._updateStore();
  }

  subscribe(subscriber: Subscriber<this>) {
    return this.#store.subscribe(subscriber);
  }

  private _updateAsset(coin: string, amount: Big) {
    const prevAmount = this.get(coin)?.amount ?? Big(0);

    this.#wallet.set(coin, {
      amount: amount.plus(prevAmount),
    });
  }

  private _updateStore() {
    if (this.#pauseUpdating) return;
    console.log('wallet:', this.#wallet);
    this.#store.set(this);
  }
}

export const wallet: Readable<Wallet> = new Wallet();
