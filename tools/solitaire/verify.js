// For every calendar day the simulated player must win from the deal in 30/30 random runs, played through
// the game's real engine. A win by legal moves also proves the deal is solvable.
const E = require('./engine'), { play, rngOf } = require('./player');
const MD = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const seen = new Set();
let ok = 0, playerMoves = 0;
for (let m = 1; m <= 12; m++) for (let d = 1; d <= MD[m - 1]; d++) {
  const date = `2028-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const n = E.DEALS[E.DAYS_BEFORE[m - 1] + d - 1];
  if (seen.has(n)) throw new Error('dup ' + n); seen.add(n);
  for (let r = 0; r < 30; r++) {
    const g = E.newGame(date);
    if (!play(g, rngOf(n * 1000 + r)) || E.foundCount(g) !== 52) throw new Error(`player lost ${date} run ${r}`);
    playerMoves += g.log.length;
  }
  ok++;
}
console.log(`verified ${ok}/366 days: simulated player wins 30/30 (avg player moves ${Math.round(playerMoves / ok / 30)})`);
