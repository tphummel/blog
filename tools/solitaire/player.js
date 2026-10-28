// A simulated human player: plays by what is visible (face-up tableau, top waste card, foundations),
// never looks at face-down cards, never looks ahead more than one move, and breaks ties at random.
// The share of random runs it wins is the "how a player would see it" difficulty of a deal.
const E = require('./engine');
const { suitOf, rankOf } = E;
const OPP = [[1, 2], [0, 3], [0, 3], [1, 2]];
const safeUp = (c, f) => { const r = rankOf(c); return r <= 1 || (f[OPP[suitOf(c)][0]].length >= r && f[OPP[suitOf(c)][1]].length >= r); };
const upCount = p => { let u = 0; for (let i = p.length - 1; i >= 0 && p[i].up; i--) u++; return u; };
function rngOf(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// All moves of one kind; each returns {from,to,n} candidates.
function moves(g, desperate) {
  const out = { safeUp: [], flip: [], waste: [], up: [], partial: [] };
  const tops = [];
  g.tab.forEach((p, i) => { if (p.length) tops.push({ addr: 't' + i, c: p[p.length - 1].c }); });
  if (g.waste.length) tops.push({ addr: 'w', c: g.waste[g.waste.length - 1] });
  for (const t of tops) {
    const s = suitOf(t.c);
    if (rankOf(t.c) === g.found[s].length) (safeUp(t.c, g.found) ? out.safeUp : out.up).push({ from: t.addr, to: 'f' + s, n: 1 });
  }
  g.tab.forEach((p, i) => {
    const u = upCount(p);
    for (let n = 1; n <= u; n++) {
      const cards = E.peek(g, 't' + i, n);
      for (let j = 0; j < 7; j++) {
        if (j === i || !E.canDrop(g, cards, 't' + i, 't' + j)) continue;
        if (!g.tab[j].length && n === p.length) continue; // pointless king shuffle
        const flips = n === u && p.length > u;
        (flips ? out.flip : out.partial).push({ from: 't' + i, to: 't' + j, n, hidden: p.length - u });
      }
    }
  });
  if (g.waste.length) {
    const cards = [g.waste[g.waste.length - 1]];
    for (let j = 0; j < 7; j++) if (E.canDrop(g, cards, 'w', 't' + j)) out.waste.push({ from: 'w', to: 't' + j, n: 1 });
  }
  return out;
}
const pick = (a, rng) => a[Math.floor(rng() * a.length)];

function play(g, rng, maxSteps = 3000) {
  let sinceProgress = 0, steps = 0;
  const act = mv => E.apply(g, { t: 0, k: 'm', ...mv });
  while (steps++ < maxSteps) {
    if (E.foundCount(g) === 52) return true;
    const m = moves(g);
    let mv = null;
    if (m.safeUp.length) mv = pick(m.safeUp, rng);
    else if (m.flip.length) { const best = Math.max(...m.flip.map(x => x.hidden)); mv = pick(m.flip.filter(x => x.hidden === best), rng); }
    else if (m.waste.length || m.up.some(x => x.from === 'w')) mv = pick([...m.waste, ...m.up.filter(x => x.from === 'w')], rng);
    if (mv) { if (!act(mv)) return false; sinceProgress = 0; continue; }
    const talon = g.stock.length + g.waste.length;
    if (sinceProgress <= Math.ceil(talon / E.DRAW) + 2 && talon) {
      act({ k: g.stock.length ? 'd' : 'r' }); sinceProgress++; continue;
    }
    // a full pass found nothing: a human now tries riskier moves (foundation plays, shuffling runs)
    const risky = [...m.up, ...m.partial];
    if (!risky.length) return false;
    act(pick(risky, rng)); sinceProgress = 0;
  }
  return false;
}
function winRate(n, runs) {
  let w = 0;
  for (let r = 0; r < runs; r++) {
    const g = E.gameFromDeck('2028-01-01', E.dealDeck(n));
    if (play(g, rngOf(n * 1000 + r))) w++;
  }
  return w / runs;
}
module.exports = { winRate, play, rngOf };
