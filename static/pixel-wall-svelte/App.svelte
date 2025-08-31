<script>
  import { onMount } from 'svelte';

  const width = 16;
  const storageKey = 'pixel-wall-state';
  let pixels = Array(width * width).fill('#fff');

  onMount(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === pixels.length) {
          pixels = parsed;
        }
      } catch (err) {
        console.error('failed to parse saved state', err);
      }
    }
  });

  $: localStorage.setItem(storageKey, JSON.stringify(pixels));

  function toggle(index) {
    pixels[index] = pixels[index] === '#fff' ? '#000' : '#fff';
    pixels = pixels;
  }
</script>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(16, 10px);
  }
  .pixel {
    width: 10px;
    height: 10px;
    background: var(--color);
    border: 1px solid #ccc;
  }
</style>

<div class="grid">
  {#each pixels as color, i}
    <div class="pixel" style="--color: {color}" on:click={() => toggle(i)}></div>
  {/each}
</div>
