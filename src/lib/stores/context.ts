import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

const snackstore: Writable<
  Array<{ id: string; message: string; dismiss: () => void }>
> = writable([]);
export const snackbars = {
  add: (message: string): void => {
    const id = `snack_${Date.now()}`;
    const dismiss = () =>
      snackstore.update((s) => s.filter((o) => o.id !== id));
    snackstore.update((s) => [...s, { id, message, dismiss }]);
    setTimeout(() => {
      dismiss();
    }, 3500);
  },
  subscribe: snackstore.subscribe,
};
