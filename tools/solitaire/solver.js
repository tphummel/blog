// Thoughtful (all cards visible) Klondike solver for draw-1, unlimited passes.
// Because every talon card can be reached by cycling, the talon is treated as a set.
// Search is DFS with a transposition table; "nodes" to the first solution is the difficulty metric.
const E = require('./engine');
const { suitOf, rankOf, isRed } = E;

function initial(deck) {
  const tab = [], up = [];
  let k = 0;
  for (let i = 0; i < 7; i++) { tab.push(deck.slice(k, k + i + 1)); up.push(1); k += i + 1; }
  return { tab, up, found: [0, 0, 0, 0], talon: deck.slice(28) };
}
const clone = s => ({ tab: s.tab.map(p => p.slice()), up: s.up.slice(), found: s.found.slice(), talon: s.talon.slice() });
function key(s) {
  const sigs = s.tab.map((p, i) => s.up[i] + ':' + p.join(','));
  sigs.sort();
  return sigs.join('|') + '#' + s.found.join(',') + '#' + s.talon.slice().sort((a, b) => a - b).join(',');
}
const OPP = [[1, 2], [0, 3], [0, 3], [1, 2]];
const safe = (c, found) => { const r = rankOf(c); return r <= 1 ? true : found[OPP[suitOf(c)][0]] >= r && found[OPP[suitOf(c)][1]] >= r; };

function popPile(s, i) { // remove top card of pile i, flip if needed
  const c = s.tab[i].pop();
  s.up[i]--;
  if (s.up[i] === 0 && s.tab[i].length) s.up[i] = 1;
  return c;
}
// Apply all safe foundation moves, appending them to `moves`.
function autoSafe(s, moves) {
  let again = true;
  while (again) {
    again = false;
    for (let i = 0; i < 7; i++) {
      const p = s.tab[i];
      if (!p.length) continue;
      const c = p[p.length - 1];
      if (rankOf(c) === s.found[suitOf(c)] && safe(c, s.found)) {
        popPile(s, i); s.found[suitOf(c)]++; moves.push({ f: i, t: 'f', n: 1, c }); again = true;
      }
    }
    for (let j = 0; j < s.talon.length; j++) {
      const c = s.talon[j];
      if (rankOf(c) === s.found[suitOf(c)] && safe(c, s.found)) {
        s.talon.splice(j, 1); s.found[suitOf(c)]++; moves.push({ f: 'w', t: 'f', n: 1, c }); again = true; break;
      }
    }
  }
}
const fits = (s, c, j) => {
  const p = s.tab[j];
  if (!p.length) return rankOf(c) === 12;
  const top = p[p.length - 1];
  return isRed(top) !== isRed(c) && rankOf(c) === rankOf(top) - 1;
};
function candidates(s) {
  const out = [];
  for (let i = 0; i < 7; i++) {
    const p = s.tab[i];
    if (!p.length) continue;
    const top = p[p.length - 1];
    if (rankOf(top) === s.found[suitOf(top)]) out.push({ pri: p.length > s.up[i] ? 0 : 1, mv: { f: i, t: 'f', n: 1, c: top } });
    for (let k = 1; k <= s.up[i]; k++) {
      const b = p[p.length - k];
      for (let j = 0; j < 7; j++) {
        if (j === i || !fits(s, b, j)) continue;
        if (!s.tab[j].length && k === p.length) continue; // pointless king shuffle
        out.push({ pri: k === s.up[i] && p.length > k ? 0 : 3, mv: { f: i, t: j, n: k, c: b } });
      }
    }
  }
  for (const c of s.talon) {
    if (rankOf(c) === s.found[suitOf(c)]) out.push({ pri: 1, mv: { f: 'w', t: 'f', n: 1, c } });
    for (let j = 0; j < 7; j++) if (fits(s, c, j)) out.push({ pri: 2, mv: { f: 'w', t: j, n: 1, c } });
  }
  out.sort((a, b) => a.pri - b.pri);
  return out.map(x => x.mv);
}
function step(s, mv) {
  const n = clone(s);
  let cards;
  if (mv.f === 'w') { n.talon.splice(n.talon.indexOf(mv.c), 1); cards = [mv.c]; }
  else { const p = n.tab[mv.f]; cards = p.splice(p.length - mv.n, mv.n); n.up[mv.f] -= mv.n; if (n.up[mv.f] === 0 && p.length) n.up[mv.f] = 1; }
  if (mv.t === 'f') n.found[suitOf(cards[0])]++;
  else { n.tab[mv.t].push(...cards); n.up[mv.t] += cards.length; }
  return n;
}
const done = s => s.found[0] + s.found[1] + s.found[2] + s.found[3] === 52;

function solve(deck, cap) {
  let nodes = 0, capped = false;
  const seen = new Set();
  const root = initial(deck), pre = [];
  autoSafe(root, pre);
  function dfs(s) {
    if (done(s)) return [];
    if (++nodes > cap) { capped = true; return null; }
    const k = key(s);
    if (seen.has(k)) return null;
    seen.add(k);
    for (const mv of candidates(s)) {
      const n = step(s, mv);
      const extra = [];
      autoSafe(n, extra);
      const r = dfs(n);
      if (capped) return null;
      if (r) return [mv, ...extra, ...r];
    }
    return null;
  }
  const r = dfs(root);
  return { solved: !!r, nodes, path: r ? [...pre, ...r] : null };
}

// Replay a solver path through the real game engine. Returns {ok, moves} (engine moves incl. draws/recycles).
function materialize(g, path) {
  const moves = [];
  const act = mv => { const r = E.apply(g, { t: 0, ...mv }); if (!r) throw new Error('illegal ' + JSON.stringify(mv)); moves.push(mv); };
  for (const m of path) {
    if (m.f === 'w') {
      let guard = 0;
      while (g.waste[g.waste.length - 1] !== m.c) {
        if (++guard > 60) throw new Error('card ' + E.cardName(m.c) + ' not reachable');
        act({ k: g.stock.length ? 'd' : 'r' });
      }
    }
    act({ k: 'm', from: m.f === 'w' ? 'w' : 't' + m.f, to: m.t === 'f' ? 'f' + suitOf(m.c) : 't' + m.t, n: m.n });
  }
  return { ok: E.foundCount(g) === 52, moves };
}
module.exports = { solve, materialize };
