// Shared Yahtzee engine: rules, move encoding, daily dice tape, and the
// browser-storage game history. Used by /yahtzee/ and /yahtzee/stats/.

const CATS = [
  'Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes',
  'Three of a kind', 'Four of a kind', 'Full house',
  'Small straight', 'Large straight', 'Yahtzee', 'Chance'
];
const YAHTZEE = 11;
const FACES = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
const CAT_CHARS = 'abcdefghijklm';
const TOKEN_RE = /r[1-6]{5}|x[0-9a-v][1-6]{5}|s[a-m]/g;
const VALID_RE = /^(?:r[1-6]{5}|x[0-9a-v][1-6]{5}|s[a-m])*$/;

const glyphs = (dice) => dice.map((d) => FACES[d]).join('');
const sum = (a) => a.reduce((x, y) => x + y, 0);
const tokenList = (t) => (t || '').match(TOKEN_RE) || [];

function counts(dice) {
  const c = [0, 0, 0, 0, 0, 0, 0];
  dice.forEach((d) => c[d]++);
  return c;
}

function isYahtzee(dice) { return dice.every((d) => d === dice[0]); }

function hasRun(dice, len) {
  const c = counts(dice);
  for (let s = 1; s + len - 1 <= 6; s++) {
    let ok = true;
    for (let i = s; i < s + len; i++) if (!c[i]) { ok = false; break; }
    if (ok) return true;
  }
  return false;
}

// joker = yahtzee rolled while the Yahtzee box is already filled
function points(cat, dice, joker) {
  const c = counts(dice);
  const max = Math.max(...c);
  if (cat < 6) return c[cat + 1] * (cat + 1);
  switch (cat) {
    case 6: return max >= 3 ? sum(dice) : 0;
    case 7: return max >= 4 ? sum(dice) : 0;
    case 8: return joker || (c.includes(3) && c.includes(2)) ? 25 : 0;
    case 9: return joker || hasRun(dice, 4) ? 30 : 0;
    case 10: return joker || hasRun(dice, 5) ? 40 : 0;
    case 11: return isYahtzee(dice) ? 50 : 0;
    default: return sum(dice);
  }
}

function newState() {
  return { scores: Array(13).fill(null), bonus: 0, turn: 1, rolls: 0, dice: [], log: [], turns: [], cur: null, over: false };
}

function isJoker(s) {
  return s.dice.length === 5 && isYahtzee(s.dice) && s.scores[YAHTZEE] !== null;
}

function legalCats(s) {
  const open = s.scores.map((v, i) => (v === null ? i : -1)).filter((i) => i >= 0);
  if (!isJoker(s)) return open;
  const upper = s.dice[0] - 1;
  if (s.scores[upper] === null) return [upper];
  const lower = open.filter((i) => i >= 6);
  return lower.length ? lower : open;
}

// apply one token; returns false if the token is not legal in this state
function apply(s, tok) {
  const kind = tok[0];
  if (s.over) return false;
  if (kind === 'r') {
    if (s.rolls !== 0) return false;
    s.dice = tok.slice(1).split('').map(Number);
    s.rolls = 1;
    s.cur = { turn: s.turn, rolls: [{ dice: [...s.dice], kept: [] }] };
    s.log.unshift(`Turn ${s.turn} · roll 1: <span class="glyphs">${glyphs(s.dice)}</span>`);
    return true;
  }
  if (kind === 'x') {
    if (s.rolls < 1 || s.rolls >= 3) return false;
    const mask = parseInt(tok[1], 32);
    if (mask === 31) return false;
    const next = tok.slice(2).split('').map(Number);
    for (let i = 0; i < 5; i++) if (mask & (1 << i) && next[i] !== s.dice[i]) return false;
    const held = s.dice.filter((_, i) => mask & (1 << i));
    s.cur.rolls.push({ dice: next, kept: s.dice.map((_, i) => !!(mask & (1 << i))) });
    s.dice = next;
    s.rolls++;
    s.log.unshift(`Turn ${s.turn} · roll ${s.rolls}: <span class="glyphs">${glyphs(next)}</span> ` +
      `<span class="muted">(kept ${held.length ? glyphs(held) : 'none'})</span>`);
    return true;
  }
  if (kind === 's') {
    if (s.rolls < 1) return false;
    const cat = CAT_CHARS.indexOf(tok[1]);
    if (!legalCats(s).includes(cat)) return false;
    const joker = isJoker(s);
    const pts = points(cat, s.dice, joker);
    let note = '';
    if (isYahtzee(s.dice) && s.scores[YAHTZEE] === 50) { s.bonus++; note = ' + 100 Yahtzee bonus'; }
    s.scores[cat] = pts;
    s.turns.push({ ...s.cur, category: CATS[cat], cat, points: pts, yahtzeeBonus: note ? 100 : 0, joker });
    s.cur = null;
    s.log.unshift(`Turn ${s.turn} · scored <b>${CATS[cat]}</b>: ${pts}${note}`);
    s.rolls = 0;
    s.dice = [];
    if (s.scores.every((v) => v !== null)) {
      s.over = true;
      s.log.unshift(`Game over · final score <b>${totals(s).total}</b>`);
    } else {
      s.turn++;
    }
    return true;
  }
  return false;
}

function totals(s) {
  const upper = sum(s.scores.slice(0, 6).map((v) => v || 0));
  const upperBonus = upper >= 63 ? 35 : 0;
  const lower = sum(s.scores.slice(6).map((v) => v || 0));
  const yb = s.bonus * 100;
  return { upper, upperBonus, lower, yb, total: upper + upperBonus + lower + yb };
}

function replay(tokens) {
  const s = newState();
  let good = '';
  for (const t of tokenList(tokens)) {
    if (!apply(s, t)) break; // stop at first bad token; keep what was valid
    good += t;
  }
  return { s, tokens: good };
}

// --- daily puzzle ---
// Puzzles 1-365 follow a non-leap calendar (Mar 1 is always 60); Feb 29 is 366.
// The seed is the puzzle number alone, so the same date has the same dice every year.
const MONTH_START = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

function puzzleFor(date) {
  const m = date.getMonth();
  const d = date.getDate();
  return m === 1 && d === 29 ? 366 : MONTH_START[m] + d;
}

const todayPuzzle = () => puzzleFor(new Date());

function dateKey(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function hashString(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
}

function mulberry32(a) {
  a = (a + 0x6D2B79F5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// each die value depends only on (puzzle, turn, roll number, position), never on earlier choices
function tapeDie(puzzle, turn, rollNo, die) {
  return Math.floor(mulberry32(hashString(`yahtzee:${puzzle}:${turn}:${rollNo}:${die}`)) * 6) + 1;
}

// --- game history (browser storage) ---
// yahtzee:daily:<date>  the token string the game page resumes from
// yahtzee:record:<date> the full-fidelity record: every move token plus the time
//                       (epoch ms) it was made; times[i] belongs to token i and is
//                       null when unknown (games played before tracking existed)
const DAILY_PREFIX = 'yahtzee:daily:';
const RECORD_PREFIX = 'yahtzee:record:';
const RECORD_SCHEMA = 1;

function storageKeys(prefix) {
  const out = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) out.push(k);
    }
  } catch (e) { /* storage unavailable */ }
  return out;
}

function readRecord(date) {
  try {
    const rec = JSON.parse(localStorage.getItem(RECORD_PREFIX + date));
    return rec && typeof rec.encoded === 'string' && VALID_RE.test(rec.encoded) ? rec : null;
  } catch (e) { return null; }
}

function writeRecord(rec) {
  try { localStorage.setItem(RECORD_PREFIX + rec.date, JSON.stringify(rec)); return true; } catch (e) { return false; }
}

// align a times array to n tokens: keep what matches, pad unknowns with null
function alignTimes(times, n) {
  const t = Array.isArray(times) ? times.slice(0, n).map((v) => (Number.isFinite(v) ? v : null)) : [];
  while (t.length < n) t.push(null);
  return t;
}

// build/refresh a record's derived summary fields from its tokens
function finishRecord(rec) {
  const { s, tokens } = replay(rec.encoded);
  const n = tokenList(tokens).length;
  rec.schema = RECORD_SCHEMA;
  rec.encoded = tokens;
  rec.times = alignTimes(rec.times, n);
  rec.complete = s.over;
  rec.total = totals(s).total;
  const known = rec.times.filter((v) => v !== null);
  rec.startedAt = rec.times[0] ?? rec.startedAt ?? null;
  rec.updatedAt = known.length ? known[known.length - 1] : (rec.updatedAt ?? null);
  rec.completedAt = s.over ? (rec.times[n - 1] ?? rec.completedAt ?? null) : null;
  return rec;
}

// called after every move on today's game; stamps the newest token with now
function recordMove(date, puzzle, tokens) {
  const now = Date.now();
  const n = tokenList(tokens).length;
  const prev = readRecord(date);
  const rec = prev || {
    date, puzzle, source: 'live', tzOffset: new Date().getTimezoneOffset(),
    userAgent: (typeof navigator !== 'undefined' && navigator.userAgent) || null,
  };
  const keep = prev && tokens.startsWith(prev.encoded) ? prev.times : [];
  rec.times = alignTimes(keep, n - 1).concat([now]);
  rec.encoded = tokens;
  return writeRecord(finishRecord(rec));
}

// games played before tracking existed only have a daily key; give them a record
function backfillRecords() {
  for (const k of storageKeys(DAILY_PREFIX)) {
    const date = k.slice(DAILY_PREFIX.length);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || readRecord(date)) continue;
    let t = '';
    try { t = localStorage.getItem(k) || ''; } catch (e) { continue; }
    if (!t || !VALID_RE.test(t)) continue;
    writeRecord(finishRecord({ date, puzzle: puzzleFor(parseDateKey(date)), encoded: t, times: [], source: 'backfill' }));
  }
}

function allRecords() {
  return storageKeys(RECORD_PREFIX)
    .map((k) => readRecord(k.slice(RECORD_PREFIX.length)))
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date));
}

// merge an imported record; the longer of two consistent games wins
function importRecord(inc) {
  if (!inc || typeof inc.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(inc.date)) return 'skipped';
  if (typeof inc.encoded !== 'string' || !VALID_RE.test(inc.encoded)) return 'skipped';
  const cur = readRecord(inc.date);
  if (cur && !(inc.encoded.length > cur.encoded.length && inc.encoded.startsWith(cur.encoded))) {
    return cur.encoded === inc.encoded ? 'unchanged' : 'kept local';
  }
  const rec = finishRecord({
    date: inc.date,
    puzzle: puzzleFor(parseDateKey(inc.date)),
    encoded: inc.encoded,
    times: inc.times,
    source: inc.source || 'import',
    tzOffset: Number.isFinite(inc.tzOffset) ? inc.tzOffset : null,
    userAgent: typeof inc.userAgent === 'string' ? inc.userAgent : null,
    startedAt: inc.startedAt ?? null,
    completedAt: inc.completedAt ?? null,
  });
  writeRecord(rec);
  try {
    const daily = localStorage.getItem(DAILY_PREFIX + rec.date) || '';
    if (rec.encoded.length > daily.length && rec.encoded.startsWith(daily)) localStorage.setItem(DAILY_PREFIX + rec.date, rec.encoded);
  } catch (e) { /* storage unavailable */ }
  return cur ? 'extended' : 'added';
}

// one game expanded for export: the stored record plus a readable breakdown
function expandRecord(rec) {
  const { s } = replay(rec.encoded);
  const t = totals(s);
  return {
    ...rec,
    turns: s.turns.map((turn) => ({
      turn: turn.turn,
      rolls: turn.rolls.map((r) => ({ dice: r.dice, kept: r.kept })),
      category: turn.category,
      points: turn.points,
      yahtzeeBonus: turn.yahtzeeBonus,
    })),
    scorecard: Object.fromEntries(CATS.map((c, i) => [c, s.scores[i]])),
    totals: { upper: t.upper, upperBonus: t.upperBonus, lower: t.lower, yahtzeeBonuses: t.yb, total: t.total },
  };
}
