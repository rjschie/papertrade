<script lang="ts">
  import { base } from '$app/paths';
  import { ledger } from '$lib/stores/ledger';

  let cls = '';
  export { cls as class };
</script>

<table class="{cls} text-sm w-full">
  <colgroup>
    <col class="w-1/4" />
    <col class="w-1/4" />
    <col class="w-1/4" />
    <col class="w-1/4" />
  </colgroup>
  <thead class="sticky top-0 bg-n0">
    <tr>
      <th class="text-left">Date</th>
      <th class="text-right">Amount</th>
      <th class="text-right">Total</th>
      <th />
    </tr>
  </thead>
  <tbody>
    {#each $ledger.orders as order (order.id)}
      <tr>
        <td>{order.timestamp}</td>
        <td class="text-right">{order.base.amount} {order.base.symbol}</td>
        <td class="text-right">{order.quote.amount} {order.quote.symbol}</td>
        <td />
      </tr>
    {/each}
  </tbody>
</table>

<style lang="postcss">
  tbody td,
  thead th {
    @apply px-2 py-1;
  }

  tbody tr:nth-child(2n + 1) {
    @apply bg-n50;
  }
  /**/
</style>
