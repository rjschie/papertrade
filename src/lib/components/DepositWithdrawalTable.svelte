<script lang="ts">
  import { currency } from '$lib/helpers/format';
  import type { Transaction } from '$lib/stores/ledger';

  let cls = '';
  export { cls as class };
  export let transactions: Array<Transaction>;
</script>

<table class="{cls} w-full">
  <colgroup>
    <col class="w-1/4" />
    <col class="w-1/4" />
    <col class="w-1/4" />
  </colgroup>
  <thead class="text-sm">
    <tr>
      <th class="text-left">Date</th>
      <th class="text-left">Type</th>
      <th class="text-right">Amount</th>
    </tr>
  </thead>
  <tbody class="text-lg">
    {#each transactions as transaction}
      <tr class="border-t border-b">
        <td>{transaction.timestamp}</td>
        <td class="text-left">
          {transaction.type}
        </td>
        <td class="text-right">
          {currency.format(transaction.base.symbol, transaction.base.amount)}
        </td>
        <td />
      </tr>
    {/each}
  </tbody>
</table>

<style lang="postcss">
  tbody td,
  thead th {
    @apply px-2 py-4;
  }
</style>
