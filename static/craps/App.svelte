<script>
  // ── settle.js ──────────────────────────────────────────────────────────────
  function passLine({ bets, hand }) {
    if (!bets?.pass?.line) return { bets };
    const actionResults = ['seven out', 'point win', 'comeout win', 'comeout loss'];
    if (!actionResults.includes(hand.result)) return { bets };
    const payout = {
      type: hand.result,
      principal: bets.pass.line.amount,
      profit: bets.pass.line.amount
    };
    delete bets.pass.line;
    if (hand.result === 'comeout loss' || hand.result === 'seven out') return { bets };
    return { payout, bets };
  }

  function passOdds({ bets, hand }) {
    if (!bets?.pass?.odds) return { bets };
    const actionResults = ['seven out', 'point win'];
    if (!actionResults.includes(hand.result)) return { bets };
    const oddsTable = { 4: 2, 5: 1.5, 6: 1.2, 8: 1.2, 9: 1.5, 10: 2 };
    const payout = {
      type: 'pass odds win',
      principal: bets.pass.odds.amount,
      profit: bets.pass.odds.amount * oddsTable[hand.diceSum]
    };
    delete bets.pass.odds;
    if (hand.result === 'seven out') return { bets };
    return { payout, bets };
  }

  function placeBet({ rules, bets, hand, placeNumber }) {
    const label = placeNumber === 6 ? 'six' : placeNumber === 8 ? 'eight' : String(placeNumber);
    if (!bets?.place?.[label]) return { bets };
    const comeOutResults = ['comeout win', 'comeout loss', 'point set'];
    if (comeOutResults.includes(hand.result)) {
      const bet = bets.place[label];
      const betWorking = bet.working !== undefined ? bet.working : !(rules?.placeBetsOffOnComeOut);
      if (!betWorking) return { bets };
    }
    if (hand.diceSum === 7 && hand.result === 'seven out') {
      delete bets.place[label];
      if (Object.keys(bets.place).length === 0) delete bets.place;
      return { bets };
    }
    if (hand.diceSum === placeNumber && hand.result !== 'point set') {
      const payouts = { 6: 7 / 6, 8: 7 / 6 };
      const payout = {
        type: `place ${placeNumber} win`,
        principal: bets.place[label].amount,
        profit: bets.place[label].amount * payouts[placeNumber]
      };
      delete bets.place[label];
      return { payout, bets };
    }
    return { bets };
  }

  function comeLine({ bets, hand }) {
    if (!bets?.come) return { bets };
    const payouts = [];
    bets.come.points = bets.come.points || {};
    Object.keys(bets.come.points).forEach(point => {
      const remainingBets = [];
      bets.come.points[point].forEach(bet => {
        if (hand.result === 'seven out') return;
        if (hand.diceSum === Number(point)) {
          payouts.push({ type: 'come line win', principal: bet.line.amount, profit: bet.line.amount });
          if (bet.odds) {
            const oddsTable = { 4: 2, 5: 1.5, 6: 1.2, 8: 1.2, 9: 1.5, 10: 2 };
            payouts.push({ type: 'come odds win', principal: bet.odds.amount, profit: bet.odds.amount * oddsTable[point] });
          }
          return;
        }
        remainingBets.push(bet);
      });
      if (remainingBets.length) {
        bets.come.points[point] = remainingBets;
      } else {
        delete bets.come.points[point];
      }
    });
    if (Object.keys(bets.come.points).length === 0) delete bets.come.points;
    const pending = bets.come.pending || [];
    if (pending.length) {
      const immediateWins = [7, 11];
      const immediateLosses = [2, 3, 12];
      pending.forEach(bet => {
        if (immediateWins.includes(hand.diceSum)) {
          payouts.push({ type: 'come line win', principal: bet.amount, profit: bet.amount });
        } else if (!immediateLosses.includes(hand.diceSum)) {
          bets.come.points = bets.come.points || {};
          bets.come.points[hand.diceSum] = bets.come.points[hand.diceSum] || [];
          bets.come.points[hand.diceSum].push({ line: { amount: bet.amount } });
        }
      });
      delete bets.come.pending;
    }
    if (bets.come && Object.keys(bets.come).length === 0) delete bets.come;
    return { bets, payouts };
  }

  function settleAll({ bets, hand, rules }) {
    const payouts = [];
    let r;
    r = passLine({ bets, hand }); bets = r.bets; if (r.payout) payouts.push(r.payout);
    r = passOdds({ bets, hand }); bets = r.bets; if (r.payout) payouts.push(r.payout);
    r = comeLine({ bets, hand }); bets = r.bets; payouts.push(...(r.payouts || []));
    r = placeBet({ rules, bets, hand, placeNumber: 6 }); bets = r.bets; if (r.payout) payouts.push(r.payout);
    r = placeBet({ rules, bets, hand, placeNumber: 8 }); bets = r.bets; if (r.payout) payouts.push(r.payout);
    const summary = payouts.reduce((m, p) => {
      m.principal += p.principal; m.profit += p.profit; m.total += p.principal + p.profit; m.ledger.push(p); return m;
    }, { principal: 0, profit: 0, total: 0, ledger: [] });
    bets.payouts = summary;
    return bets;
  }

  // ── betting.js ─────────────────────────────────────────────────────────────
  function minPassLineOnly({ rules, bets: eb, hand }) {
    const bets = Object.assign({ new: 0 }, eb);
    if (hand.isComeOut && !bets?.pass?.line) {
      bets.pass = { line: { amount: rules.minBet } };
      bets.new += rules.minBet;
    }
    return bets;
  }

  function lineMaxOdds({ rules, bets: eb, point, shouldMakeLineBet, shouldMakeOddsBet, betKey = 'pass' }) {
    const bets = Object.assign({ new: 0 }, eb);
    bets[betKey] = bets[betKey] || {};
    if (shouldMakeLineBet && !bets[betKey].line) {
      bets[betKey].line = { amount: rules.minBet };
      bets.new += rules.minBet;
    }
    if (shouldMakeOddsBet && bets[betKey].line && !bets[betKey].odds) {
      const oddsAmount = rules.maxOddsMultiple[point] * bets[betKey].line.amount;
      bets[betKey].odds = { amount: oddsAmount };
      bets.new += oddsAmount;
    }
    return bets;
  }

  function minPassLineMaxOdds(opts) {
    return lineMaxOdds({
      rules: opts.rules, bets: opts.bets, point: opts.hand.point,
      shouldMakeLineBet: opts.hand.isComeOut, shouldMakeOddsBet: opts.hand.isComeOut === false
    });
  }

  function placeSixEight({ rules, bets: eb = {}, hand }) {
    const bets = Object.assign({ new: 0 }, eb);
    if (hand.isComeOut) return bets;
    bets.place = bets.place || {};
    const placeAmount = Math.ceil(rules.minBet / 6) * 6;
    if (!bets.place.six) { bets.place.six = { amount: placeAmount }; bets.new += placeAmount; }
    if (!bets.place.eight) { bets.place.eight = { amount: placeAmount }; bets.new += placeAmount; }
    return bets;
  }

  function placeSixEightUnlessPoint(opts) {
    const { hand } = opts;
    const bets = placeSixEight(opts);
    if (hand.point === 6 && bets.place?.six) { bets.new -= bets.place.six.amount; delete bets.place.six; }
    if (hand.point === 8 && bets.place?.eight) { bets.new -= bets.place.eight.amount; delete bets.place.eight; }
    if (bets.place && Object.keys(bets.place).length === 0) delete bets.place;
    return bets;
  }

  function minComeLineMaxOdds(opts) {
    const { rules, bets: eb = {}, hand, maxComeBets = 1 } = opts;
    const bets = Object.assign({ new: 0 }, eb);
    if (hand.isComeOut) return bets;
    bets.come = bets.come || {};
    bets.come.pending = bets.come.pending || [];
    bets.come.points = bets.come.points || {};
    const pendingCount = bets.come.pending.length;
    const pointCount = Object.values(bets.come.points).reduce((m, pb) => m + pb.length, 0);
    if (pendingCount === 0 && pointCount < maxComeBets) {
      bets.come.pending.push({ amount: rules.minBet });
      bets.new += rules.minBet;
    }
    Object.keys(bets.come.points).forEach(point => {
      bets.come.points[point].forEach(bet => {
        if (!bet.line || bet.odds) return;
        const oddsAmount = rules.maxOddsMultiple[point] * bet.line.amount;
        bet.odds = { amount: oddsAmount };
        bets.new += oddsAmount;
      });
    });
    return bets;
  }

  function minPassLinePlaceSixEight(opts) {
    let bets = minPassLineOnly(opts);
    return placeSixEightUnlessPoint({ ...opts, bets });
  }

  function minPassLineMaxOddsPlaceSixEight(opts) {
    let bets = minPassLineMaxOdds(opts);
    return placeSixEightUnlessPoint({ ...opts, bets });
  }

  function passCome68(opts) {
    let bets = minPassLineMaxOdds(opts);
    bets = minComeLineMaxOdds({ ...opts, bets });
    const coveredPoints = new Set([opts.hand.point, ...Object.keys(bets?.come?.points || {}).map(Number)]);
    bets = placeSixEight({ ...opts, bets });
    if (coveredPoints.has(6) && bets.place?.six) { bets.new -= bets.place.six.amount; delete bets.place.six; }
    if (coveredPoints.has(8) && bets.place?.eight) { bets.new -= bets.place.eight.amount; delete bets.place.eight; }
    if (bets.place && Object.keys(bets.place).length === 0) delete bets.place;
    return bets;
  }

  const strategies = {
    'Pass Line Only': minPassLineOnly,
    'Pass + Max Odds': minPassLineMaxOdds,
    'Pass + Place 6/8': minPassLinePlaceSixEight,
    'Pass + Max Odds + Place 6/8': minPassLineMaxOddsPlaceSixEight,
    'Pass + Come + Place 6/8': passCome68
  };

  // ── core game logic ────────────────────────────────────────────────────────
  const defaultRules = {
    comeOutLoss: [2, 3, 12],
    comeOutWin: [7, 11],
    placeBetsOffOnComeOut: true,
    minBet: 5,
    maxOddsMultiple: { 4: 3, 5: 4, 6: 5, 8: 5, 9: 4, 10: 3 }
  };

  function rollD6() { return 1 + Math.floor(Math.random() * 6); }

  function shoot(before, dice, rules) {
    const sorted = [...dice].sort((a, b) => a - b);
    const after = { die1: sorted[0], die2: sorted[1], diceSum: dice[0] + dice[1] };
    if (before.isComeOut) {
      if (rules.comeOutLoss.includes(after.diceSum)) {
        after.result = 'comeout loss'; after.isComeOut = true;
      } else if (rules.comeOutWin.includes(after.diceSum)) {
        after.result = 'comeout win'; after.isComeOut = true;
      } else {
        after.result = 'point set'; after.isComeOut = false; after.point = after.diceSum;
      }
    } else {
      if (before.point === after.diceSum) {
        after.result = 'point win'; after.isComeOut = true;
      } else if (after.diceSum === 7) {
        after.result = 'seven out'; after.isComeOut = true;
      } else {
        after.result = 'neutral'; after.point = before.point; after.isComeOut = false;
      }
    }
    return after;
  }

  function playHand({ rules, bettingStrategy, balance = 0 }) {
    const history = [];
    let hand = { isComeOut: true };
    let bets;
    const playerMind = {};
    while (hand.result !== 'seven out') {
      bets = bettingStrategy({ rules, bets, hand, playerMind });
      balance -= bets.new;
      const betsBefore = JSON.parse(JSON.stringify(bets));
      delete bets.new;
      hand = shoot(hand, [rollD6(), rollD6()], rules);
      bets = settleAll({ rules, bets, hand });
      const payouts = bets.payouts;
      if (payouts?.total) balance += payouts.total;
      if (payouts?.ledger?.length) hand.payouts = payouts.ledger;
      if (payouts) delete bets.payouts;
      hand.betsBefore = betsBefore;
      history.push(hand);
    }
    return { history, balance };
  }

  // ── UI state ───────────────────────────────────────────────────────────────
  let strategyName = 'Pass Line Only';
  let numSessions = 50;
  let minBet = 5;
  let maxOdds = 3; // multiplier applied uniformly for simplicity

  let results = null;
  let lastHistory = null;
  let showHistory = false;

  const resultLabels = {
    'comeout win': 'Come-out Win',
    'comeout loss': 'Come-out Loss',
    'point set': 'Point Set',
    'point win': 'Point Win',
    'seven out': 'Seven Out',
    'neutral': 'Neutral'
  };

  const resultColors = {
    'comeout win': '#22c55e',
    'point win': '#22c55e',
    'seven out': '#ef4444',
    'comeout loss': '#ef4444',
    'point set': '#3b82f6',
    'neutral': '#888'
  };

  function buildRules() {
    return {
      ...defaultRules,
      minBet,
      maxOddsMultiple: { 4: maxOdds, 5: maxOdds, 6: maxOdds, 8: maxOdds, 9: maxOdds, 10: maxOdds }
    };
  }

  function simulate() {
    const rules = buildRules();
    const strategy = strategies[strategyName];
    const sessionResults = [];
    let totalWagered = 0;
    let totalReturned = 0;
    let wins = 0;
    let losses = 0;

    for (let i = 0; i < numSessions; i++) {
      const { history, balance } = playHand({ rules, bettingStrategy: strategy });
      const sessionWagered = history.reduce((sum, roll) => {
        const b = roll.betsBefore;
        return sum + Object.values(b).reduce((s, v) => {
          if (typeof v === 'number') return s;
          if (v?.line) s += v.line.amount || 0;
          if (v?.odds) s += v.odds.amount || 0;
          if (v?.place) {
            if (v.place.six) s += v.place.six.amount || 0;
            if (v.place.eight) s += v.place.eight.amount || 0;
          }
          return s;
        }, 0);
      }, 0);

      const gained = history.reduce((sum, roll) => {
        return sum + (roll.payouts?.reduce((s, p) => s + p.principal + p.profit, 0) || 0);
      }, 0);

      totalWagered += sessionWagered;
      totalReturned += gained;
      if (balance >= 0) wins++; else losses++;
      sessionResults.push({ rolls: history.length, balance });
      if (i === numSessions - 1) lastHistory = history;
    }

    const avgBalance = sessionResults.reduce((s, r) => s + r.balance, 0) / numSessions;
    const avgRolls = sessionResults.reduce((s, r) => s + r.rolls, 0) / numSessions;
    const minBalance = Math.min(...sessionResults.map(r => r.balance));
    const maxBalance = Math.max(...sessionResults.map(r => r.balance));
    const houseEdge = totalWagered > 0 ? ((totalWagered - totalReturned) / totalWagered * 100) : 0;

    results = {
      sessions: numSessions,
      wins,
      losses,
      avgBalance: avgBalance.toFixed(2),
      avgRolls: avgRolls.toFixed(1),
      minBalance,
      maxBalance,
      houseEdge: houseEdge.toFixed(2),
      sessionResults
    };
    showHistory = false;
  }

  function fmt(n) {
    const v = Number(n);
    const sign = v >= 0 ? '+' : '';
    return `${sign}$${v.toFixed(2)}`;
  }
</script>

<style>
  * { box-sizing: border-box; }
  h1 { margin: 0 0 1rem 0; font-size: 1.4rem; }
  h2 { font-size: 1.1rem; margin: 1.2rem 0 0.5rem 0; }
  .controls { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; }
  .field { display: flex; flex-direction: column; gap: 0.25rem; }
  label { font-size: 0.85rem; font-weight: bold; }
  select, input { padding: 0.4rem 0.6rem; border: 1px solid #ccc; border-radius: 4px; font-size: 0.95rem; }
  button { padding: 0.5rem 1.2rem; background: #333; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
  button:hover { background: #555; }
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
  .toggle { background: none; color: #333; border: 1px solid #ccc; margin-top: 0.5rem; font-size: 0.85rem; padding: 0.3rem 0.8rem; }
  .session-chart { display: flex; flex-wrap: wrap; gap: 4px; margin: 0.5rem 0; }
  .session-dot { width: 14px; height: 14px; border-radius: 2px; title: attr(data-val); }
  .hist-wrap { overflow-x: auto; }
</style>

<h1>Craps Simulator</h1>
<p>Simulate craps sessions using betting strategies from <a href="https://github.com/tphummel/node-craps" target="_blank">node-craps</a>.</p>

<div class="controls">
  <div class="field">
    <label for="strategy">Betting Strategy</label>
    <select id="strategy" bind:value={strategyName}>
      {#each Object.keys(strategies) as s}
        <option value={s}>{s}</option>
      {/each}
    </select>
  </div>
  <div class="field">
    <label for="sessions">Sessions</label>
    <input id="sessions" type="number" min="1" max="10000" bind:value={numSessions} style="width:100px" />
  </div>
  <div class="field">
    <label for="minbet">Min Bet ($)</label>
    <input id="minbet" type="number" min="1" max="500" bind:value={minBet} style="width:80px" />
  </div>
  <div class="field">
    <label for="maxodds">Max Odds (×)</label>
    <input id="maxodds" type="number" min="0" max="100" bind:value={maxOdds} style="width:80px" />
  </div>
  <div class="field" style="justify-content:flex-end">
    <button on:click={simulate}>Simulate</button>
  </div>
</div>

{#if results}
  <h2>Results — {results.sessions} sessions</h2>
  <div class="stats-grid">
    <div class="stat">
      <div class="stat-label">Avg Net / Session</div>
      <div class="stat-value {Number(results.avgBalance) >= 0 ? 'positive' : 'negative'}">{fmt(results.avgBalance)}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Win / Loss Sessions</div>
      <div class="stat-value neutral-color">{results.wins} / {results.losses}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Win Rate</div>
      <div class="stat-value neutral-color">{(results.wins / results.sessions * 100).toFixed(1)}%</div>
    </div>
    <div class="stat">
      <div class="stat-label">Avg Rolls / Session</div>
      <div class="stat-value neutral-color">{results.avgRolls}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Best Session</div>
      <div class="stat-value positive">{fmt(results.maxBalance)}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Worst Session</div>
      <div class="stat-value negative">{fmt(results.minBalance)}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Est. House Edge</div>
      <div class="stat-value negative">{results.houseEdge}%</div>
    </div>
  </div>

  <h2>Session Results</h2>
  <div class="session-chart">
    {#each results.sessionResults as s, i}
      <div
        class="session-dot"
        style="background:{s.balance >= 0 ? '#22c55e' : '#ef4444'}; opacity:{Math.min(1, 0.4 + Math.abs(s.balance) / (Math.abs(results.minBalance) || 1) * 0.6)}"
        title="Session {i+1}: {fmt(s.balance)} ({s.rolls} rolls)"
      ></div>
    {/each}
  </div>

  {#if lastHistory}
    <button class="toggle" on:click={() => showHistory = !showHistory}>
      {showHistory ? 'Hide' : 'Show'} Last Session Roll-by-Roll
    </button>

    {#if showHistory}
      <div class="hist-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Dice</th>
              <th>Sum</th>
              <th>Result</th>
              <th>Point</th>
              <th>Payouts</th>
            </tr>
          </thead>
          <tbody>
            {#each lastHistory as roll, i}
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
    {/if}
  {/if}
{/if}
