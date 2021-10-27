import { writable } from 'svelte/store';
import type { Unsubscriber, Subscriber } from 'svelte/store';
import { browser } from '$app/env';

export default abstract class Store {
  protected abstract lStorageKey: string;
  protected abstract loadStore(): void;
  protected abstract toJSON(): string;
  protected abstract store: unknown;

  #pauseUpdating = false;
  #store = writable(this);

  subscribe(subscriber: Subscriber<this>): Unsubscriber {
    return this.#store.subscribe(subscriber);
  }

  protected batchStoreUpdates(callback: () => void): void {
    this.#pauseUpdating = true;
    callback();
    this.#pauseUpdating = false;
  }

  protected updateStore(): void {
    if (this.#pauseUpdating) return;
    this.#store.set(this);
    if (browser) {
      localStorage.setItem(this.lStorageKey, this.toJSON());
    }
  }
}
