import SetStore from '$lib/stores/utils/set-store';
import { wallet } from '$lib/stores/wallet';
import type { Asset } from '$types/asset';
import Big from 'big.js';

export type Order = {
  id: string;
  timestamp: number;
  pair: string;
  base: Asset;
  quote: Asset;
  mode: 'buy' | 'sell';
  type: 'limit' | 'market' | 'stop-limit';
  triggerPrice: number;
  filled: number; // num filled of total base amount
  filledAveragePrice: number;
  status: 'canceled' | 'pending' | 'executed';
};

export function isOrder(t: unknown): t is Order {
  return (
    (t as Order).id !== undefined &&
    (t as Order).timestamp !== undefined &&
    (t as Order).base !== undefined &&
    (t as Order).quote !== undefined &&
    (t as Order).mode !== undefined &&
    (t as Order).type !== undefined &&
    (t as Order).filled !== undefined
  );
}

class Orders extends SetStore<Order> {
  constructor() {
    super('orders');
  }

  add(order: Omit<Order, 'id' | 'timestamp'>): void {
    const timestamp = Date.now();
    const id = `id_${order.base.symbol}${order.quote.symbol}_${timestamp}`;

    this.store.add({
      ...order,
      id,
      timestamp,
    });
    this.updateStore();
    wallet.withdraw(order.quote.symbol, order.quote.amount, 'available');
  }

  protected onLoadStoreValue(val: Order): Order {
    return {
      ...val,
      base: {
        ...val.base,
        amount: Big(val.base.amount),
      },
      quote: {
        ...val.quote,
        amount: Big(val.quote.amount),
      },
    };
  }
}

export const orders = new Orders();
