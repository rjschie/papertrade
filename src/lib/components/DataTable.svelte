<script lang="ts" context="module">
  import Icon from '$lib/components/Icon.svelte';

  type HeaderObj = {
    key: string;
    label?: string;
    class?: string;
    sortKey?: string;
  };

  function isHeaderObj(h: string | HeaderObj): h is HeaderObj {
    return (h as HeaderObj)?.key !== undefined;
  }
</script>

<script lang="ts">
  let cls = '';
  export { cls as class };
  export let headers: Array<string | HeaderObj>;
  export let data: Array<Record<string, unknown>> = [];

  let sort = '';
  $: sort = getHeaderSortKey(headers[0]);

  let sortedData: typeof data;
  $: sortedData = [...data].sort((a, b) => {
    const sortModifier = sort?.includes('-') ? -1 : 1;
    const sortKey = sort?.replace('-', '');
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    let dir = 0;

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      dir = aVal.localeCompare(bVal);
    } else if (typeof aVal === 'number' && typeof bVal === 'number') {
      dir = aVal - bVal;
    }

    return dir * sortModifier;
  });

  function updateSortKey(sortKey: string): void {
    /** If same as current sort, determine if direction toggle is needed */
    if (sort?.replace('-', '') === sortKey) {
      sort = sort?.includes('-') ? sortKey : `-${sortKey}`;
    } else {
      sort = sortKey;
    }
  }

  function getHeaderSortKey(header: string | HeaderObj): string {
    return isHeaderObj(header) ? header.sortKey ?? header.key : header;
  }
</script>

<table class={cls}>
  <slot name="colgroup" />
  <thead
    class="sticky top-0 bg-n0 capitalize text-left after:absolute after:h-px after:left-0 after:right-0 after:bottom-0 after:w-full after:bg-n100"
  >
    <tr>
      {#each headers as header}
        <th
          class={isHeaderObj(header) ? header.class : ''}
          on:click={() => {
            if (!header) return;
            updateSortKey(getHeaderSortKey(header));
          }}
        >
          <span class="cursor-pointer relative select-none">
            {#if header}
              {isHeaderObj(header) ? header.label ?? header.key : header}
              <span class="absolute translate-x-full -right-1 -top-px">
                <span
                  class="inline-block transition duration-100"
                  class:rotate-0={!sort?.includes('-')}
                  class:rotate-180={sort?.includes('-')}
                  class:opacity-20={getHeaderSortKey(header) !==
                    sort?.replace('-', '')}
                >
                  <Icon class="h-4 w-4" name="caret-down-outline" />
                </span>
              </span>
            {/if}
          </span>
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each sortedData as row}
      <tr>
        {#each headers.map( (h) => (isHeaderObj(h) ? h : { key: h }) ) as { key, class: cls, sortKey }}
          <td class={cls}>
            <slot name="cell" {key} data={row[key]}>
              {#if row[key]}
                {row[key]}
              {/if}
            </slot>
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style lang="postcss">
  tbody td,
  thead th {
    @apply px-2 py-1;
  }

  tbody tr:nth-child(2n + 1) {
    @apply bg-n50;
  }
</style>
