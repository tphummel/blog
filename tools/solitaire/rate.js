// Score deals 0..N-1 with the simulated player (player.js) in parallel; writes rates.json (not committed).
const { Worker, isMainThread, workerData, parentPort } = require('worker_threads');
const N = +process.argv[2] || 4000, RUNS = +process.argv[3] || 30, W = 4;
if (isMainThread) {
  const out = [];
  let left = W;
  for (let w = 0; w < W; w++) {
    const wk = new Worker(__filename, { workerData: { w } });
    wk.on('message', r => out.push(...r));
    wk.on('exit', () => {
      if (--left) return;
      out.sort((a, b) => a.n - b.n);
      require('fs').writeFileSync(__dirname + '/rates.json', JSON.stringify({ runs: RUNS, deals: out }));
      const hist = {};
      out.forEach(d => { const k = Math.floor(d.rate * 10) / 10; hist[k] = (hist[k] || 0) + 1; });
      console.log('rate histogram', hist);
    });
  }
} else {
  const { winRate } = require('./player');
  const r = [];
  for (let n = workerData.w; n < N; n += W) {
    // cheap screen: a deal the player loses 6 times in a row is not an easy deal
    const screen = winRate(n, 6);
    r.push({ n, rate: screen === 0 ? 0 : winRate(n, RUNS) });
  }
  parentPort.postMessage(r);
}
