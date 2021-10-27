<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import Input from '$lib/components/Input.svelte';
  import Big from 'big.js';
  import { WalletAsset, wallet } from '$lib/stores/wallet';
  import { snackbars } from '$lib/stores/context';
  import type { Asset } from '$types/asset';
  import { orders } from '$lib/stores/orders';

  export let base: string;
  export let quote: string;

  let mode: 'buy' | 'sell' = 'buy';
  let quotePrice: Big;
  let amount: Big;
  let total: Big;
  let errors: Array<{ label: string; message: string }> = [];

  let availableAsset: WalletAsset;
  $: availableAsset = $wallet.get(mode === 'buy' ? quote : base);

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

  function validate(this: HTMLFormElement): boolean {
    /** clear errors first */
    errors = [];
    if (!amount || !total) return false;

    if (mode === 'sell' && amount.gt(availableAsset.available)) {
      errors = [
        ...errors,
        { label: 'amount', message: `Not enough ${availableAsset.symbol}` },
      ];
    }

    if (mode === 'buy' && total.gt(availableAsset.available)) {
      errors = [...errors, { label: 'total', message: 'Unavailable funds' }];
    }

    return !errors.length;
  }

  function placeOrder(this: HTMLFormElement): void {
    if (!validate.call(this)) return;

    const baseAsset: Asset = {
      symbol: base,
      amount: amount,
    };
    const quoteAsset: Asset = {
      symbol: quote,
      amount: total,
    };

    $orders.add({
      filled: 0,
      type: 'market',
      base: baseAsset,
      quote: quoteAsset,
      mode,
    });

    snackbars.add('Order added.');

    quotePrice = null;
    amount = null;
    total = null;
    this.reset();
  }
</script>

<div class="flex flex-col p-4">
  <div class="flex items-center">
    <button
      class:active={mode === 'buy'}
      class:btn-green={mode === 'buy'}
      class:btn-bordered={mode !== 'buy'}
      class="btn mode-btn"
      on:click={() => {
        errors = [];
        mode = 'buy';
      }}
    >
      Buy
    </button>
    <button
      class:active={mode === 'sell'}
      class:btn-red={mode === 'sell'}
      class:btn-bordered={mode !== 'sell'}
      class="btn mode-btn"
      on:click={() => {
        errors = [];
        mode = 'sell';
      }}
    >
      Sell
    </button>
  </div>

  <div
    class="flex items-center justify-between text-sm my-3"
    class:text-r600={availableAsset.available.lte(0)}
  >
    <span class="flex items-center">
      <Icon class="mr-2" name="wallet-outline" />
      {availableAsset ? 'Available' : 'N/A'}
    </span>
    {#if availableAsset}
      <p>{availableAsset.available} {availableAsset.symbol}</p>
    {/if}
  </div>

  <form on:submit|preventDefault={placeOrder}>
    <Input
      label="Price"
      name="price"
      type="number"
      min="0"
      rightLabel={quote}
      value={quotePrice?.toString()}
      on:input={(e) => updateInput('quotePrice', e)}
    />
    <Input
      class="mt-3"
      label="Amount"
      name="amount"
      type="number"
      min="0"
      rightLabel={base}
      value={amount?.toString()}
      on:input={(e) => updateInput('amount', e)}
    />

    <label class="block mt-3" for="total">Total</label>
    <Input
      class="mt-1"
      name="total"
      type="number"
      min="0"
      rightLabel={quote}
      value={total?.toString()}
      on:input={(e) => updateInput('total', e)}
    />

    {#if errors.length}
      <div class="my-3 p-2 rounded-md bg-r100 border border-r500 text-sm">
        <ul class="pl-2 space-y-2 text-n700">
          {#each errors as e}
            <li class="capitalize">
              <span class="font-semibold">{e.label}:</span>
              {e.message}
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    <button
      class="btn btn-lg mt-3 w-full capitalize"
      class:btn-green={mode === 'buy'}
      class:btn-red={mode === 'sell'}
      disabled={!total || total?.eq(0) || availableAsset.available.lte(0)}
    >
      {mode}
      {base}
    </button>
  </form>
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
