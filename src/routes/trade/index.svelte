<script>
  import OrderBlock from '$lib/components/OrderBlock.svelte';
</script>

<svelte:head>
  <title>Trade | PaperTrade</title>
</svelte:head>

<div class="trading-grid">
  <div style="grid-area: header;">Header</div>
  <div style="grid-area: chart;">Chart</div>
  <div style="grid-area: orderblock;">
    <OrderBlock base="BTC" quote="USD" />
  </div>
  <div style="grid-area: orderinfo;">Order Info</div>
</div>

<style lang="postcss">
  :global(html, body) {
    @apply h-full;
  }

  .trading-grid {
    @apply h-full w-full grid;
    grid-template-columns: 1fr 16rem;
    grid-template-rows: 4rem 2fr 1fr;
    grid-template-areas:
      'header header'
      'chart orderblock'
      'orderinfo orderblock';
  }
</style>
