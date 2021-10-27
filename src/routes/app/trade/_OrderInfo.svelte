<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte';
  import { DateTime } from '$lib/constants/date';
  import { orders } from '$lib/stores/orders';
  import dayjs from 'dayjs';

  let cls = '';
  export { cls as class };

  const columns = [
    { key: 'date', label: 'Date / Time', sortKey: 'timestamp' },
    { key: 'amount', class: 'text-right' },
    { key: 'total', class: 'text-right' },
    '',
  ];
  let data: typeof orders.entries;
  $: data = $orders.entries.map((d) => ({
    ...d,
    date: dayjs(d.timestamp).format(DateTime),
    amount: `${d.base.amount} ${d.base.symbol}`,
    total: `${d.quote.amount} ${d.quote.symbol}`,
  }));
</script>

<DataTable class="{cls} w-full text-sm" {columns} {data}>
  <colgroup slot="colgroup">
    <col class="w-56" />
    <col class="w-auto" />
    <col class="w-auto" />
    <col class="w-1/4" />
  </colgroup>
</DataTable>
