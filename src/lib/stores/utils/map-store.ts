import { browser } from '$app/env';
import Store from '$lib/stores/utils/store';

export default abstract class MapStore<T> extends Store {
  protected lStorageKey: string;
  protected store: Map<string, T>;

  constructor(storeKey: string) {
    super();
    this.lStorageKey = storeKey;
    this.store = new Map();
    this.loadStore();
  }

  protected toJSON(): string {
    try {
      return JSON.stringify(Object.fromEntries(this.store.entries()));
    } catch (e) {
      return '{}';
    }
  }

  protected loadStore(): void {
    if (!browser) return;
    const json: Record<string, T> = JSON.parse(
      localStorage.getItem(this.lStorageKey) ?? '{}'
    );
    const storeEntries = Object.entries(json).reduce<Array<[string, T]>>(
      (sum, [key, val]) => {
        return [...sum, [key, this.onLoadStoreValue(val)]];
      },
      []
    );

    if (storeEntries.length) {
      this.store = new Map(storeEntries);
    }
  }

  get entries(): Array<[string, T]> {
    return Array.from(this.store.entries() ?? []);
  }

  protected onLoadStoreValue(val: T): T {
    return val;
  }
}
