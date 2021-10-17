<script>
  import TradeHeader from './_TradeHeader.svelte';
  import KLineChart from './_KLineChart.svelte';
  import OrderBlock from './_OrderBlock.svelte';
  import OrderInfo from './_OrderInfo.svelte';
</script>

<svelte:head>
  <title>Trade | PaperTrade</title>
</svelte:head>

<div class="x-trading-grid">
  <div class="border-b x-border-color" style="grid-area: header;">
    <TradeHeader />
  </div>
  <div class="border-b x-border-color" style="grid-area: chart;">
    <KLineChart />
  </div>
  <div class="border-l x-border-color" style="grid-area: orderblock;">
    <OrderBlock base="BTC" quote="USD" />
  </div>
  <div class="x-border-color" style="grid-area: orderinfo;">
    <OrderInfo />
  </div>
</div>

<style lang="postcss">
  :global(html, body) {
    @apply h-full;
  }

  .x-trading-grid {
    @apply h-full w-full grid;
    grid-template-columns: 1fr 16rem;
    grid-template-rows: 4rem 2fr 1fr;
    grid-template-areas:
      'header header'
      'chart orderblock'
      'orderinfo orderblock';
  }

  .x-border-color {
    @apply border-n300;
  }
</style>
