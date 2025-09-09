<script>
  let count = 0;
  let status = '';
  let error;
  let updatedAt;
  let nightAir = false;
  const lastLoaded = new Date();
  const id = 'borfin-shlump';
  const base = 'https://bumpkit.tphummel.workers.dev/bumper';
  const getUrl = `${base}/${id}.json`;
  const bumpUrl = `${base}/${id}/bump.json`;

  function computeStatus() {
    const now = new Date();
    const six = new Date(now);
    six.setHours(6, 0, 0, 0);
    status = now > six && updatedAt < six ? 'shlumped' : 'unshlumped';
    const hour = now.getHours();
    nightAir = hour >= 22 || hour < 6;
  }

  async function fetchCount() {
    try {
      const res = await fetch(getUrl, { mode: 'cors', headers: { Origin: window.location.origin } });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      count = data.count;
      updatedAt = new Date(data.updated_at);
      computeStatus();
    } catch (e) {
      error = e;
    }
  }

  async function unshlump() {
    try {
      const res = await fetch(bumpUrl, { mode: 'cors', headers: { Origin: window.location.origin } });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      count = data.count;
      updatedAt = new Date(data.updated_at);
      computeStatus();
    } catch (e) {
      error = e;
    }
  }

  fetchCount();
  setInterval(() => location.reload(), 60_000);
</script>

<style>
  button {
    font-size: 1.2em;
    padding: 0.5em 1em;
  }
  .error {
    color: red;
  }
  .warning {
    color: orange;
    font-weight: bold;
  }
</style>

<p>Loaded at {lastLoaded.toLocaleString()}</p>
{#if nightAir}
  <p class="warning">Beware the local night air</p>
{/if}
<p>Status: {status}</p>
{#if status === 'shlumped'}
  <svg width="120" height="120" viewBox="0 0 120 120" aria-label="Borfin shlumped">
    <ellipse cx="60" cy="80" rx="40" ry="20" fill="#f44336" />
    <rect x="20" y="90" width="80" height="10" fill="#795548" />
  </svg>
  <button on:click={unshlump}>Unshlump the Borfin ({count})</button>
{:else}
  <svg width="120" height="120" viewBox="0 0 120 120" aria-label="Borfin unshlumped">
    <ellipse cx="60" cy="50" rx="20" ry="40" fill="#8bc34a" />
    <rect x="50" y="90" width="20" height="20" fill="#795548" />
  </svg>
{/if}
{#if error}
  <div class="error">{error.message}</div>
{/if}
