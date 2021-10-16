<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import Input from '$lib/components/Input.svelte';
  import Big from 'big.js';

  export let base: string;
  export let quote: string;

  let mode: 'buy' | 'sell' = 'buy';
  let quotePrice: Big;
  let amount: Big;
  let total: Big;

  function updateInput(which, e: Event): void {
    let val: Big;
    try {
      val = Big((e.target as HTMLInputElement).value);
    } catch (e) {
      total = undefined;
      return;
    }

    switch (which) {
      case 'quotePrice':
        quotePrice = val;
        if (amount) {
          total = quotePrice.mul(amount);
        }
        break;
      case 'amount':
        amount = val;
        if (quotePrice) {
          total = quotePrice.mul(amount);
        }
        break;
      case 'total':
        total = val;
        if (quotePrice) {
          amount = total.div(quotePrice);
        }
        break;
    }
  }
</script>

<div class="flex flex-col p-4 border rounded-lg border-n100 space-y-4">
  <div class="flex items-center">
    <button
      class="btn btn-buy {mode === 'buy' && 'active'}"
      on:click={() => (mode = 'buy')}
    >
      Buy
    </button>
    <button
      class="btn btn-sell {mode === 'sell' && 'active'}"
      on:click={() => (mode = 'sell')}
    >
      Sell
    </button>
  </div>

  <div class="flex items-center justify-between text-sm">
    <span><Icon class="inline mr-2" name="wallet-outline" /> Available</span>
    <p>3000 {quote}</p>
  </div>

  <div class="space-y-2">
    <Input
      label="Price"
      name="price"
      type="number"
      rightLabel={quote}
      value={quotePrice?.toString()}
      on:input={(e) => updateInput('quotePrice', e)}
    />
    <Input
      label="Amount"
      name="amount"
      type="number"
      rightLabel={base}
      value={amount?.toString()}
      on:input={(e) => updateInput('amount', e)}
    />

    <label class="block" for="total">Total</label>
    <Input
      name="total"
      type="number"
      rightLabel={quote}
      value={total?.toString()}
      on:input={(e) => updateInput('total', e)}
    />
  </div>

  <button
    class="{mode === 'buy'
      ? 'btn-buy active'
      : 'btn-sell active'} capitalize btn rounded-lg"
  >
    {mode}
    {base}
  </button>
</div>

<style lang="postcss">
  .btn {
    @apply py-2 w-full border border-transparent cursor-default;
  }

  .btn:not(.active) {
    @apply border-n300 hover:bg-n100;
  }

  .btn-buy.active {
    @apply bg-g500;
  }
  .btn-sell.active {
    @apply bg-r500;
  }

  .btn:first-child {
    @apply rounded-l-md border-r-0;
  }
  .btn:last-child {
    @apply rounded-r-md border-l-0;
  }
</style>
