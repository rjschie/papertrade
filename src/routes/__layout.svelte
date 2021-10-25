<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.css';

  onMount(() => {
    document.body.removeAttribute('tabindex');
  });
</script>

<slot />
