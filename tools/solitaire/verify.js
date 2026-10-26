// Re-solve every calendar day's deal and replay the solution through the game's real engine.
const E = require('./engine'), { solve, materialize } = require('./solver');
let ok = 0, lens = { easy: [], medium: [], hard: [] };
const seen = new Set();
const MD = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
for (let m = 1; m <= 12; m++) for (let d = 1; d <= MD[m - 1]; d++) {
  const date = `2028-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const n = E.DEALS[E.DAYS_BEFORE[m - 1] + d - 1];
  if (seen.has(n)) throw new Error('dup ' + n); seen.add(n);
  const g = E.newGame(date);
  const r = solve(E.dealDeck(n), 200000);
  if (!r.solved) throw new Error('unsolved ' + date);
  const res = materialize(g, r.path);
  if (!res.ok) throw new Error('not a win ' + date);
  ok++; lens[E.tierOf(date)].push(res.moves.length);
}
const avg = a => Math.round(a.reduce((x, y) => x + y, 0) / a.length);
console.log(`verified ${ok}/366 wins in the game engine`, Object.fromEntries(Object.entries(lens).map(([k, v]) => [k + ' avg engine moves', avg(v)])));
