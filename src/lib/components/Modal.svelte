<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { createFocusTrap, FocusTrap } from 'focus-trap';

  const dispatch = createEventDispatcher();
  let element: HTMLElement;
  let trap: FocusTrap;

  onMount(() => {
    trap = createFocusTrap(element);
    trap?.activate();
  });

  onDestroy(() => {
    trap?.deactivate();
  });
</script>

<svelte:head>
  <style>
    body {
      overflow: hidden;
    }
  </style>
</svelte:head>

<div
  class="fixed inset-0 flex items-center justify-center w-full h-full"
  bind:this={element}
  {...$$restProps}
>
  <div
    class="absolute inset-0 z-10 w-full h-full bg-opacity-40 bg-n1000"
    on:click={() => dispatch('dismiss')}
  />
  <div class="z-20 px-6 py-4 rounded-lg bg-n0">
    <slot />
  </div>
</div>
