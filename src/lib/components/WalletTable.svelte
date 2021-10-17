<script lang="ts">
  import { currency } from '$lib/helpers/format';
  import type { Asset } from '$lib/stores/wallet';

  let cls = '';
  export { cls as class };
  export let type: 'currency' | 'coin';
  export let assets: Array<[string, Asset]>;
</script>

<table class="{cls} w-full">
  <colgroup>
    <col class="w-1/4" />
    <col class="w-1/4" />
    <col class="w-1/4" />
    <col class="w-1/4" />
  </colgroup>
  <thead class="text-sm">
    <tr>
      <th />
      <th class="text-right">Balance</th>
      <th class="text-right">Available balance</th>
      <th />
    </tr>
  </thead>
  <tbody class="text-lg">
    {#each assets as [symbol, asset]}
      <tr class="border-t border-b">
        <td>{symbol}</td>
        <td class="text-right">
          {type === 'currency'
            ? currency.format(symbol, asset.balance)
            : asset.balance.toString()}
        </td>
        <td class="text-right">
          {type === 'currency'
            ? currency.format(symbol, asset.available)
            : asset.available.toString()}
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
