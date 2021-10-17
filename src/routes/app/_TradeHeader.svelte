<script lang="ts">
  import { tradeContext } from '$lib/stores/trade-context';

  const pairs = ['BTC_USD', 'ETH_USD', 'USDT_USD'];

  function updateCoinContext(e: Event) {
    let val = (e.target as HTMLSelectElement).value;
    if (val.includes('_')) {
      const [base, quote] = val.split('_');
      $tradeContext.raw = val;
      $tradeContext.baseCoin = base;
      $tradeContext.quoteCoin = quote;
    }
  }
</script>

<head class="flex items-center justify-between h-full px-4">
  <nav class="space-x-4">
    <a
      class="px-4 py-1 text-b600 font-bold bg-b100 rounded-md bg-opacity-70 hover:bg-opacity-100"
      href="/"
    >
      <span>P</span>
    </a>
    <a class="border-b border-n300 hover:border-n700" href="/app/trade">
      Trade
    </a>
    <a class="border-b border-n300 hover:border-n700" href="/app/wallet">
      Wallet
    </a>
  </nav>
  <div>
    <select
      class="px-2 py-1 rounded-md bg-n300 bg-opacity-30 hover:bg-opacity-70"
      on:change={updateCoinContext}
    >
      {#each pairs as pair}
        <option selected={$tradeContext.raw === pair} value={pair}>
          {pair.replace('_', ' / ')}
        </option>
      {/each}
    </select>
  </div>
</head>
