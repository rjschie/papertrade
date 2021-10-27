import { browser } from '$app/env';
import Big from 'big.js';
import MapStore from '$lib/stores/utils/map-store';
import SetStore from '$lib/stores/utils/set-store';
import { SupportedCurrencies } from '$lib/constants/currencies';
import type { Asset } from '$types/asset';

export type WalletAsset = {
  symbol: string;
  type: 'currency' | 'coin';
  available: Big;
  balance: Big;
};

export type WalletHistoryTransaction = Asset & {
  id: string;
  timestamp: number;
  type: 'deposit' | 'withdraw';
};

export function isWalletAsset(asset: unknown): asset is WalletAsset {
  return (
    (asset as WalletAsset).symbol !== undefined &&
    (asset as WalletAsset).type !== undefined &&
    (asset as WalletAsset).available !== undefined &&
    (asset as WalletAsset).balance !== undefined
  );
}

export function isWalletHistoryTransaction(
  asset: unknown
): asset is WalletHistoryTransaction {
  return (
    (asset as WalletHistoryTransaction).id !== undefined &&
    (asset as WalletHistoryTransaction).timestamp !== undefined &&
    (asset as WalletHistoryTransaction).type !== undefined
  );
}

function createEmptyWalletAsset(symbol: string): [string, WalletAsset] {
  return [
    symbol,
    {
      available: Big(0),
      balance: Big(0),
      symbol,
      type: 'currency',
    },
  ];
}

class Wallet extends MapStore<WalletAsset> {
  constructor() {
    super('wallet');

    if (browser && !this.store.size) {
      console.log('no store, setting up');
      this.store = new Map([createEmptyWalletAsset(SupportedCurrencies[0])]);
      this.updateStore();
    }
  }

  get coins(): Array<[string, WalletAsset]> {
    return this.entries.filter(([, asset]) => {
      return asset.type === 'coin';
    });
  }

  get currencies(): Array<[string, WalletAsset]> {
    return this.entries.filter(([, asset]) => {
      return asset.type === 'currency';
    });
  }

  get(symbol: string): WalletAsset {
    return this.store.has(symbol)
      ? this.store.get(symbol)
      : createEmptyWalletAsset(symbol)[1];
  }

  has(symbol: string): boolean {
    return this.store.has(symbol);
  }

  deposit(
    symbol: string,
    amount: Big,
    to: 'available' | 'balance' | 'both' = 'both'
  ): void {
    if (!(amount instanceof Big)) amount = Big(amount);

    const available = to === 'available' || to === 'both' ? amount : Big(0);
    const balance = to === 'balance' || to === 'both' ? amount : Big(0);

    this.updateAsset(symbol, available, balance);
    walletHistory.add('deposit', { symbol, amount });
  }

  withdraw(
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
    walletHistory.add('withdraw', { symbol, amount: amount.mul(-1) });
  }

  convert(
    from: { symbol: string; amount: Big },
    to: { symbol: string; amount: Big }
  ): void {
    this.batchStoreUpdates(() => {
      this.withdraw(from.symbol, from.amount);
      this.deposit(to.symbol, to.amount);
    });
  }

  private updateAsset(symbol: string, available: Big, balance: Big): void {
    const prevAvailable = this.get(symbol)?.available ?? Big(0);
    const prevBalance = this.get(symbol)?.balance ?? Big(0);

    this.store.set(symbol, {
      symbol,
      type: SupportedCurrencies.includes(symbol) ? 'currency' : 'coin',
      available: available.plus(prevAvailable),
      balance: balance.plus(prevBalance),
    });

    this.updateStore();
  }

  protected onLoadStoreValue(val: WalletAsset): WalletAsset {
    return {
      ...val,
      available: Big(val.available),
      balance: Big(val.balance),
    };
  }
}

class WalletHistory extends SetStore<WalletHistoryTransaction> {
  constructor() {
    super('wallet-history');
  }

  add(
    type: 'deposit' | 'withdraw',
    val: Pick<WalletHistoryTransaction, 'symbol' | 'amount'>
  ): void {
    const timestamp = Date.now();
    this.store.add({
      ...val,
      id: `${type}_${val.symbol}_${timestamp}`,
      type,
      timestamp,
    });

    this.updateStore();
  }

  protected onLoadStoreValue(
    val: WalletHistoryTransaction
  ): WalletHistoryTransaction {
    return { ...val, amount: Big(val.amount) };
  }
}

export const wallet = new Wallet();
export const walletHistory = new WalletHistory();
