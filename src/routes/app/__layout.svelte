<script lang="ts">
  import TradeHeader from './_TradeHeader.svelte';
</script>

<div class="border-b border-n300 h-16">
  <TradeHeader />
</div>

<main class="h-full">
  <slot />
</main>

<style lang="postcss">
  :global(html, body) {
    @apply h-full;
  }
</style>
