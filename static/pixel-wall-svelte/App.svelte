<script>
  const width = 16;
  let counters = [];

  function format(ts) {
    if (typeof ts !== 'string') return { display: ts, full: '' };
    const dateOnly = ts.split('T')[0];
    return { display: dateOnly, full: ts };
  }

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
    const hex = ((counter.data.count * 0xabcdef) & 0xffffff)
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
  .status-table {
    margin-top: 1em;
    border-collapse: collapse;
  }
  .status-table th,
  .status-table td {
    border: 1px solid #ccc;
    padding: 2px 4px;
    font-size: 0.8em;
  }
</style>

<div class="grid">
  {#each counters as counter}
    <div class="pixel" style="--color: {color(counter)}" on:click={() => bump(counter)}></div>
  {/each}
</div>

<table class="status-table">
  <thead>
    <tr><th>Bumper</th><th>Count</th><th>Created</th><th>Updated</th><th>Expires</th></tr>
  </thead>
  <tbody>
    {#each counters as counter}
      <tr>
        <td>{counter.id}</td>
        <td>{counter.data.count}</td>
        <td>
          {#if counter.data.created?.at}
            {@const c = format(counter.data.created.at)}
            <span title="{c.full}">{c.display}</span>
          {/if}
        </td>
        <td>
          {#if counter.data.updated?.at}
            {@const u = format(counter.data.updated.at)}
            <span title="{u.full}">{u.display}</span>
          {/if}
        </td>
        <td>
          {#if counter.data._meta?.expires?.at}
            {@const e = format(counter.data._meta.expires.at)}
            <span title="{e.full}">{e.display}</span>
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
