<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import Input from '$lib/components/Input.svelte';
  import Big from 'big.js';
  import { Asset, wallet } from '$lib/stores/wallet';

  export let base: string;
  export let quote: string;

  let mode: 'buy' | 'sell' = 'buy';
  let quotePrice: Big;
  let amount: Big;
  let total: Big;

  let available: Asset;
  $: available = $wallet.get(quote);

  function updateInput(
    which: 'quotePrice' | 'amount' | 'total',
    e: Event
  ): void {
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

  function placeOrder() {
    if (!amount || !total) return;

    $wallet.convert(
      {
        coin: quote,
        amount: total,
      },
      {
        coin: base,
        amount: amount,
      }
    );
  }
</script>

<div class="flex flex-col p-4 space-y-4">
  <div class="flex items-center">
    <button
      class:active={mode === 'buy'}
      class="btn btn-buy"
      on:click={() => (mode = 'buy')}
    >
      Buy
    </button>
    <button
      class:active={mode === 'sell'}
      class="btn btn-sell"
      on:click={() => (mode = 'sell')}
    >
      Sell
    </button>
  </div>

  <div class="flex items-center justify-between text-sm">
    <span>
      <Icon class="inline mr-2" name="wallet-outline" />
      {available ? 'Available' : 'N/A'}
    </span>
    {#if available}
      <p>{available?.amount} {quote}</p>
    {/if}
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
    class:btn-buy={mode === 'buy'}
    class:btn-sell={mode === 'sell'}
    class="active capitalize btn rounded-lg"
    on:click={placeOrder}
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
    @apply border-n300;
  }
  .btn:not(.active):hover {
    @apply bg-n100;
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
