import { writable } from 'svelte/store';
import type { Unsubscriber, Subscriber } from 'svelte/store';

export class Store {
  protected pauseUpdating = false;
  private store = writable(this);

  subscribe(subscriber: Subscriber<this>): Unsubscriber {
    return this.store.subscribe(subscriber);
  }

  protected updateStore(): void {
    if (this.pauseUpdating) return;
    this.store.set(this);
  }
}
