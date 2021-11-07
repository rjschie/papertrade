<script lang="ts" context="module">
  import Icon from '$lib/components/Icon.svelte';

  type ColumnObj = {
    key: string;
    label?: string;
    class?: string;
    sortKey?: string;
  };

  function isColumnObj(h: string | ColumnObj): h is ColumnObj {
    return (h as ColumnObj)?.key !== undefined;
  }
</script>

<script lang="ts">
  let cls = '';
  export { cls as class };
  export let columns: Array<string | ColumnObj>;
  export let data: Array<Record<string, unknown>> = [];
  export let sorting = true;
  export let rowAlternating = true;
  export let theadBorder = true;
  export let theadClass = '';

  /**
   * Not setting default on the init of this so it still shows as a required
   * prop. But I don't want confusing errors if one hasn't passed it in.
   */
  if (!columns) columns = [];

  let sort = '';
  $: sort = getColumnSortKey(columns[0]);

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

  function getColumnSortKey(column: string | ColumnObj): string {
    return isColumnObj(column) ? column.sortKey ?? column.key : column;
  }
</script>

<table
  class={cls}
  class:row-alternating={rowAlternating}
  class:thead-border={theadBorder}
  {...$$restProps}
>
  <slot name="caption" />
  <slot name="colgroup" />
  <thead class="{theadClass} sticky top-0 bg-n0 capitalize text-left">
    <tr>
      {#each columns as column}
        <th
          class={isColumnObj(column) ? column.class ?? '' : ''}
          scope="col"
          on:click={() => {
            if (!column || !sorting) return;
            updateSortKey(getColumnSortKey(column));
          }}
        >
          <span class="relative select-none" class:cursor-pointer={sorting}>
            {#if column}
              {isColumnObj(column) ? column.label ?? column.key : column}
              {#if sorting}
                <span class="absolute translate-x-full -right-1 -top-px">
                  <span
                    class="inline-block transition duration-100"
                    class:rotate-0={!sort?.includes('-')}
                    class:rotate-180={getColumnSortKey(column) ===
                      sort?.replace('-', '') && sort?.includes('-')}
                    class:opacity-20={getColumnSortKey(column) !==
                      sort?.replace('-', '')}
                  >
                    <Icon
                      class="h-4 w-4"
                      name="caret-down-outline"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              {/if}
            {/if}
          </span>
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each sortedData as row}
      <tr>
        {#each columns.map( (h) => (isColumnObj(h) ? h : { key: h }) ) as { key, class: cellClass }}
          <slot name="cell" class={cellClass} {key} data={row[key]}>
            <td class={cellClass}>
              {#if row[key]}
                {row[key]}
              {/if}
            </td>
          </slot>
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

  .thead-border thead {
    @apply after:absolute after:h-px after:left-0 after:right-0 after:bottom-0 after:w-full after:bg-n100;
  }

  .row-alternating tbody tr:nth-child(2n + 1) {
    @apply bg-n50;
  }
</style>
