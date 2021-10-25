<script lang="ts">
  import TradeHeader from './_TradeHeader.svelte';
</script>

<header class="border-b border-n300 h-16">
  <TradeHeader />
</header>

<slot />

<style lang="postcss">
  :global(html, body) {
    @apply h-full;
  }
</style>
