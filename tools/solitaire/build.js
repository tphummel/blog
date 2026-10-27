// Pick 366 solvable deals from pool.json, bucketed by solver effort, assign to calendar days,
// write static/solitaire/index.html's DEALS table and deals.json (reference data).
const fs = require('fs'), path = require('path');
const { deals } = JSON.parse(fs.readFileSync(path.join(__dirname, 'pool.json')));
const solved = deals.filter(d => d.solved).sort((a, b) => a.nodes - b.nodes || a.n - b.n);
const q = f => Math.floor(solved.length * f);
const buckets = {
  easy: solved.slice(0, q(0.30)),
  medium: solved.slice(q(0.35), q(0.65)),
  hard: solved.slice(q(0.70)),
};
const MD = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const slots = [];
MD.forEach((len, m) => { for (let d = 1; d <= len; d++) slots.push({ m: m + 1, d, tier: d <= 10 ? 'easy' : d <= 20 ? 'medium' : 'hard' }); });
const taken = { easy: 0, medium: 0, hard: 0 };
// Spread each tier's picks evenly across its bucket so a tier isn't just its extreme end.
const need = { easy: 0, medium: 0, hard: 0 };
slots.forEach(s => need[s.tier]++);
const pick = {};
for (const t of Object.keys(buckets)) {
  const b = buckets[t].slice().sort((a, b) => a.nodes - b.nodes || a.n - b.n);
  if (b.length < need[t]) throw new Error('bucket too small: ' + t);
  pick[t] = Array.from({ length: need[t] }, (_, i) => b[Math.floor(i * b.length / need[t])]);
  // deterministic scatter so day order doesn't track difficulty within a tier
  pick[t].sort((a, b) => ((a.n * 2654435761) >>> 0) - ((b.n * 2654435761) >>> 0));
}
const table = slots.map(s => ({ date: `${String(s.m).padStart(2, '0')}-${String(s.d).padStart(2, '0')}`, tier: s.tier, ...pick[s.tier][taken[s.tier]++] }));
const nums = table.map(t => t.n);
if (new Set(nums).size !== 366) throw new Error('duplicate deals');
fs.writeFileSync(path.join(__dirname, 'deals.json'), JSON.stringify({
  note: 'date = MM-DD; n = deal number (seed klondike-draw1-deal-<n>); nodes = DFS nodes to first solution (difficulty metric)',
  deals: table.map(t => ({ date: t.date, tier: t.tier, n: t.n, nodes: t.nodes })),
}, null, 1));
const html = path.join(__dirname, '../../static/solitaire/index.html');
let s = fs.readFileSync(html, 'utf8');
s = s.replace(/\/\*deals\*\/\[[^\]]*\]\/\*end\*\//, `/*deals*/[${nums.join(',')}]/*end*/`);
fs.writeFileSync(html, s);
const stat = t => { const x = table.filter(r => r.tier === t).map(r => r.nodes); return `${t}: ${x.length} deals, nodes ${Math.min(...x)}..${Math.max(...x)}`; };
console.log(['easy', 'medium', 'hard'].map(stat).join('\n'));
console.log('bucket sizes', Object.fromEntries(Object.entries(buckets).map(([k, v]) => [k, v.length])), 'quantile nodes', [0.3, 0.35, 0.65, 0.7].map(f => solved[q(f)].nodes));
