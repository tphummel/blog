// Kart-dd-web engine: rules, standings, export/import and browser storage.
// Pure logic (no DOM) so it can be tested in node. Loaded as a classic script
// in the browser (global `KartEngine`) and via require() in node.
(function (root) {
  'use strict';

  const STORE_KEY = 'kart-dd-web:v1';
  const SCHEMA = 1;

  // Vocabulary carried over from the original gaej-kart League.java.
  const DRIVERS = [
    'Baby Mario', 'Baby Luigi', 'Koopa', 'Paratroopa', 'Diddy Kong', 'Bowser Jr.',
    'Toad', 'Toadette', 'Mario', 'Luigi', 'Peach', 'Daisy', 'Yoshi', 'Birdo',
    'Waluigi', 'Bowser', 'Donkey Kong', 'Wario', 'Petey Pirahna', 'King Boo',
  ];
  const KARTS = [
    'Goo-Goo Buggy', 'Rattle Buggy', 'Koopa Dasher', 'Para Wing', 'Barrel Train',
    'Bullet Blaster', 'Toad Kart', 'Toadette Kart', 'Red Fire', 'Green Fire',
    'Heart Coach', 'Bloom Coach', 'Turbo Yoshi', 'Turbo Birdo', 'Waluigi Racer',
    'Wario Car', 'DK Jumbo', 'Koopa King', 'Piranha Pipes', 'Boo Pipes', 'Parade Kart',
  ];
  const ALL_CUP = [
    'Luigi Circuit', 'Peach Beach', 'Baby Park', 'Dry Dry Desert', 'Mushroom Bridge',
    'Mario Circuit', 'Daisy Cruiser', 'Waluigi Stadium', 'Sherbet Land', 'Mushroom City',
    'Yoshi Circuit', 'DK Mountain', 'Wario Colosseum', 'Dino Dino Jungle', 'Bowser Castle',
    'Rainbow Road',
  ];
  const ALL_COURSES = ALL_CUP; // MKDD has more cups; All Cup is the league's full list.

  // Presets derived from the real leagues in script/data/csv/league.csv.
  const FORMATS = {
    gp2: {
      key: 'gp2', name: '2P GP All Cup', players: 2, racers: 8,
      points: [10, 8, 6, 4, 3, 2, 1, 0], courses: ALL_CUP, raceLimit: 16,
    },
    baby4: {
      key: 'baby4', name: '4P Baby Park', players: 4, racers: 4,
      points: [4, 3, 2, 1], courses: ['Baby Park'], raceLimit: 0,
    },
    vs2: {
      key: 'vs2', name: '2P VS Baby Park', players: 2, racers: 2,
      points: [2, 1], courses: ['Baby Park'], raceLimit: 0,
    },
    custom: {
      key: 'custom', name: 'Custom', players: 2, racers: 4,
      points: [4, 3, 2, 1], courses: ALL_COURSES, raceLimit: 0,
    },
  };

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const isInt = (n) => Number.isInteger(n);
  const clone = (o) => JSON.parse(JSON.stringify(o));

  // ---- sessions -----------------------------------------------------------

  function makeFormat(key, overrides) {
    const base = clone(FORMATS[key] || FORMATS.custom);
    const f = Object.assign(base, overrides || {});
    f.players = Number(f.players);
    f.racers = Number(f.racers);
    f.raceLimit = Number(f.raceLimit) || 0;
    f.points = Array.from({ length: f.racers }, (_, i) => Number(f.points[i]) || 0);
    return f;
  }

  function newSession({ name, venue, players, formatKey, format, now }) {
    const names = (players || []).map((p) => String(p).trim()).filter(Boolean);
    const fmt = format || makeFormat(formatKey);
    if (!String(name || '').trim()) throw new Error('Session needs a name');
    if (names.length < 2) throw new Error('Need at least two players');
    if (new Set(names.map((n) => n.toLowerCase())).size !== names.length) {
      throw new Error('Player names must be unique');
    }
    if (names.length > fmt.racers) throw new Error('More players than racers in the format');
    const t = (now || new Date()).toISOString();
    return {
      id: uid(), name: String(name).trim(), venue: String(venue || '').trim(),
      created: t, closed: false, format: fmt, players: names, races: [],
    };
  }

  // Mirrors Match.validateMatch() from the original, plus format bounds.
  function validateRace(session, race, ignoreRaceId) {
    const f = session.format;
    if (!race.course) return 'choose a course';
    if (f.courses.length && !f.courses.includes(race.course)) return 'course is not in this format';
    const perfs = race.perfs || [];
    if (perfs.length !== session.players.length) return 'every player needs a row';
    const seenChars = new Map();
    const seenPlayers = new Set();
    const seenFinish = new Set();
    for (const p of perfs) {
      if (!p.player) return 'forgot to choose a player';
      if (!session.players.includes(p.player)) return 'unknown player: ' + p.player;
      if (!p.kart) return `${p.player}: forgot to choose a kart`;
      if (!p.driver) return `${p.player}: forgot to choose a driver`;
      if (!p.rear) return `${p.player}: forgot to choose a rear`;
      if (!isInt(p.finish) || p.finish < 1 || p.finish > f.racers) {
        return `${p.player}: forgot to choose a finish (1-${f.racers})`;
      }
      if (p.driver === p.rear) return `${p.player}: one player using two ${p.driver}`;
      if (seenPlayers.has(p.player)) return 'duplicate players';
      seenPlayers.add(p.player);
      if (seenFinish.has(p.finish)) return 'duplicate finish positions';
      seenFinish.add(p.finish);
      for (const c of [p.driver, p.rear]) {
        if (seenChars.has(c)) return `two players using: ${c}`;
        seenChars.set(c, p.player);
      }
    }
    if (f.raceLimit > 0 && !ignoreRaceId && session.races.length >= f.raceLimit) {
      return `session is full (${f.raceLimit} races)`;
    }
    return null;
  }

  function normalizeRace(session, input) {
    return {
      course: input.course,
      notes: String(input.notes || '').trim(),
      perfs: session.players.map((name) => {
        const p = (input.perfs || []).find((x) => x.player === name) || {};
        return {
          player: name, kart: p.kart || '', driver: p.driver || '', rear: p.rear || '',
          finish: p.finish === '' || p.finish == null ? NaN : Number(p.finish),
        };
      }),
    };
  }

  function addRace(session, input, now) {
    const race = normalizeRace(session, input);
    const err = validateRace(session, race);
    if (err) throw new Error(err);
    race.id = uid();
    race.seq = session.races.length + 1;
    race.ts = (now || new Date()).toISOString();
    session.races.push(race);
    return race;
  }

  function updateRace(session, raceId, input) {
    const i = session.races.findIndex((r) => r.id === raceId);
    if (i < 0) throw new Error('race not found');
    const race = normalizeRace(session, input);
    const err = validateRace(session, race, raceId);
    if (err) throw new Error(err);
    const old = session.races[i];
    session.races[i] = Object.assign(race, { id: old.id, seq: old.seq, ts: old.ts });
    return session.races[i];
  }

  function deleteRace(session, raceId) {
    const i = session.races.findIndex((r) => r.id === raceId);
    if (i < 0) throw new Error('race not found');
    session.races.splice(i, 1);
    session.races.forEach((r, n) => { r.seq = n + 1; });
  }

  // ---- stats --------------------------------------------------------------

  const pointsFor = (session, finish) => session.format.points[finish - 1] || 0;

  // gap[a][b] = { races, gap }: gap sums (b.finish - a.finish), so positive
  // means `a` finished ahead of `b` on balance (same convention as the
  // original gap-standings report).
  function gapMatrix(session) {
    const g = {};
    session.players.forEach((a) => {
      g[a] = {};
      session.players.forEach((b) => { if (a !== b) g[a][b] = { races: 0, gap: 0 }; });
    });
    session.races.forEach((r) => {
      r.perfs.forEach((a) => r.perfs.forEach((b) => {
        if (a.player === b.player) return;
        const cell = g[a.player][b.player];
        cell.races++;
        cell.gap += b.finish - a.finish;
      }));
    });
    return g;
  }

  function standings(session) {
    const rows = session.players.map((player) => ({
      player, races: 0, points: 0, ppr: 0, finishes: new Array(session.format.racers).fill(0),
    }));
    const by = Object.fromEntries(rows.map((r) => [r.player, r]));
    session.races.forEach((race) => race.perfs.forEach((p) => {
      const row = by[p.player];
      if (!row) return;
      row.races++;
      row.points += pointsFor(session, p.finish);
      row.finishes[p.finish - 1]++;
    }));
    rows.forEach((r) => { r.ppr = r.races ? r.points / r.races : 0; });
    const gaps = gapMatrix(session);
    rows.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const h2h = gaps[a.player][b.player];
      if (h2h && h2h.gap !== 0) return -h2h.gap; // more gap = ahead
      if (b.races !== a.races) return b.races - a.races;
      return a.player.localeCompare(b.player);
    });
    rows.forEach((r, i) => { r.rank = i + 1; });
    return rows;
  }

  function leader(session) {
    if (!session.races.length) return null;
    return standings(session)[0];
  }

  // ---- export / import ----------------------------------------------------

  const CSV_COLUMNS = [
    'session_id', 'session', 'venue', 'race_seq', 'played_at', 'course', 'notes',
    'player', 'kart', 'driver1', 'driver2', 'finish', 'pts',
  ];

  const csvCell = (v) => {
    const s = v == null ? '' : String(v);
    return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };

  function toCSV(sessions) {
    const lines = [CSV_COLUMNS.join(',')];
    sessions.forEach((s) => s.races.forEach((r) => r.perfs.forEach((p) => {
      lines.push([
        s.id, s.name, s.venue, r.seq, r.ts, r.course, r.notes,
        p.player, p.kart, p.driver, p.rear, p.finish, pointsFor(s, p.finish),
      ].map(csvCell).join(','));
    })));
    return lines.join('\n') + '\n';
  }

  function toJSON(sessions, now) {
    return JSON.stringify({
      app: 'kart-dd-web', schema: SCHEMA,
      exported: (now || new Date()).toISOString(), sessions,
    }, null, 2);
  }

  // Parse an export file. Returns validated sessions or throws.
  function parseImport(text) {
    let data;
    try { data = JSON.parse(text); } catch (e) { throw new Error('Not valid JSON'); }
    if (!data || data.app !== 'kart-dd-web' || !Array.isArray(data.sessions)) {
      throw new Error('Not a kart-dd-web export');
    }
    if (data.schema > SCHEMA) throw new Error('Export is from a newer version');
    return data.sessions.map((s, i) => {
      const where = `session ${i + 1}`;
      if (!s || !s.id || !s.name || !s.format || !Array.isArray(s.players) || !Array.isArray(s.races)) {
        throw new Error(`${where}: malformed`);
      }
      const clean = {
        id: String(s.id), name: String(s.name), venue: String(s.venue || ''),
        created: String(s.created || new Date().toISOString()), closed: !!s.closed,
        format: makeFormat('custom', s.format), players: s.players.map(String), races: [],
      };
      const checkSession = Object.assign({}, clean, { format: Object.assign({}, clean.format, { raceLimit: 0 }) });
      s.races.forEach((r, n) => {
        const race = normalizeRace(clean, r);
        const err = validateRace(checkSession, race);
        if (err) throw new Error(`${where} (${s.name}), race ${n + 1}: ${err}`);
        race.id = String(r.id || uid());
        race.seq = n + 1;
        race.ts = String(r.ts || clean.created);
        clean.races.push(race);
      });
      return clean;
    });
  }

  // Merge imported sessions into a store. Same id => imported as a copy so
  // nothing already stored is ever overwritten.
  function mergeImport(store, incoming) {
    let added = 0;
    let copies = 0;
    incoming.forEach((s) => {
      const have = store.sessions.find((x) => x.id === s.id);
      if (have) {
        if (JSON.stringify(have) === JSON.stringify(s)) return; // identical, skip
        s.id = uid();
        s.name += ' (imported copy)';
        copies++;
      }
      store.sessions.push(s);
      added++;
    });
    return { added, copies, skipped: incoming.length - added };
  }

  // ---- storage ------------------------------------------------------------

  function emptyStore() { return { schema: SCHEMA, sessions: [] }; }

  function loadStore(storage) {
    try {
      const raw = storage.getItem(STORE_KEY);
      if (!raw) return emptyStore();
      const d = JSON.parse(raw);
      if (d && Array.isArray(d.sessions)) return d;
    } catch (e) { /* fall through */ }
    return emptyStore();
  }

  // Returns true when persisted; false if storage is unavailable or full.
  function saveStore(storage, store) {
    try { storage.setItem(STORE_KEY, JSON.stringify(store)); return true; } catch (e) { return false; }
  }

  const api = {
    STORE_KEY, SCHEMA, DRIVERS, KARTS, ALL_COURSES, FORMATS, CSV_COLUMNS,
    makeFormat, newSession, validateRace, addRace, updateRace, deleteRace,
    pointsFor, gapMatrix, standings, leader,
    toCSV, toJSON, parseImport, mergeImport, emptyStore, loadStore, saveStore,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.KartEngine = api;
}(typeof self !== 'undefined' ? self : this));
