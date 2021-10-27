import { browser } from '$app/env';
import Store from '$lib/stores/utils/store';

export default class SetStore<T> extends Store {
  protected lStorageKey: string;
  protected store: Set<T>;

  constructor(storeKey: string) {
    super();
    this.lStorageKey = storeKey;
    this.store = new Set();
    this.loadStore();
  }

  protected toJSON(): string {
    try {
      return JSON.stringify(Array.from(this.store));
    } catch (e) {
      return '[]';
    }
  }

  protected loadStore(): void {
    if (!browser) return;
    const json: T[] = JSON.parse(
      localStorage.getItem(this.lStorageKey) ?? '[]'
    );
    const storeValues = json.reduce<Array<T>>((sum, val) => {
      return [...sum, this.onLoadStoreValue(val)];
    }, []);

    if (storeValues.length) {
      this.store = new Set(storeValues);
    }
  }

  get entries(): T[] {
    return Array.from(this.store);
  }

  protected onLoadStoreValue(val: T): T {
    return val;
  }
}
