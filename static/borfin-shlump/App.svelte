<script>
  let count = 0;
  let status = '';
  let error = '';
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
    if (updatedAt) {
      status = now > six && updatedAt < six ? 'shlumped' : 'unshlumped';
    }
    const hour = now.getHours();
    nightAir = hour >= 22 || hour < 6;
  }

  function setUpdated(data) {
    const parsed = Date.parse(data.updated?.at);
    if (isNaN(parsed)) {
      const err = new Error('invalid bumper response');
      err.data = data;
      throw err;
    }
    updatedAt = new Date(parsed);
    computeStatus();
  }

  async function fetchCount() {
    error = '';
    let data;
    try {
      const res = await fetch(getUrl, { mode: 'cors', headers: { Origin: window.location.origin } });
      if (!res.ok) throw new Error(res.status);
      data = await res.json();
      count = data.count;
      setUpdated(data);
    } catch (e) {
      const body = e.data ?? data;
      error = e.message + (body ? ` ${JSON.stringify(body)}` : '');
    }
  }

  async function unshlump() {
    error = '';
    let data;
    try {
      const res = await fetch(bumpUrl, { mode: 'cors', headers: { Origin: window.location.origin } });
      if (!res.ok) throw new Error(res.status);
      data = await res.json();
      count = data.count;
      setUpdated(data);
    } catch (e) {
      const body = e.data ?? data;
      error = e.message + (body ? ` ${JSON.stringify(body)}` : '');
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
{#if updatedAt}
  <p>unshlumped at {updatedAt.toLocaleString()}</p>
{/if}
{#if status === 'shlumped'}
  <svg width="160" height="120" viewBox="0 0 160 120" aria-label="Borfin shlumped">
    <!-- blob body -->
    <path d="M60 20 C20 20, 10 80, 60 100 H120 C150 70, 140 30, 100 20 Z" fill="#8d6e63" />
    <!-- wrapped hose -->
    <path d="M0 40 C40 20, 80 40, 120 20 S160 60, 120 80 C80 100, 40 80, 0 100" stroke="#90a4ae" stroke-width="4" fill="none" />
    <!-- plugs -->
    <circle cx="0" cy="40" r="5" fill="#cfd8dc" />
    <circle cx="0" cy="100" r="5" fill="#cfd8dc" />
    <circle cx="160" cy="60" r="5" fill="#cfd8dc" />
  </svg>
  <button on:click={unshlump}>Unshlump the Borfin ({count})</button>
{:else}
  <svg width="160" height="120" viewBox="0 0 160 120" aria-label="Borfin unshlumped">
    <!-- upright body -->
    <path d="M80 10 C60 10, 40 30, 40 70 V100 H120 V70 C120 30, 100 10, 80 10 Z" fill="#8bc34a" />
    <!-- straight hose -->
    <path d="M80 0 V110" stroke="#90a4ae" stroke-width="4" fill="none" />
    <!-- plugs -->
    <circle cx="80" cy="0" r="5" fill="#cfd8dc" />
    <circle cx="80" cy="110" r="5" fill="#cfd8dc" />
  </svg>
{/if}
{#if error}
  <div class="error">{error}</div>
{/if}
