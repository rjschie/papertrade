<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import Input from '$lib/components/Input.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { currency } from '$lib/helpers/format';
  import { wallet, walletHistory } from '$lib/stores/wallet';
  import type { WalletAsset } from '$lib/stores/wallet';
  import Big from 'big.js';
  import DataTable from '$lib/components/DataTable.svelte';
  import dayjs from 'dayjs';
  import { DateTime } from '$lib/constants/date';
  import { snackbars } from '$lib/stores/context';

  let showDepositModal = false;
  let showWithdrawModal = false;
  let errors: Array<string> = [];

  let symbol = 'USD';
  let amountVal = '';
  let amount = Big(0);
  $: amount = amountVal.length ? Big(amountVal) : Big(0);
  let availableAsset: WalletAsset;
  $: availableAsset = $wallet.get(symbol);

  function closeModal() {
    showDepositModal = false;
    showWithdrawModal = false;
    amountVal = '';
  }

  function validate(this: HTMLFormElement): boolean {
    errors = [];
    if (showWithdrawModal && amount.gte(availableAsset.available)) {
      errors = [...errors, 'Unavailable funds'];
    }

    return !errors.length;
  }

  function transact(this: HTMLFormElement): void {
    if (!validate.call(this)) return;

    if (showWithdrawModal) {
      $wallet.withdraw(symbol, amount);
    } else {
      $wallet.deposit(symbol, amount);
    }

    snackbars.add(
      `${showWithdrawModal ? 'Withdrew' : 'Deposited'} ${currency.format(
        symbol,
        amount
      )}.`
    );

    this.reset?.();
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

    {#if $walletHistory.entries.length}
      <DataTable
        class="w-full mt-6"
        sorting={false}
        theadClass="text-sm"
        theadBorder={false}
        rowAlternating={false}
        columns={[
          { key: 'date', class: '!px-2 !py-3', sortKey: '-timestamp' },
          { key: 'type', class: '!px-2 !py-3' },
          { key: 'amount', class: 'text-right !px-2 !py-3' },
          '',
        ]}
        data={$walletHistory.entries.map((d) => ({
          ...d,
          date: dayjs(d.timestamp).format(DateTime),
          amount: currency.format(d.symbol, d.amount),
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

      {#if showWithdrawModal}
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
      {/if}

      <form on:submit|preventDefault={transact}>
        <Input
          name="amount"
          label="Amount"
          rightLabel="USD"
          type="number"
          min="0"
          aria-label="Amount in USD"
          bind:value={amountVal}
        />

        {#if errors.length}
          <div class="my-3 p-2 rounded-md bg-r100 border border-r500 text-sm">
            <ul class="pl-2 space-y-2 text-n700">
              {#each errors as e}
                <li class="capitalize">
                  {e}
                </li>
              {/each}
            </ul>
          </div>
        {/if}

        <button class="w-full mt-4 btn btn-lg" disabled={!amountVal}>
          {showDepositModal ? 'Deposit' : 'Withdraw'}
          {currency.format(symbol, amount)}
        </button>
      </form>
    </div>
  </Modal>
{/if}
