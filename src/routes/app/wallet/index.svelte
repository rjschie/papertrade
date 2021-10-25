<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import Input from '$lib/components/Input.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { currency } from '$lib/helpers/format';
  import { wallet } from '$lib/stores/wallet';
  import Big from 'big.js';
  import { ledger } from '$lib/stores/ledger';
  import DataTable from '$lib/components/DataTable.svelte';
  import dayjs from 'dayjs';
  import { DateTime } from '$lib/constants/date';

  let showDepositModal = false;
  let showWithdrawModal = false;

  let symbol = 'USD';
  let amountVal = '';
  let amount = Big(0);
  $: amount = amountVal.length ? Big(amountVal) : Big(0);

  function closeModal() {
    showDepositModal = false;
    showWithdrawModal = false;
    amountVal = '';
  }

  function transact(invert) {
    $wallet.add(symbol, invert ? amount.mul(-1) : amount);
    $ledger.add({
      type: invert ? 'withdrawal' : 'deposit',
      filled: 100,
      base: {
        symbol,
        amount,
      },
    });
    closeModal();
  }
</script>

<svelte:head>
  <title>Wallet | Paper Trade</title>
</svelte:head>

<main class="w-4/5 px-6 mx-auto mt-6 pb-20">
  <section>
    <div class="flex items-center mb-6">
      <h2 class="text-xl font-bold">Assets</h2>
      <button
        class="ml-auto mr-2 btn"
        aria-label="Deposit funds into account"
        on:click={() => (showDepositModal = true)}
      >
        <Icon class="mr-2 text-b100" name="wallet" aria-hidden={true} />
        Deposit
      </button>
      <button
        class="btn btn-bordered"
        aria-label="Withdraw funds from account"
        on:click={() => (showWithdrawModal = true)}
      >
        Withdraw
      </button>
    </div>

    {#each [$wallet.currencies, $wallet.coins] as assetStore, idx}
      {#if assetStore?.length}
        <DataTable
          class="w-full mb-12"
          sorting={false}
          theadBorder={false}
          rowAlternating={false}
          columns={[
            { key: 'symbol', label: '' },
            { key: 'balance', class: 'text-right' },
            {
              key: 'available',
              label: 'Available Balance',
              class: 'text-right',
            },
            '',
          ]}
          data={assetStore.map(([, asset]) => ({
            ...asset,
            ...(asset.type === 'currency' && {
              balance: currency.format(asset.symbol, asset.balance),
            }),
            ...(asset.type === 'currency' && {
              available: currency.format(asset.symbol, asset.available),
            }),
          }))}
        >
          <caption class="invisible absolute" slot="caption">
            {#if idx === 0}
              Currency assets
            {:else}
              Coin assets
            {/if}
          </caption>
          <td
            slot="cell"
            class="{cls} px-2 py-3 border-b border-t border-n500"
            let:class={cls}
            let:data
          >
            {data ?? ''}
          </td>
          <colgroup slot="colgroup">
            <col class="w-1/4" />
            <col class="w-1/4" />
            <col class="w-1/4" />
            <col class="w-1/4" />
          </colgroup>
        </DataTable>
      {/if}
    {/each}
  </section>

  <section class="mt-32">
    <div class="flex items-center mb-6">
      <h2 class="text-xl font-bold">Transaction History</h2>
    </div>

    {#if $ledger.depositsAndWithdrawals.length}
      <DataTable
        class="w-full mt-6"
        sorting={false}
        theadClass="text-sm"
        theadBorder={false}
        rowAlternating={false}
        columns={[
          { key: 'date', class: '!px-2 !py-3' },
          { key: 'type', class: '!px-2 !py-3' },
          { key: 'amount', class: 'text-right !px-2 !py-3' },
          '',
        ]}
        data={$ledger.depositsAndWithdrawals
          .sort((a, b) => b.timestamp - a.timestamp)
          .map((d) => ({
            ...d,
            date: dayjs(d.timestamp).format(DateTime),
            amount: currency.format(d.base.symbol, d.base.amount),
          }))}
      >
        <td
          slot="cell"
          class="{cls} border-t border-b"
          let:class={cls}
          let:data
        >
          {data ?? ''}
        </td>
        <colgroup slot="colgroup">
          <col class="w-1/4" />
          <col class="w-1/4" />
          <col class="w-1/4" />
          <col class="w-1/4" />
        </colgroup>
      </DataTable>
    {/if}
  </section>
</main>

{#if showDepositModal || showWithdrawModal}
  <Modal role="dialog" aria-labelledy="wallet-dialog">
    <div>
      <div class="flex items-center mb-4">
        <h3 id="wallet-dialog" class="text-lg font-bold">
          {showDepositModal ? 'Deposit' : 'Withdraw'}
        </h3>
        <button
          class="ml-auto active-icon"
          aria-label="Close modal"
          on:click={closeModal}
        >
          <Icon class="w-6 h-6" name="close-circle-outline" />
        </button>
      </div>
      <form on:submit|preventDefault={() => transact(showWithdrawModal)}>
        <Input
          type="number"
          name="amount"
          label="Amount"
          rightLabel="USD"
          aria-label="Amount in USD"
          bind:value={amountVal}
        />
        <button class="w-full mt-8 btn btn-lg" disabled={!amountVal}>
          {showDepositModal ? 'Deposit' : 'Withdraw'}
          {currency.format(symbol, amount)}
        </button>
      </form>
    </div>
  </Modal>
{/if}
