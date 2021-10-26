<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import TradeHeader from './_TradeHeader.svelte';
  import { snackbars } from '$lib/stores/context';
</script>

<header class="border-b border-n300 h-16">
  <TradeHeader />
</header>

<slot />

{#each $snackbars as snack}
  <div
    class="fixed bottom-5 left-5 bg-n900 rounded-md py-3 px-5 shadow-lg text-n0 flex items-center min-w-[240px] max-w-[368px]"
  >
    <p aria-live="polite" role="status">
      {snack.message}
    </p>
    <div class="ml-auto">
      <button
        class="ml-4 active-icon"
        title="dismiss"
        on:click={() => snack.dismiss()}
      >
        <Icon class="w-6 h-6" name="close-outline" />
      </button>
    </div>
  </div>
{/each}

<style lang="postcss">
  :global(html, body) {
    @apply h-full;
  }
</style>
