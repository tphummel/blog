// Solve deals 0..N-1 in parallel; writes pool.json = [{n, solved, nodes, len}]
const { Worker, isMainThread, workerData, parentPort } = require('worker_threads');
const N = +process.argv[2] || 4000, CAP = +process.argv[3] || 100000, W = 4;
if (isMainThread) {
  const out = [];
  let left = W;
  for (let w = 0; w < W; w++) {
    const wk = new Worker(__filename, { workerData: { w } });
    wk.on('message', r => out.push(...r));
    wk.on('exit', () => {
      if (--left) return;
      out.sort((a, b) => a.n - b.n);
      require('fs').writeFileSync(__dirname + '/pool.json', JSON.stringify({ cap: CAP, deals: out }));
      const s = out.filter(x => x.solved);
      console.log(`solved ${s.length}/${out.length} (cap ${CAP})`);
    });
  }
} else {
  const E = require('./engine');
  const r = [];
  for (let n = workerData.w; n < N; n += W) {
    const x = E.solveGame(E.gameFromDeck('2028-01-01', E.dealDeck(n)), CAP);
    r.push({ n, solved: x.solved, nodes: x.nodes, len: x.path ? x.path.length : 0 });
  }
  parentPort.postMessage(r);
}
