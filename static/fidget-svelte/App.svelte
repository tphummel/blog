<script>
  const gridSize = 4;
  let counters = [];
  const EXPIRING_SOON_MS = 30 * 24 * 60 * 60 * 1000;

  function format(ts) {
    if (typeof ts !== 'string') return { display: ts, full: '' };
    const dateOnly = ts.split('T')[0];
    return { display: dateOnly, full: ts };
  }

  function expiringSoon(ts) {
    if (!ts) return false;
    return new Date(ts).getTime() - Date.now() < EXPIRING_SOON_MS;
  }

  async function fetchCounter(counter) {
    try {
      const res = await fetch(counter.getUrl, { mode: 'cors', headers: { Origin: window.location.origin } });
      if (!res.ok) throw new Error(res.status);
      counter.data = await res.json();
    } catch (e) {
      counter.error = e;
    }
    counters = counters;
  }

  function createCounter(x, y) {
    const id = `tph-fidget-${x}-${y}`;
    const counter = {
      id,
      getUrl: `https://bumpkit.tphummel.workers.dev/bumper/${id}.json`,
      bumpUrl: `https://bumpkit.tphummel.workers.dev/bumper/${id}/bump.json`,
      data: { count: 0 }
    };
    fetchCounter(counter);
    return counter;
  }

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      counters.push(createCounter(x, y));
    }
  }

  async function bump(counter) {
    try {
      const res = await fetch(counter.bumpUrl, { mode: 'cors', headers: { Origin: window.location.origin } });
      if (!res.ok) throw new Error(res.status);
      counter.data = await res.json();
    } catch (e) {
      counter.error = e;
    }
    counters = counters;
  }
</script>

<style>
#buttons-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  max-width: 600px;
  margin: 0 auto;
}
.counter-button {
  font-size: 16px;
}
.counter-button.expiring-soon {
  color: red;
}
.counter-button .count {
  display: block;
  font-size: 1.5em;
}
.error {
  color: red;
  font-size: 0.8em;
}
.payload {
  font-size: 0.8em;
  margin-top: 4px;
  border-collapse: collapse;
}
.payload td {
  padding: 0 4px;
}
</style>

<div id="buttons-container">
  {#each counters as counter}
    <button class="counter-button" on:click={() => bump(counter)} class:expiring-soon={expiringSoon(counter.data?._meta?.expires?.at)}>
      <span class="count">{counter.data.count}</span>
      {#if counter.data.created?.at || counter.data.updated?.at || counter.data._meta?.expires?.at}
        <table class="payload">
          <tbody>
            {#if counter.data.created?.at}
              {@const c = format(counter.data.created.at)}
              <tr><td>Created</td><td title="{c.full}">{c.display}</td></tr>
            {/if}
            {#if counter.data.updated?.at}
              {@const u = format(counter.data.updated.at)}
              <tr><td>Updated</td><td title="{u.full}">{u.display}</td></tr>
            {/if}
            {#if counter.data._meta?.expires?.at}
              {@const e = format(counter.data._meta.expires.at)}
              <tr><td>Expires</td><td title="{e.full}">{e.display}</td></tr>
            {/if}
          </tbody>
        </table>
      {/if}
      {#if counter.error}
        <span class="error">{counter.error.message}</span>
      {/if}
    </button>
  {/each}
</div>
