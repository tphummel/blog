<script>
  const STORAGE_KEY = 'crapsRogue:runs:v1';

  function createMockEngine() {
    const strategies = [
      { id: 'pass-line', name: 'Pass Line' },
      { id: 'dont-pass', name: "Don't Pass" },
      { id: 'come', name: 'Come Bet' }
    ];

    let scriptedRolls = [];

    return {
      listStrategies() {
        return strategies;
      },
      setRollSequence(rolls) {
        scriptedRolls = [...rolls];
      },
      nextHand({ bankroll, strategyId, handNumber }) {
        const die = scriptedRolls.length ? scriptedRolls.shift() : (Math.floor(Math.random() * 11) + 2);
        const net = die >= 8 ? 10 : die <= 4 ? -10 : 0;
        return {
          bankrollAfter: Math.max(0, bankroll + net),
          detail: {
            handNumber,
            strategyId,
            bankrollBefore: bankroll,
            bankrollAfter: Math.max(0, bankroll + net),
            net,
            summary: `Rolled ${die}; net ${net >= 0 ? '+' : ''}${net}`,
            rolls: [die],
            events: [`strategy=${strategyId}`, `die=${die}`],
            detail: { die, scripted: scriptedRolls.length >= 0 }
          }
        };
      }
    };
  }

  const engine = createMockEngine();
  let availableStrategies = engine.listStrategies();

  let run = null;
  let bankroll = 0;
  let totalHands = 0;
  let status = 'SETUP';
  let stageNumber = 0;
  let stageHands = 0;
  let stageHistory = [];
  let handLog = [];
  let expandedRows = {};
  let running = false;
  let runHistory = [];

  let runConfig = { startingBankroll: 300, goalBankroll: 500, maxTotalHands: 300 };
  let stageConfig = { strategyId: '', highWaterMark: 0, lowWaterMark: 0, maxHands: 30, speedMs: 20 };
  let rollSequenceInput = '';

  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      runHistory = parsed.runs || [];
    } catch {
      runHistory = [];
    }
  }

  function saveHistory() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 1, runs: runHistory }));
  }

  function startRun() {
    bankroll = Number(runConfig.startingBankroll);
    totalHands = 0;
    stageNumber = 0;
    stageHands = 0;
    stageHistory = [];
    handLog = [];
    run = {
      runId: crypto.randomUUID(),
      startedAtIso: new Date().toISOString(),
      runConfig: { ...runConfig },
      stageResults: [],
      hands: [],
      finalBankroll: bankroll
    };
    stageConfig.strategyId = availableStrategies[0]?.id || '';
    status = 'READY_FOR_STAGE';
  }

  function applyRollSequence() {
    const seq = rollSequenceInput
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n));

    if (seq.length && engine.setRollSequence) {
      engine.setRollSequence(seq);
    }
  }

  function evaluateExit() {
    if (bankroll <= 0) return 'BUST';
    if (bankroll >= Number(runConfig.goalBankroll)) return 'GOAL_REACHED';
    if (Number(stageConfig.highWaterMark) > 0 && bankroll >= Number(stageConfig.highWaterMark)) return 'HIT_HIGH_WATER';
    if (Number(stageConfig.lowWaterMark) > 0 && bankroll <= Number(stageConfig.lowWaterMark)) return 'HIT_LOW_WATER';
    if (stageHands >= Number(stageConfig.maxHands)) return 'HIT_STAGE_HAND_LIMIT';
    if (Number(runConfig.maxTotalHands) > 0 && totalHands >= Number(runConfig.maxTotalHands)) return 'HIT_TOTAL_HAND_LIMIT';
    return null;
  }

  function finalizeStage(exitReason, startedAtBankroll) {
    const result = {
      stageNumber,
      strategyId: stageConfig.strategyId,
      startedAtBankroll,
      endedAtBankroll: bankroll,
      handsPlayed: stageHands,
      exitReason,
      pnl: bankroll - startedAtBankroll,
      completedAtIso: new Date().toISOString()
    };

    stageHistory = [...stageHistory, result];
    run.stageResults = [...run.stageResults, result];

    if (exitReason === 'BUST' || exitReason === 'GOAL_REACHED' || exitReason === 'HIT_TOTAL_HAND_LIMIT') {
      status = 'RUN_COMPLETE';
      run.completedAtIso = new Date().toISOString();
      run.finalBankroll = bankroll;
      run.endReason = exitReason;
      run.hands = [...handLog];
      runHistory = [run, ...runHistory].slice(0, 100);
      saveHistory();
    } else {
      status = 'READY_FOR_STAGE';
    }
  }

  async function runStage() {
    if (!run || running) return;
    running = true;
    stageNumber += 1;
    stageHands = 0;
    const startedAtBankroll = bankroll;
    status = 'RUNNING_STAGE';

    while (running) {
      const handNumber = totalHands + 1;
      const { detail, bankrollAfter } = engine.nextHand({ bankroll, strategyId: stageConfig.strategyId, handNumber });
      bankroll = bankrollAfter;
      totalHands += 1;
      stageHands += 1;
      handLog = [...handLog, { ...detail, stageNumber, runId: run.runId }];

      const exit = evaluateExit();
      if (exit) {
        running = false;
        finalizeStage(exit, startedAtBankroll);
        break;
      }

      await new Promise((r) => setTimeout(r, Math.max(0, Number(stageConfig.speedMs) || 0)));
    }
  }

  function stopStage() {
    running = false;
    status = run ? 'READY_FOR_STAGE' : 'SETUP';
  }

  function toggleRow(index) {
    expandedRows[index] = !expandedRows[index];
    expandedRows = expandedRows;
  }

  function exportRun() {
    if (!run || status !== 'RUN_COMPLETE') return;
    const blob = new Blob([JSON.stringify(run, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = url;
    a.download = `craps-run-${run.runId}-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  loadHistory();
</script>

<main>
  <h1>Craps Roguelike (Lab)</h1>
  <p>Early implementation of the run/stage loop with transcript, deterministic hooks, and local history.</p>

  <section>
    <h2>Run Setup</h2>
    <label>Starting bankroll <input type="number" bind:value={runConfig.startingBankroll} /></label>
    <label>Goal bankroll <input type="number" bind:value={runConfig.goalBankroll} /></label>
    <label>Total hand cap <input type="number" bind:value={runConfig.maxTotalHands} /></label>
    <button on:click={startRun}>Start Run</button>
  </section>

  <section>
    <h2>Stage Setup</h2>
    <label>Strategy
      <select bind:value={stageConfig.strategyId}>
        {#each availableStrategies as strategy}
          <option value={strategy.id}>{strategy.name}</option>
        {/each}
      </select>
    </label>
    <label>High water <input type="number" bind:value={stageConfig.highWaterMark} /></label>
    <label>Low water <input type="number" bind:value={stageConfig.lowWaterMark} /></label>
    <label>Stage max hands <input type="number" bind:value={stageConfig.maxHands} /></label>
    <label>Delay ms <input type="number" bind:value={stageConfig.speedMs} /></label>
    <label>Deterministic roll sequence (comma separated)
      <input type="text" bind:value={rollSequenceInput} placeholder="7,11,4,10" />
    </label>
    <div class="row">
      <button on:click={applyRollSequence}>Apply Roll Sequence</button>
      <button on:click={runStage} disabled={!run || running || !stageConfig.strategyId}>Run Stage</button>
      <button on:click={stopStage} disabled={!running}>Stop Stage</button>
    </div>
  </section>

  <section>
    <h2>Live State</h2>
    <p>Status: <strong>{status}</strong></p>
    <p>Bankroll: <strong>{bankroll}</strong> | Total hands: <strong>{totalHands}</strong> | Stages: <strong>{stageHistory.length}</strong></p>
    {#if status === 'RUN_COMPLETE'}
      <button on:click={exportRun}>Download JSON report</button>
    {/if}
  </section>

  <section>
    <h2>Transcript (latest 25 hands)</h2>
    <table>
      <thead><tr><th>#</th><th>Stage</th><th>Summary</th><th>Net</th><th>Bankroll</th></tr></thead>
      <tbody>
        {#each handLog.slice(-25).reverse() as hand, i}
          <tr on:click={() => toggleRow(i)}>
            <td>{hand.handNumber}</td>
            <td>{hand.stageNumber}</td>
            <td>{hand.summary}</td>
            <td>{hand.net}</td>
            <td>{hand.bankrollAfter}</td>
          </tr>
          {#if expandedRows[i]}
            <tr class="expanded">
              <td colspan="5"><pre>{JSON.stringify(hand.detail, null, 2)}</pre></td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  </section>

  <section>
    <h2>Saved Runs ({runHistory.length})</h2>
    <ul>
      {#each runHistory.slice(0, 10) as saved}
        <li>{saved.startedAtIso} → {saved.completedAtIso || '-'} | {saved.runConfig.startingBankroll} → {saved.finalBankroll} ({saved.endReason || 'incomplete'})</li>
      {/each}
    </ul>
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: system-ui, sans-serif;
    background: #10151a;
    color: #f3f4f6;
  }
  main {
    max-width: 1000px;
    margin: 0 auto;
    padding: 1rem;
  }
  section {
    background: #1f2937;
    border-radius: 8px;
    padding: 0.8rem;
    margin-bottom: 1rem;
  }
  label {
    display: block;
    margin: 0.35rem 0;
  }
  input, select, button {
    margin-left: 0.5rem;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border-bottom: 1px solid #374151;
    padding: 0.35rem;
    text-align: left;
  }
  tr { cursor: pointer; }
  tr.expanded { cursor: default; }
  pre {
    white-space: pre-wrap;
    margin: 0;
  }
  .row { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
</style>
