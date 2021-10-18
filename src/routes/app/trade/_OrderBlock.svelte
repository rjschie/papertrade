<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import Input from '$lib/components/Input.svelte';
  import Big from 'big.js';
  import { WalletAsset, wallet } from '$lib/stores/wallet';
  import { Asset, ledger } from '$lib/stores/ledger';

  export let base: string;
  export let quote: string;

  let mode: 'buy' | 'sell' = 'buy';
  let quotePrice: Big;
  let amount: Big;
  let total: Big;

  let available: WalletAsset;
  $: available = $wallet.get(mode === 'buy' ? quote : base);

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
    const baseAsset: Asset = {
      symbol: base,
      amount: amount,
    };
    const quoteAsset: Asset = {
      symbol: quote,
      amount: total,
    };

    $ledger.add({
      filled: 0,
      type: 'order',
      base: baseAsset,
      quote: quoteAsset,
    });
    $wallet.subtract(quote, total, 'available');
  }
</script>

<div class="flex flex-col p-4 space-y-4">
  <div class="flex items-center">
    <button
      class:active={mode === 'buy'}
      class:btn-green={mode === 'buy'}
      class:btn-bordered={mode !== 'buy'}
      class="btn mode-btn"
      on:click={() => (mode = 'buy')}
    >
      Buy
    </button>
    <button
      class:active={mode === 'sell'}
      class:btn-red={mode === 'sell'}
      class:btn-bordered={mode !== 'sell'}
      class="btn mode-btn"
      on:click={() => (mode = 'sell')}
    >
      Sell
    </button>
  </div>

  <div class="flex items-center justify-between text-sm">
    <span class="flex items-center">
      <Icon class="mr-2" name="wallet-outline" />
      {available ? 'Available' : 'N/A'}
    </span>
    {#if available}
      <p>{available?.available} {available?.symbol}</p>
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
    class:btn-green={mode === 'buy'}
    class:btn-red={mode === 'sell'}
    class="btn btn-lg capitalize"
    disabled={!total || total?.eq(0)}
    on:click={placeOrder}
  >
    {mode}
    {base}
  </button>
</div>

<style lang="postcss">
  .mode-btn {
    @apply w-full rounded-none border-n300 hover:border-n300;
  }
  .mode-btn:not(.btn-bordered) {
    @apply w-full border border-transparent;
  }

  .mode-btn:first-child {
    @apply rounded-l-md border-r-0;
  }
  .mode-btn:last-child {
    @apply rounded-r-md border-l-0;
  }
</style>
