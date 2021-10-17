import type Big from 'big.js';

export const currency = {
  format(currency: string, amount: Big): string {
    const amountAsNumber = Number(amount.toFixed(2));
    return amountAsNumber.toLocaleString('en-US', {
      style: 'currency',
      currency,
    });
  },
};
