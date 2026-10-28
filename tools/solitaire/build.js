// Pick 366 deals the simulated player wins every time (rates.json from rate.js), assign them to calendar
// days, rewrite the DEALS table in static/solitaire/index.html and write deals.json (reference data).
const fs = require('fs'), path = require('path');
const { runs, deals } = JSON.parse(fs.readFileSync(path.join(__dirname, 'rates.json')));
const cands = deals.filter(d => d.rate === 1).sort((a, b) => a.n - b.n);
if (cands.length < 366) throw new Error('need 366 candidates, have ' + cands.length);
// spread the picks across the candidate list, then scatter deterministically across the calendar
const picks = Array.from({ length: 366 }, (_, i) => cands[Math.floor(i * cands.length / 366)]);
picks.sort((a, b) => ((a.n * 2654435761) >>> 0) - ((b.n * 2654435761) >>> 0));
const MD = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const table = [];
MD.forEach((len, m) => { for (let d = 1; d <= len; d++) table.push(`${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`); });
const out = table.map((date, i) => ({ date, n: picks[i].n }));
if (new Set(out.map(x => x.n)).size !== 366) throw new Error('duplicate deals');
fs.writeFileSync(path.join(__dirname, 'deals.json'), JSON.stringify({
  note: `date = MM-DD; n = deal number (seed klondike-draw2-deal-<n>); every deal was won in ${runs}/${runs} runs by the simulated player`,
  deals: out,
}, null, 1));
const html = path.join(__dirname, '../../static/solitaire/index.html');
let s = fs.readFileSync(html, 'utf8');
s = s.replace(/\/\*deals\*\/\[[^\]]*\]\/\*end\*\//, `/*deals*/[${out.map(x => x.n).join(',')}]/*end*/`);
fs.writeFileSync(html, s);
console.log(`picked 366 of ${cands.length} always-won deals; deal numbers ${Math.min(...out.map(x => x.n))}..${Math.max(...out.map(x => x.n))}`);
