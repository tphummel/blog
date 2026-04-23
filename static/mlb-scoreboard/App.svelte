<script>
  import { onMount } from 'svelte';

  const AS_ID = 133;

  function todayStr() {
    return new Date().toLocaleDateString('en-CA');
  }

  const sp = new URLSearchParams(window.location.search);
  let dateStr = sp.get('date') || todayStr();
  let view = sp.get('view') || 'scoreboard';

  let games = [];
  let loading = true;
  let error = null;
  let boxscores = {};
  let bsLoading = false;

  function sortGames(gs) {
    const isAs = g => g.teams.away.team.id === AS_ID || g.teams.home.team.id === AS_ID;
    const isFinal = g => g.status.abstractGameState === 'Final';
    return [...gs].sort((a, b) => {
      const aAs = isAs(a), bAs = isAs(b);
      if (aAs !== bAs) return aAs ? -1 : 1;
      const aFin = isFinal(a), bFin = isFinal(b);
      if (aFin !== bFin) return aFin ? 1 : -1;
      return new Date(a.gameDate) - new Date(b.gameDate);
    });
  }

  async function loadSchedule(date) {
    loading = true;
    error = null;
    games = [];
    boxscores = {};
    try {
      const res = await fetch(
        `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}&hydrate=linescore,team,probablePitcher,decisions`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      games = sortGames(data.dates?.[0]?.games ?? []);
    } catch (e) {
      error = e.message;
    }
    loading = false;
    if (games.length) fetchStartedBoxscores();
  }

  async function fetchBoxscore(pk) {
    if (boxscores[pk]) return;
    try {
      const res = await fetch(`https://statsapi.mlb.com/api/v1/game/${pk}/boxscore`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      boxscores = { ...boxscores, [pk]: await res.json() };
    } catch (e) {
      boxscores = { ...boxscores, [pk]: { error: e.message } };
    }
  }

  async function fetchStartedBoxscores() {
    bsLoading = true;
    await Promise.all(
      games
        .filter(g => g.status.abstractGameState !== 'Preview')
        .map(g => fetchBoxscore(g.gamePk))
    );
    bsLoading = false;
  }

  function pushUrl() {
    const p = new URLSearchParams({ date: dateStr });
    if (view !== 'scoreboard') p.set('view', view);
    history.replaceState({}, '', `?${p}`);
  }

  function go(d) {
    dateStr = d;
    pushUrl();
    loadSchedule(d);
  }

  function shiftDate(delta) {
    const d = new Date(`${dateStr}T12:00:00`);
    d.setDate(d.getDate() + delta);
    go(d.toISOString().slice(0, 10));
  }

  function switchView(v) {
    view = v;
    pushUrl();
    // boxscores already fetching; if any Preview games have since started, fetch them
    if (v === 'lineups' && !bsLoading) fetchStartedBoxscores();
  }

  onMount(() => loadSchedule(dateStr));

  function gameStatus(game) {
    const state = game.status.abstractGameState;
    const ls = game.linescore;
    if (state === 'Final') return { text: 'F', live: false };
    if (state === 'Live' && ls?.currentInning) {
      const half = ls.inningHalf === 'Top' ? '▲' : '▼';
      return { text: `${half}${ls.currentInning}`, live: true };
    }
    if (state === 'Live') return { text: 'Live', live: true };
    if (game.gameDate) {
      return {
        text: new Date(game.gameDate).toLocaleTimeString('en-US', {
          hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
        }),
        live: false
      };
    }
    return { text: '—', live: false };
  }

  function teamHRs(pk, side) {
    return boxscores[pk]?.teams?.[side]?.teamStats?.batting?.homeRuns ?? 0;
  }

  function starters(teamData) {
    if (!teamData?.batters || !teamData?.players) return [];
    return teamData.batters
      .map(id => teamData.players[`ID${id}`])
      .filter(p => p?.battingOrder && parseInt(p.battingOrder) % 100 === 0)
      .map(p => ({
        n: parseInt(p.battingOrder) / 100,
        name: p.person?.fullName ?? '?',
        pos: p.position?.abbreviation ?? '?'
      }))
      .sort((a, b) => a.n - b.n);
  }

  function spName(teamData, fallback) {
    if (!teamData?.pitchers?.length || !teamData?.players) return fallback ?? 'TBD';
    const id = teamData.pitchers[0];
    return teamData.players[`ID${id}`]?.person?.fullName ?? fallback ?? 'TBD';
  }
</script>

<style>
  * { box-sizing: border-box; }
  body { font-family: monospace; margin: 1rem; max-width: 960px; }
  h1 { font-size: 1.3rem; margin: 0 0 0.75rem; }

  .nav { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap; }
  .nav button { padding: 0.3rem 0.6rem; cursor: pointer; font-family: inherit; border: 1px solid #999; background: #fff; }
  .nav button:hover { background: #eee; }
  .nav input[type=date] { padding: 0.3rem; font-family: inherit; border: 1px solid #999; }

  .tabs { display: flex; margin-bottom: 1rem; }
  .tab { padding: 0.35rem 1rem; border: 1px solid #999; background: #fff; cursor: pointer; font-family: inherit; }
  .tab:not(:last-child) { border-right: none; }
  .tab.active { background: #333; color: #fff; border-color: #333; }

  .games { display: flex; flex-direction: column; gap: 0.75rem; }

  .card { border: 1px solid #ccc; padding: 0.6rem 0.75rem; }

  .matchup { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.4rem; }
  .team-block { display: flex; align-items: baseline; gap: 0.4rem; }
  .abbr { font-weight: bold; font-size: 1rem; }
  .record { font-size: 0.75rem; color: #666; }
  .score-block { display: flex; align-items: center; gap: 0.3rem; }
  .sc { font-size: 1.3rem; font-weight: bold; min-width: 1.4ch; text-align: center; }
  .sc-dash { color: #aaa; font-size: 1rem; }
  .status { font-size: 0.8rem; border: 1px solid #ccc; padding: 0.1rem 0.4rem; white-space: nowrap; }
  .status.live { border-color: #dc2626; color: #dc2626; }
  .winner .abbr { color: #16a34a; }

  .linescore { overflow-x: auto; margin-top: 0.4rem; }
  .linescore table { border-collapse: collapse; font-size: 0.78rem; white-space: nowrap; }
  .linescore th, .linescore td { border: 1px solid #ddd; padding: 2px 6px; text-align: center; }
  .linescore th { background: #f5f5f5; font-weight: normal; }
  .linescore td:first-child, .linescore th:first-child { text-align: left; font-weight: bold; }
  .sep { border-left: 2px solid #aaa !important; }

  .meta { font-size: 0.8rem; color: #666; margin-top: 0.35rem; }
  .hr-line { font-size: 0.8rem; color: #444; margin-top: 0.3rem; }
  .hr-label { color: #999; }

  .lineup-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem; }
  .lineup-head { font-size: 0.85rem; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 0.2rem; margin-bottom: 0.25rem; }
  .lineup-row { display: flex; gap: 0.4rem; font-size: 0.83rem; padding: 0.1rem 0; }
  .ln { width: 16px; color: #888; text-align: right; flex-shrink: 0; }
  .lp { width: 26px; color: #555; flex-shrink: 0; }

  .loading { color: #666; font-style: italic; }
  .err { color: #dc2626; font-family: monospace; }
  .none { color: #888; font-style: italic; }

  @media (max-width: 480px) {
    .lineup-grid { grid-template-columns: 1fr; }
  }
</style>

<h1>MLB Scoreboard</h1>

<div class="nav">
  <button on:click={() => shiftDate(-1)}>← Prev</button>
  <input type="date" bind:value={dateStr} on:change={() => go(dateStr)} />
  <button on:click={() => shiftDate(1)}>Next →</button>
</div>

<div class="tabs">
  <button class="tab" class:active={view === 'scoreboard'} on:click={() => switchView('scoreboard')}>Scoreboard</button>
  <button class="tab" class:active={view === 'lineups'} on:click={() => switchView('lineups')}>Lineups</button>
</div>

{#if loading}
  <p class="loading">Loading…</p>
{:else if error}
  <p class="err">Error: {error}</p>
{:else if games.length === 0}
  <p class="none">No games scheduled for {dateStr}.</p>

{:else if view === 'scoreboard'}
  <div class="games">
    {#each games as game}
      {@const aw = game.teams.away}
      {@const hw = game.teams.home}
      {@const st = gameStatus(game)}
      {@const started = game.status.abstractGameState !== 'Preview'}
      {@const isFinal = game.status.abstractGameState === 'Final'}
      {@const innings = game.linescore?.innings ?? []}
      {@const awRHE = game.linescore?.teams?.away}
      {@const hwRHE = game.linescore?.teams?.home}
      {@const awHR = teamHRs(game.gamePk, 'away')}
      {@const hwHR = teamHRs(game.gamePk, 'home')}
      <div class="card">
        <div class="matchup">
          <div class="team-block" class:winner={aw.isWinner}>
            <span class="abbr">{aw.team.abbreviation ?? aw.team.name}</span>
            {#if aw.leagueRecord}
              <span class="record">{aw.leagueRecord.wins}-{aw.leagueRecord.losses}</span>
            {/if}
          </div>
          <div class="score-block">
            {#if started}
              <span class="sc">{aw.score ?? 0}</span>
              <span class="sc-dash">-</span>
              <span class="sc">{hw.score ?? 0}</span>
            {:else}
              <span class="sc-dash">vs</span>
            {/if}
          </div>
          <span class="status" class:live={st.live}>{st.text}</span>
          <div class="team-block" class:winner={hw.isWinner}>
            <span class="abbr">{hw.team.abbreviation ?? hw.team.name}</span>
            {#if hw.leagueRecord}
              <span class="record">{hw.leagueRecord.wins}-{hw.leagueRecord.losses}</span>
            {/if}
          </div>
        </div>

        {#if started && innings.length}
          <div class="linescore">
            <table>
              <thead>
                <tr>
                  <th></th>
                  {#each innings as inn}<th>{inn.num}</th>{/each}
                  <th class="sep">R</th><th>H</th><th>E</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{aw.team.abbreviation ?? aw.team.name}</td>
                  {#each innings as inn}<td>{inn.away?.runs ?? '—'}</td>{/each}
                  <td class="sep">{awRHE?.runs ?? ''}</td>
                  <td>{awRHE?.hits ?? ''}</td>
                  <td>{awRHE?.errors ?? ''}</td>
                </tr>
                <tr>
                  <td>{hw.team.abbreviation ?? hw.team.name}</td>
                  {#each innings as inn}
                    <td>{inn.home?.runs ?? (isFinal ? 'x' : '—')}</td>
                  {/each}
                  <td class="sep">{hwRHE?.runs ?? ''}</td>
                  <td>{hwRHE?.hits ?? ''}</td>
                  <td>{hwRHE?.errors ?? ''}</td>
                </tr>
              </tbody>
            </table>
          </div>
        {/if}

        {#if started && (awHR > 0 || hwHR > 0)}
          <div class="hr-line">
            <span class="hr-label">HR: </span>
            {aw.team.abbreviation ?? aw.team.name} {awHR} · {hw.team.abbreviation ?? hw.team.name} {hwHR}
          </div>
        {/if}

        {#if isFinal && game.decisions}
          <div class="meta">
            W: {game.decisions.winner?.fullName ?? '—'} ·
            L: {game.decisions.loser?.fullName ?? '—'}
            {#if game.decisions.save} · S: {game.decisions.save.fullName}{/if}
          </div>
        {:else if aw.probablePitcher || hw.probablePitcher}
          <div class="meta">
            {aw.probablePitcher?.fullName ?? 'TBD'} vs {hw.probablePitcher?.fullName ?? 'TBD'}
          </div>
        {/if}
      </div>
    {/each}
  </div>

{:else}
  {#if bsLoading}
    <p class="loading">Loading lineups…</p>
  {/if}
  <div class="games">
    {#each games as game}
      {@const aw = game.teams.away}
      {@const hw = game.teams.home}
      {@const st = gameStatus(game)}
      {@const bs = boxscores[game.gamePk]}
      <div class="card">
        <div class="matchup">
          <div class="team-block">
            <span class="abbr">{aw.team.name}</span>
          </div>
          <span class="status" class:live={st.live}>{st.text}</span>
          <div class="team-block">
            <span class="abbr">{hw.team.name}</span>
          </div>
        </div>

        {#if game.status.abstractGameState === 'Preview'}
          <div class="meta">
            Probable: {aw.probablePitcher?.fullName ?? 'TBD'} vs {hw.probablePitcher?.fullName ?? 'TBD'}
          </div>
          <p class="loading" style="font-size:0.83rem;margin-top:0.3rem">Lineups not yet available.</p>
        {:else if !bs}
          <p class="loading">Loading…</p>
        {:else if bs.error}
          <p class="err">{bs.error}</p>
        {:else}
          {@const awStarters = starters(bs.teams.away)}
          {@const hwStarters = starters(bs.teams.home)}
          <div class="lineup-grid">
            <div>
              <div class="lineup-head">{aw.team.name}</div>
              {#if awStarters.length}
                {#each awStarters as p}
                  <div class="lineup-row">
                    <span class="ln">{p.n}.</span>
                    <span class="lp">{p.pos}</span>
                    <span>{p.name}</span>
                  </div>
                {/each}
              {:else}
                <p class="none" style="font-size:0.83rem">No lineup posted.</p>
              {/if}
            </div>
            <div>
              <div class="lineup-head">{hw.team.name}</div>
              {#if hwStarters.length}
                {#each hwStarters as p}
                  <div class="lineup-row">
                    <span class="ln">{p.n}.</span>
                    <span class="lp">{p.pos}</span>
                    <span>{p.name}</span>
                  </div>
                {/each}
              {:else}
                <p class="none" style="font-size:0.83rem">No lineup posted.</p>
              {/if}
            </div>
          </div>
          <div class="meta">
            SP: {spName(bs.teams.away, aw.probablePitcher?.fullName)} vs {spName(bs.teams.home, hw.probablePitcher?.fullName)}
          </div>
        {/if}
      </div>
    {/each}
  </div>
{/if}
