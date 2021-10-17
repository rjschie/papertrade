<script lang="ts">
  let cls = '';
  export { cls as class };
  export let name: string;
  export let value: string | number | undefined;
  export let label = '';
  export let rightLabel = '';
</script>

<label
  class:input-grid-3-col={rightLabel}
  class="{cls} input-grid px-0 py-1 border rounded-md border-n300 focus-within:border-b500"
  for={name}
>
  <span class="text-n500">{label}</span>
  <input
    id={name}
    class="min-w-0 outline-none text-right"
    bind:value
    on:input
    {...$$restProps}
  />
  {#if rightLabel}
    <span class="text-n500 text-right">{rightLabel}</span>
  {/if}
</label>

<style lang="postcss">
  .input-grid {
    @apply grid gap-1;
    @apply px-4;
    grid-template-columns: max-content auto;
  }

  .input-grid-3-col {
    grid-template-columns: max-content auto 5ch;
  }

  input::-webkit-inner-spin-button,
  input::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }

  input[type='number'] {
    appearance: textfield;
  }
</style>
