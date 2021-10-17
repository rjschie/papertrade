<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
</script>

<div class="absolute inset-0 flex items-center justify-center w-full h-full">
  <div
    class="absolute inset-0 z-10 w-full h-full bg-opacity-40 bg-n1000"
    on:click={() => dispatch('dismiss')}
  />
  <div class="z-20 px-6 py-4 rounded-lg bg-n0">
    <slot />
  </div>
</div>
