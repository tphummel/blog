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
  let absData = {};
  let contentData = {};
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
    absData = {};
    contentData = {};
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

  // Parses ABS (Machine Judge) challenges from play-by-play events.
  // reviewType "MJ" = Automated Ball-Strike; "MI" = Manager instant replay.
  function parseABS(allPlays, awayTeamId, homeTeamId) {
    const map = {};
    for (const play of allPlays) {
      for (const ev of (play.playEvents ?? [])) {
        const rd = ev.reviewDetails;
        if (!rd || rd.reviewType !== 'MJ' || rd.inProgress) continue;
        const player = rd.player;
        if (!player?.id) continue;

        const side = rd.challengeTeamId === awayTeamId ? 'away' : 'home';
        const id = player.id;
        if (!map[id]) {
          map[id] = { name: player.fullName, side, success: 0, attempts: 0, challenges: [] };
        }
        map[id].attempts++;
        if (rd.isOverturned) map[id].success++;
        map[id].challenges.push({ playId: ev.playId, isOverturned: rd.isOverturned });
      }
    }
    const result = { away: [], home: [] };
    for (const d of Object.values(map)) result[d.side].push(d);
    return result;
  }

  async function fetchPlayByPlay(game) {
    const pk = game.gamePk;
    if (absData[pk] !== undefined) return;
    const awayTeamId = game.teams.away.team.id;
    const homeTeamId = game.teams.home.team.id;
    try {
      const res = await fetch(`https://statsapi.mlb.com/api/v1/game/${pk}/playByPlay`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      absData = { ...absData, [pk]: parseABS(data.allPlays ?? [], awayTeamId, homeTeamId) };
    } catch (e) {
      absData = { ...absData, [pk]: null };
    }
  }

  async function loadContent(pk) {
    if (contentData[pk] !== undefined) return;
    contentData = { ...contentData, [pk]: null }; // loading sentinel
    try {
      const res = await fetch(`https://statsapi.mlb.com/api/v1/game/${pk}/content`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const map = {};
      for (const item of (data.highlights?.highlights?.items ?? [])) {
        for (const kw of (item.keywordsAll ?? [])) {
          if (kw.type === 'mlbtax__playID') {
            const url = item.playbacks?.find(p => p.name === 'mp4Avc')?.url
                     ?? item.playbacks?.[0]?.url;
            if (url) map[kw.value] = url;
          }
        }
      }
      contentData = { ...contentData, [pk]: map };
    } catch (e) {
      contentData = { ...contentData, [pk]: {} };
    }
  }

  async function fetchStartedBoxscores() {
    bsLoading = true;
    const started = games.filter(g => g.status.abstractGameState !== 'Preview');
    await Promise.all([
      ...started.map(g => fetchBoxscore(g.gamePk)),
      ...started.map(g => fetchPlayByPlay(g)),
    ]);
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
    if (!bsLoading) fetchStartedBoxscores();
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

  // Pass teamData directly so Svelte tracks boxscores as a reactive dependency
  function formatHRs(teamData, abbr) {
    if (!teamData?.players) return '';
    const players = Object.values(teamData.players)
      .filter(p => (p.stats?.batting?.homeRuns ?? 0) > 0)
      .map(p => {
        const gameHR = p.stats.batting.homeRuns;
        const seasonHR = p.seasonStats?.batting?.homeRuns ?? gameHR;
        const countStr = gameHR > 1 ? ` ${gameHR}` : '';
        return `${p.person?.fullName ?? '?'}${countStr} (${seasonHR})`;
      });
    return players.length ? `${abbr}: ${players.join(', ')}` : '';
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

  // Look up a pitcher's season stats from the already-fetched boxscore
  function pitcherRecord(bsData, playerId) {
    if (!bsData || !playerId) return null;
    for (const side of ['away', 'home']) {
      const p = bsData.teams?.[side]?.players?.[`ID${playerId}`];
      if (p?.seasonStats?.pitching) return p.seasonStats.pitching;
    }
    return null;
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
  .card.as-game { background: #fffbeb; border-color: #e5c84a; }

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

  .abs-section { margin-top: 0.4rem; }
  .abs-team-row { font-size: 0.83rem; margin-top: 0.2rem; }
  .abs-team-label { color: #888; margin-right: 0.25rem; }
  .abs-player { margin-right: 0.5rem; }

  .abs-challenges { margin-top: 0.3rem; padding-left: 0.75rem; }
  .abs-challenge { margin-top: 0.2rem; font-size: 0.8rem; }
  .abs-challenge summary { cursor: pointer; display: inline-block; padding: 0.1rem 0.3rem; border: 1px solid #ccc; }
  .abs-challenge summary.overturned { color: #15803d; border-color: #86efac; background: #f0fdf4; }
  .abs-challenge summary.upheld { color: #9a3412; border-color: #fca5a5; background: #fff7ed; }
  .abs-challenge[open] summary { margin-bottom: 0.3rem; }
  .abs-video { display: block; max-width: 100%; width: 480px; margin-top: 0.25rem; }

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
  <button class="tab" class:active={view === 'abs'} on:click={() => switchView('abs')}>ABS</button>
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
      {@const awHRStr = formatHRs(boxscores[game.gamePk]?.teams?.away, aw.team.abbreviation ?? aw.team.name)}
      {@const hwHRStr = formatHRs(boxscores[game.gamePk]?.teams?.home, hw.team.abbreviation ?? hw.team.name)}
      {@const asGame = aw.team.id === AS_ID || hw.team.id === AS_ID}
      <div class="card" class:as-game={asGame}>
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

        {#if awHRStr || hwHRStr}
          <div class="hr-line">
            <span class="hr-label">HR: </span>{[awHRStr, hwHRStr].filter(Boolean).join('. ')}
          </div>
        {/if}

        {#if isFinal && game.decisions}
          {@const bs = boxscores[game.gamePk]}
          {@const wr = pitcherRecord(bs, game.decisions.winner?.id)}
          {@const lr = pitcherRecord(bs, game.decisions.loser?.id)}
          {@const sr = pitcherRecord(bs, game.decisions.save?.id)}
          <div class="meta">
            W: {game.decisions.winner?.fullName ?? '—'}{wr ? ` (${wr.wins}-${wr.losses})` : ''}
            · L: {game.decisions.loser?.fullName ?? '—'}{lr ? ` (${lr.wins}-${lr.losses})` : ''}
            {#if game.decisions.save} · S: {game.decisions.save.fullName}{sr ? ` (${sr.saves})` : ''}{/if}
          </div>
        {:else if aw.probablePitcher || hw.probablePitcher}
          <div class="meta">
            {aw.probablePitcher?.fullName ?? 'TBD'} vs {hw.probablePitcher?.fullName ?? 'TBD'}
          </div>
        {/if}
      </div>
    {/each}
  </div>

{:else if view === 'lineups'}
  {#if bsLoading}
    <p class="loading">Loading lineups…</p>
  {/if}
  <div class="games">
    {#each games as game}
      {@const aw = game.teams.away}
      {@const hw = game.teams.home}
      {@const st = gameStatus(game)}
      {@const bs = boxscores[game.gamePk]}
      {@const asGame = aw.team.id === AS_ID || hw.team.id === AS_ID}
      <div class="card" class:as-game={asGame}>
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

{:else if view === 'abs'}
  {#if bsLoading}
    <p class="loading">Loading…</p>
  {/if}
  <div class="games">
    {#each games as game}
      {@const aw = game.teams.away}
      {@const hw = game.teams.home}
      {@const st = gameStatus(game)}
      {@const asGame = aw.team.id === AS_ID || hw.team.id === AS_ID}
      {@const abs = absData[game.gamePk]}
      {@const cd = contentData[game.gamePk]}
      <div class="card" class:as-game={asGame}>
        <div class="matchup">
          <div class="team-block"><span class="abbr">{aw.team.name}</span></div>
          <span class="status" class:live={st.live}>{st.text}</span>
          <div class="team-block"><span class="abbr">{hw.team.name}</span></div>
        </div>

        {#if game.status.abstractGameState === 'Preview'}
          <p class="none" style="font-size:0.83rem">Game not yet started.</p>
        {:else if abs === undefined}
          <p class="loading">Loading…</p>
        {:else if abs === null}
          <p class="none" style="font-size:0.83rem">Challenge data unavailable.</p>
        {:else if !abs.away.length && !abs.home.length}
          <p class="none" style="font-size:0.83rem">No ABS challenges recorded.</p>
        {:else}
          <div class="abs-section">
            {#each [{team: aw, players: abs.away}, {team: hw, players: abs.home}] as {team, players}}
              {#if players.length}
                <div class="abs-team-row">
                  <span class="abs-team-label">{team.team.abbreviation ?? team.team.name}:</span>
                  {#each players as player}
                    <span class="abs-player">{player.name} {player.success}/{player.attempts}</span>
                  {/each}
                </div>
                <div class="abs-challenges">
                  {#each players as player}
                    {#each player.challenges as c, i}
                      <details
                        class="abs-challenge"
                        on:toggle={e => e.target.open && loadContent(game.gamePk)}
                      >
                        <summary class:overturned={c.isOverturned} class:upheld={!c.isOverturned}>
                          {player.name} #{i + 1} — {c.isOverturned ? 'Overturned' : 'Upheld'}
                        </summary>
                        {#if cd === null}
                          <p class="loading" style="font-size:0.8rem;margin:0.25rem 0">Loading video…</p>
                        {:else if cd?.[c.playId]}
                          <video class="abs-video" src={cd[c.playId]} controls playsinline></video>
                        {:else if cd !== undefined}
                          <p class="none" style="font-size:0.8rem;margin:0.25rem 0">No video available.</p>
                        {/if}
                      </details>
                    {/each}
                  {/each}
                </div>
              {/if}
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>
{/if}
