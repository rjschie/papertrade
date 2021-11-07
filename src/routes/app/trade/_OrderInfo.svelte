<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte';
  import format from '$lib/helpers/format';
  import { Order, orders } from '$lib/stores/orders';

  let cls = '';
  export { cls as class };

  const columns = [
    { key: 'dateFormatted', label: 'Date / Time', sortKey: 'timestamp' },
    { key: 'pair' },
    { key: 'mode' },
    { key: 'type' },
    { key: 'filledFormatted', label: 'Filled' },
    { key: 'amount' },
    { key: 'average' },
    { key: 'status' },
    '',
  ];
  let data: Array<Order>;
  $: data = $orders.entries.map((d) => ({
    ...d,
    pair: `${d.base.symbol}/${d.quote.symbol}`,
    dateFormatted: format.date(d.timestamp),
    filledFormatted: format.number(d.filled),
  }));
</script>

<DataTable class="{cls} w-full text-sm" {columns} {data}>
  <!-- <colgroup slot="colgroup">
    <col class="w-56" />
    <col class="w-auto" />
    <col class="w-auto" />
    <col class="w-1/4" />
  </colgroup> -->
</DataTable>
