<script>
  const width = 16;
  let counters = [];

  async function fetchCounter(counter) {
    try {
      const res = await fetch(counter.getUrl, {
        mode: 'cors',
        headers: { Origin: window.location.origin }
      });
      if (!res.ok) throw new Error(res.status);
      counter.data = await res.json();
    } catch (e) {
      counter.error = e;
    }
    counters = counters;
  }

  function createCounter(index) {
    const id = `pixel-wall-svelte-${index}`;
    const counter = {
      id,
      getUrl: `https://bumpkit.tphummel.workers.dev/bumper/${id}.json`,
      bumpUrl: `https://bumpkit.tphummel.workers.dev/bumper/${id}/bump.json`,
      data: { count: 0 }
    };
    fetchCounter(counter);
    return counter;
  }

  async function bump(counter) {
    try {
      const res = await fetch(counter.bumpUrl, {
        mode: 'cors',
        headers: { Origin: window.location.origin }
      });
      if (!res.ok) throw new Error(res.status);
      counter.data = await res.json();
    } catch (e) {
      counter.error = e;
    }
    counters = counters;
  }

  for (let i = 0; i < width * width; i++) {
    counters.push(createCounter(i));
  }

  function color(counter) {
    const hex = (counter.data.count % 0x1000000)
      .toString(16)
      .padStart(6, '0');
    return `#${hex}`;
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
  {#each counters as counter}
    <div class="pixel" style="--color: {color(counter)}" on:click={() => bump(counter)}></div>
  {/each}
</div>
