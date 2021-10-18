import { Store } from '$lib/stores/store';
import { browser } from '$app/env';
import Big from 'big.js';

export interface WalletAsset {
  symbol: string;
  type: 'currency' | 'coin' | 'none';
  available: Big;
  balance: Big;
}

export function isWalletAsset(asset: unknown): asset is WalletAsset {
  return (
    (asset as WalletAsset).type !== undefined &&
    (asset as WalletAsset).available !== undefined &&
    (asset as WalletAsset).balance !== undefined
  );
}

function createEmptyWalletAsset(symbol: string): [string, WalletAsset] {
  return [
    symbol,
    {
      available: Big(0),
      balance: Big(0),
      symbol,
      type: 'none',
    },
  ];
}

const supportedCurrencies = ['USD'];

class Wallet extends Store {
  #wallet: Map<string, WalletAsset>;

  constructor() {
    super();

    this.#wallet = new Map();
    if (browser) {
      try {
        const store = this.loadStore();
        if (store) {
          this.#wallet = store;
        } else {
          this.#wallet = new Map([
            createEmptyWalletAsset(supportedCurrencies[0]),
          ]);
          this.updateStore();
        }
      } catch (e) {
        //
      }
    }
  }

  get size() {
    return this.#wallet.size;
  }

  get coins(): Array<[string, WalletAsset]> {
    return [...this.#wallet.entries()].filter(([, asset]) => {
      return asset.type === 'coin';
    });
  }

  get currencies(): Array<[string, WalletAsset]> {
    return [...this.#wallet.entries()].filter(([, asset]) => {
      return asset.type === 'currency';
    });
  }

  get(symbol: string): WalletAsset {
    return this.#wallet.has(symbol)
      ? this.#wallet.get(symbol)
      : createEmptyWalletAsset(symbol)[1];
  }

  has(symbol: string): boolean {
    return this.#wallet.has(symbol);
  }

  add(
    symbol: string,
    amount: Big,
    to: 'available' | 'balance' | 'both' = 'both'
  ): void {
    if (!(amount instanceof Big)) amount = Big(amount);

    const available = to === 'available' || to === 'both' ? amount : Big(0);
    const balance = to === 'balance' || to === 'both' ? amount : Big(0);

    this.updateAsset(symbol, available, balance);
  }

  subtract(
    symbol: string,
    amount: Big,
    from: 'available' | 'balance' | 'both' = 'both'
  ): void {
    if (!(amount instanceof Big)) amount = Big(amount);

    const available =
      from === 'available' || from === 'both' ? amount.mul(-1) : Big(0);
    const balance =
      from === 'balance' || from === 'both' ? amount.mul(-1) : Big(0);

    this.updateAsset(symbol, available, balance);
  }

  convert(
    from: { symbol: string; amount: Big },
    to: { symbol: string; amount: Big }
  ): void {
    this.pauseUpdating = true;

    this.subtract(from.symbol, from.amount);
    this.add(to.symbol, to.amount);

    this.pauseUpdating = false;
    this.updateStore();
  }

  private toJSON(): string {
    try {
      return JSON.stringify(Object.fromEntries(this.#wallet.entries()));
    } catch (e) {
      return '{}';
    }
  }

  private loadStore(): Map<string, WalletAsset> | undefined {
    const json = JSON.parse(localStorage.getItem('wallet'));
    const entries = Object.entries(json ?? {});
    const assetEntries = entries.reduce<Array<[string, WalletAsset]>>(
      (sum, [symbol, asset]) => {
        if (!isWalletAsset(asset)) return sum;
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

    return assetEntries.length ? new Map(assetEntries) : undefined;
  }

  private updateAsset(symbol: string, available: Big, balance: Big): void {
    const prevAvailable = this.get(symbol)?.available ?? Big(0);
    const prevBalance = this.get(symbol)?.balance ?? Big(0);

    this.#wallet.set(symbol, {
      symbol,
      type: supportedCurrencies.includes(symbol) ? 'currency' : 'coin',
      available: available.plus(prevAvailable),
      balance: balance.plus(prevBalance),
    });

    this.updateStore();
  }

  updateStore(): void {
    super.updateStore();
    if (browser) {
      localStorage.setItem('wallet', this.toJSON());
    }
  }
}

export const wallet = new Wallet();
