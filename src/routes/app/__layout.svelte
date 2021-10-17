<script lang="ts">
  import TradeHeader from './_TradeHeader.svelte';
</script>

<div class="border-b border-n300 h-16">
  <TradeHeader />
</div>

<slot />

<style lang="postcss">
  :global(html, body) {
    @apply h-full;
  }
</style>
