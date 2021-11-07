import { DateTime } from '$lib/constants/date';
import type Big from 'big.js';
import dayjs from 'dayjs';

export const currency = {
  format(currency: string, amount: Big): string {
    const amountAsNumber = Number(amount.toFixed(2));
    return amountAsNumber.toLocaleString('en-US', {
      style: 'currency',
      currency,
    });
  },
};

export const number = {
  format(val: number): string {
    return val.toLocaleString('en-US');
  },
};

export default {
  currency: currency.format,
  number: number.format,
  date(val: number | string): string {
    return dayjs(val).format(DateTime);
  },
};
