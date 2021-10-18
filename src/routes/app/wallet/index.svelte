<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import Input from '$lib/components/Input.svelte';
  import WalletTable from '$lib/components/WalletTable.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { currency } from '$lib/helpers/format';
  import { wallet } from '$lib/stores/wallet';
  import Big from 'big.js';
  import { ledger } from '$lib/stores/ledger';
  import DepositWithdrawalTable from '$lib/components/DepositWithdrawalTable.svelte';

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

<main class="w-4/5 px-6 mx-auto mt-6 pb-20">
  <section style="min-height: 20rem;">
    <div class="flex items-center">
      <h2 class="text-xl font-bold">Assets</h2>
      <button
        class="ml-auto mr-2 btn"
        on:click={() => (showDepositModal = true)}
      >
        <Icon class="mr-2 text-b100" name="wallet" />
        Deposit
      </button>
      <button
        class="btn btn-bordered"
        on:click={() => (showWithdrawModal = true)}
      >
        Withdraw
      </button>
    </div>

    {#if $wallet.currencies?.length}
      <WalletTable class="mb-6" type="currency" assets={$wallet.currencies} />
    {/if}
    {#if $wallet.coins?.length}
      <WalletTable type="coin" assets={$wallet.coins} />
    {/if}
  </section>

  <section class="mt-6">
    <div class="flex items-center">
      <h2 class="text-xl font-bold">Transaction History</h2>
    </div>

    {#if $ledger.depositsAndWithdrawals.length}
      <DepositWithdrawalTable
        transactions={$ledger.depositsAndWithdrawals.sort(
          (a, b) => b.timestamp - a.timestamp
        )}
      />
    {/if}
  </section>
</main>

{#if showDepositModal || showWithdrawModal}
  <Modal>
    <div>
      <div class="flex items-center mb-4">
        <h3 class="text-lg font-bold">
          {showDepositModal ? 'Deposit' : 'Withdraw'}
        </h3>
        <button class="ml-auto active-icon" on:click={closeModal}>
          <Icon class="w-6 h-6" name="close-circle-outline" />
        </button>
      </div>
      <form on:submit|preventDefault={() => transact(showWithdrawModal)}>
        <Input
          type="number"
          name="amount"
          label="Amount"
          rightLabel="USD"
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
