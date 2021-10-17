<svelte:options namespace="svg" />

<script lang="ts">
  let cls = '';
  export { cls as class };
  export let name = '';
  export let coin = '';

  /** Whence to fetch the SVGs */
  const URLS = {
    coin: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@d5c68edec1f5eaec59ac77ff2b48144679cebca1/svg/color/{name}.svg',
    ionic: 'https://unpkg.com/ionicons@5.5.2/dist/svg/{name}.svg',
  };

  /**
   * Adds to the given svg's `class` attribute with the `cls` prop from this
   * component.
   */
  function replaceSvgClass(svg: string): string {
    let newCls = cls;
    if (!cls.includes('w-') && !cls.includes('h-')) {
      newCls += ' w-5 h-5';
    }

    if (!cls.includes('block') && !cls.includes('inline')) {
      newCls += ' inline-block';
    }

    if (!cls.includes('fill')) {
      newCls += ' fill-current';
    }

    if (svg?.includes('class')) {
      svg = svg.replace(/class="(.*?)"/, `class="$1 ${newCls}"`);
    } else {
      svg = svg.replace('<svg', `<svg class="${newCls}"`);
    }

    return svg ?? '';
  }

  /**
   * Fetches an SVG from an external URL
   */
  async function fetchSvg(type: keyof typeof URLS, name: string) {
    const url = URLS[type];
    const res = await fetch(url.replace('{name}', name));
    let text = await res.text();

    return text?.indexOf('<svg') === 0 ? text : '';
  }
</script>

{#if coin}
  {#await fetchSvg('coin', coin) then svg}
    {@html replaceSvgClass(svg)}
  {/await}
{:else if name}
  {#await fetchSvg('ionic', name) then svg}
    {@html replaceSvgClass(svg)}
  {/await}
{/if}
