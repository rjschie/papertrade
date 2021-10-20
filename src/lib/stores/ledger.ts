import { browser } from '$app/env';
import { Store } from '$lib/stores/store';
import Big from 'big.js';

export type Asset = {
  symbol: string;
  amount: Big;
};

export type Transaction = {
  id: string;
  timestamp: number;
  base: Asset;
  quote?: Asset;
  type: 'order' | 'deposit' | 'withdrawal';
  filled: number; // 0 - 100%
};

function isTransaction(t: unknown): t is Transaction {
  return (
    (t as Transaction).id !== undefined &&
    (t as Transaction).timestamp !== undefined &&
    (t as Transaction).base !== undefined &&
    (t as Transaction).filled !== undefined
  );
}

class Ledger extends Store {
  #ledger: Map<string, Transaction>;

  constructor() {
    super();

    this.#ledger = new Map();
    if (browser) {
      try {
        this.#ledger = this.loadStore();
      } catch (e) {
        //
      }
    }
  }

  get orders(): Array<Transaction> {
    return [...this.#ledger.values()].filter((t) => {
      return t.type === 'order';
    });
  }

  get depositsAndWithdrawals(): Array<Transaction> {
    return [...this.#ledger.values()].filter((t) => {
      return t.type === 'deposit' || t.type === 'withdrawal';
    });
  }

  get(id: string): Transaction {
    return this.#ledger.get(id);
  }

  add(transaction: Omit<Transaction, 'id' | 'timestamp'>): void {
    const timestamp = Date.now();
    const id = `id_${transaction.base.symbol}${
      transaction.quote?.symbol ?? ''
    }_${timestamp}`;

    this.#ledger.set(id, {
      id,
      timestamp,
      ...transaction,
    });
    this.updateStore();
  }

  update(id: string, transaction: Partial<Transaction>): void {
    const prevTransaction = this.get(id);
    if (prevTransaction) {
      this.#ledger.set(id, {
        ...prevTransaction,
        ...transaction,
      });
    }
    this.updateStore();
  }

  updateStore() {
    super.updateStore();
    if (browser) {
      localStorage.setItem('ledger', this.toJSON());
    }
  }

  private toJSON() {
    try {
      return JSON.stringify(Object.fromEntries(this.#ledger.entries()));
    } catch (e) {
      return '{}';
    }
  }

  private loadStore() {
    const json = JSON.parse(localStorage.getItem('ledger'));
    const entries = Object.entries(json ?? {});
    const ledgerEntries = entries.reduce<Array<[string, Transaction]>>(
      (sum, [id, transaction]) => {
        if (!isTransaction(transaction)) return sum;
        return [
          ...sum,
          [
            id,
            {
              ...transaction,
              base: {
                ...transaction.base,
                amount: Big(transaction.base.amount),
              },
              ...(transaction.quote && {
                quote: {
                  ...transaction.quote,
                  amount: Big(transaction.quote.amount),
                },
              }),
            },
          ],
        ];
      },
      []
    );

    return new Map(ledgerEntries);
  }
}

export const ledger = new Ledger();
