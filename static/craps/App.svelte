<script>
  import { onMount } from 'svelte';

  const MODULE_URL = 'https://esm.sh/gh/tphummel/node-craps';

  let craps = null;
  let loadError = null;

  onMount(async () => {
    try {
      craps = await import(MODULE_URL);
    } catch (err) {
      loadError = err.message;
    }
  });

  $: availableStrategies = craps
    ? Object.entries(craps.betting).filter(([key, fn]) => fn.title && key !== 'lineMaxOdds')
    : [];

  let strategyName = null;
  $: if (availableStrategies.length && !strategyName) strategyName = availableStrategies[0][0];
  let numHands = 50;
  let minBet = 5;
  const maxOddsMultiple = { 4: 3, 5: 4, 6: 5, 8: 5, 9: 4, 10: 3 };

  let results = null;
  let allHistories = [];

  $: detailHands = results
    ? (results.hands <= 10
        ? allHistories
        : [
            ...allHistories.slice().sort((a, b) => b.balance - a.balance).slice(0, 5),
            ...allHistories.slice().sort((a, b) => a.balance - b.balance).slice(0, 5)
          ].sort((a, b) => a.index - b.index))
    : [];

  const resultLabels = {
    'comeout win':  'Come-out Win',
    'comeout loss': 'Come-out Loss',
    'point set':    'Point Set',
    'point win':    'Point Win',
    'seven out':    'Seven Out',
    'neutral':      'Neutral'
  };

  const resultColors = {
    'comeout win':  '#22c55e',
    'point win':    '#22c55e',
    'seven out':    '#ef4444',
    'comeout loss': '#ef4444',
    'point set':    '#3b82f6',
    'neutral':      '#888'
  };

  function buildRules() {
    return { ...craps.defaultRules, minBet, maxOddsMultiple };
  }

  function simulate() {
    const rules = buildRules();
    const bettingStrategy = craps.betting[strategyName];
    const handResults = [];
    allHistories = [];
    let wins = 0;
    let losses = 0;
    let totalWagered = 0;
    let totalReturned = 0;

    for (let i = 0; i < numHands; i++) {
      const { history, balance } = craps.playHand({ rules, bettingStrategy });

      const gained = history.reduce((sum, roll) => {
        return sum + (roll.payouts?.reduce((s, p) => s + p.principal + p.profit, 0) || 0);
      }, 0);

      totalReturned += gained;
      if (balance >= 0) wins++; else losses++;
      handResults.push({ rolls: history.length, balance });
      allHistories.push({ index: i, balance, history });
    }

    const avgBalance = handResults.reduce((s, r) => s + r.balance, 0) / numHands;
    const avgRolls   = handResults.reduce((s, r) => s + r.rolls,   0) / numHands;
    const minBalance = Math.min(...handResults.map(r => r.balance));
    const maxBalance = Math.max(...handResults.map(r => r.balance));

    results = {
      hands: numHands,
      wins,
      losses,
      avgBalance: avgBalance.toFixed(2),
      avgRolls:   avgRolls.toFixed(1),
      minBalance,
      maxBalance,
      handResults
    };
    showHistory = false;
  }

  function fmt(n) {
    const v = Number(n);
    return `${v >= 0 ? '+' : ''}$${v.toFixed(2)}`;
  }
</script>

<style>
  * { box-sizing: border-box; }
  h1 { margin: 0 0 1rem 0; font-size: 1.4rem; }
  h2 { font-size: 1.1rem; margin: 1.2rem 0 0.5rem 0; }
  .controls { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.75rem; align-items: flex-end; }
  .strategy-desc { font-size: 0.85rem; color: #555; margin-bottom: 1rem; max-width: 520px; }
  .field { display: flex; flex-direction: column; gap: 0.25rem; }
  label { font-size: 0.85rem; font-weight: bold; }
  select, input { padding: 0.4rem 0.6rem; border: 1px solid #ccc; border-radius: 4px; font-size: 0.95rem; }
  button { padding: 0.5rem 1.2rem; background: #333; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
  button:hover { background: #555; }
  button:disabled { opacity: 0.4; cursor: not-allowed; }
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.75rem; margin: 1rem 0; }
  .stat { border: 1px solid #ddd; border-radius: 6px; padding: 0.75rem; }
  .stat-label { font-size: 0.75rem; color: #666; margin-bottom: 0.2rem; }
  .stat-value { font-size: 1.3rem; font-weight: bold; }
  .positive { color: #16a34a; }
  .negative { color: #dc2626; }
  .neutral-color { color: #555; }
  table { border-collapse: collapse; width: 100%; font-size: 0.9rem; }
  th, td { border: 1px solid #ddd; padding: 5px 8px; text-align: left; }
  th { background: #f5f5f5; font-size: 0.8rem; }
  .roll-result { font-weight: bold; }
  .tag { display: inline-block; font-size: 0.75rem; padding: 1px 6px; border-radius: 3px; color: #fff; margin-right: 3px; }
  .hand-chart { display: flex; flex-wrap: wrap; gap: 4px; margin: 0.5rem 0; }
  details { border: 1px solid #ddd; border-radius: 4px; margin-bottom: 0.5rem; }
  details summary { padding: 0.5rem 0.75rem; cursor: pointer; font-size: 0.9rem; }
  details[open] summary { border-bottom: 1px solid #ddd; }
  .hand-dot { width: 14px; height: 14px; border-radius: 2px; }
  .hist-wrap { overflow-x: auto; }
  .error { color: #dc2626; font-family: monospace; }
</style>

<h1>Craps Simulator</h1>
<p>Simulate craps hands using betting strategies from <a href="https://github.com/tphummel/node-craps" target="_blank">node-craps</a>.</p>

{#if loadError}
  <p class="error">Failed to load module: {loadError}</p>
{:else}
  <div class="controls">
    <div class="field">
      <label for="strategy">Betting Strategy</label>
      <select id="strategy" bind:value={strategyName} disabled={!craps}>
        {#each availableStrategies as [key, fn]}
          <option value={key}>{fn.title}</option>
        {/each}
      </select>
    </div>
    {#if strategyName}
      <div class="strategy-desc">{craps.betting[strategyName].description}</div>
    {/if}
    <div class="field">
      <label for="hands">Hands</label>
      <input id="hands" type="number" min="1" max="10000" bind:value={numHands} style="width:100px" />
    </div>
    <div class="field">
      <label for="minbet">Min Bet ($)</label>
      <input id="minbet" type="number" min="1" max="500" bind:value={minBet} style="width:80px" />
    </div>
    <div class="field" style="justify-content:flex-end">
      <button on:click={simulate} disabled={!craps}>
        {craps ? 'Simulate' : 'Loading…'}
      </button>
    </div>
  </div>

  {#if results}
    <h2>Results — {results.hands} hands</h2>
    <div class="stats-grid">
      <div class="stat">
        <div class="stat-label">Avg Net / Hand</div>
        <div class="stat-value {Number(results.avgBalance) >= 0 ? 'positive' : 'negative'}">{fmt(results.avgBalance)}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Win / Loss Hands</div>
        <div class="stat-value neutral-color">{results.wins} / {results.losses}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Win Rate</div>
        <div class="stat-value neutral-color">{(results.wins / results.hands * 100).toFixed(1)}%</div>
      </div>
      <div class="stat">
        <div class="stat-label">Avg Rolls / Hand</div>
        <div class="stat-value neutral-color">{results.avgRolls}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Best Hand</div>
        <div class="stat-value positive">{fmt(results.maxBalance)}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Worst Hand</div>
        <div class="stat-value negative">{fmt(results.minBalance)}</div>
      </div>
    </div>

    <h2>Hand Results</h2>
    <div class="hand-chart">
      {#each results.handResults as s, i}
        <div
          class="hand-dot"
          style="background:{s.balance >= 0 ? '#22c55e' : '#ef4444'}"
          title="Hand {i+1}: {fmt(s.balance)} ({s.rolls} rolls)"
        ></div>
      {/each}
    </div>

    <h2>Hand Detail{results.hands > 10 ? ' — 5 Best & 5 Worst' : ''}</h2>
    {#each detailHands as hand}
      <details>
        <summary>Hand {hand.index + 1} — {fmt(hand.balance)} ({hand.history.length} rolls)</summary>
        <div class="hist-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Dice</th><th>Sum</th><th>Result</th><th>Point</th><th>Payouts</th></tr>
            </thead>
            <tbody>
              {#each hand.history as roll, i}
                <tr>
                  <td>{i + 1}</td>
                  <td>{roll.die1} + {roll.die2}</td>
                  <td>{roll.diceSum}</td>
                  <td>
                    <span class="roll-result" style="color:{resultColors[roll.result] || '#333'}">
                      {resultLabels[roll.result] || roll.result}
                    </span>
                  </td>
                  <td>{roll.point ?? '—'}</td>
                  <td>
                    {#if roll.payouts?.length}
                      {#each roll.payouts as p}
                        <span class="tag" style="background:{resultColors[roll.result] || '#888'}">
                          {p.type}: +${(p.principal + p.profit).toFixed(0)}
                        </span>
                      {/each}
                    {:else}
                      —
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </details>
    {/each}
  {/if}
{/if}
