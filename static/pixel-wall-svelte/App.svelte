<script>
  const width = 16;
  let pixels = Array(width * width).fill('#fff');

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
    border: 1px solid #eee;
  }
</style>

<div class="grid">
  {#each pixels as color, i}
    <div class="pixel" style="--color: {color}" on:click={() => toggle(i)}></div>
  {/each}
</div>
