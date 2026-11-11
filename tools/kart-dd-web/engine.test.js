// Run: node tools/kart-dd-web/engine.test.js
const assert = require('assert');
const E = require('../../static/kart-dd-web/engine.js');

const perfs = (rows) => rows.map(([player, kart, driver, rear, finish]) => ({ player, kart, driver, rear, finish }));
const mk = (fmt = 'baby4', players = ['A', 'B', 'C', 'D']) =>
  E.newSession({ name: 'T', players, formatKey: fmt });
const race = (course, rows) => ({ course, perfs: perfs(rows) });

// validation rules mirrored from Match.java
{
  const s = mk('vs2', ['A', 'B']);
  const ok = race('Baby Park', [['A', 'Toad Kart', 'Toad', 'Koopa', 1], ['B', 'Barrel Train', 'Luigi', 'Peach', 2]]);
  assert.ok(E.addRace(s, ok));
  const bad = (rows, re) => assert.throws(() => E.addRace(s, race('Baby Park', rows)), re);
  bad([['A', '', 'Toad', 'Koopa', 1], ['B', 'Barrel Train', 'Luigi', 'Peach', 2]], /kart/);
  bad([['A', 'Toad Kart', 'Toad', 'Toad', 1], ['B', 'Barrel Train', 'Luigi', 'Peach', 2]], /two Toad/);
  bad([['A', 'Toad Kart', 'Toad', 'Koopa', 1], ['B', 'Barrel Train', 'Toad', 'Peach', 2]], /two players using: Toad/);
  bad([['A', 'Toad Kart', 'Toad', 'Koopa', 1], ['B', 'Barrel Train', 'Luigi', 'Peach', 1]], /duplicate finish/);
  bad([['A', 'Toad Kart', 'Toad', 'Koopa', 1], ['B', 'Barrel Train', 'Luigi', 'Peach', 3]], /finish/);
  bad([['A', 'Toad Kart', 'Toad', 'Koopa', 1], ['B', 'Barrel Train', 'Luigi', 'Peach', NaN]], /finish/);
  assert.throws(() => E.addRace(s, { course: 'Luigi Circuit', perfs: ok.perfs }), /course/);
  assert.strictEqual(s.races.length, 1);
}

// standings, points, ties, gap
{
  const s = mk('vs2', ['A', 'B']);
  const r = (a, b) => E.addRace(s, race('Baby Park', [['A', 'Toad Kart', 'Toad', 'Koopa', a], ['B', 'Barrel Train', 'Luigi', 'Peach', b]]));
  r(1, 2); r(2, 1); r(1, 2);
  const st = E.standings(s);
  assert.deepStrictEqual(st.map((x) => [x.player, x.points, x.races]), [['A', 5, 3], ['B', 4, 3]]);
  assert.deepStrictEqual(st[0].finishes, [2, 1]);
  assert.strictEqual(E.gapMatrix(s).A.B.gap, 1);
  assert.strictEqual(E.gapMatrix(s).B.A.gap, -1);
  // delete renumbers
  E.deleteRace(s, s.races[0].id);
  assert.deepStrictEqual(s.races.map((x) => x.seq), [1, 2]);
  // tie broken by head to head
  const t = mk('vs2', ['A', 'B']);
  E.addRace(t, race('Baby Park', [['A', 'Toad Kart', 'Toad', 'Koopa', 1], ['B', 'Barrel Train', 'Luigi', 'Peach', 2]]));
  E.addRace(t, race('Baby Park', [['A', 'Toad Kart', 'Toad', 'Koopa', 2], ['B', 'Barrel Train', 'Luigi', 'Peach', 1]]));
  E.addRace(t, race('Baby Park', [['A', 'Toad Kart', 'Toad', 'Koopa', 2], ['B', 'Barrel Train', 'Luigi', 'Peach', 1]]));
  E.addRace(t, race('Baby Park', [['A', 'Toad Kart', 'Toad', 'Koopa', 1], ['B', 'Barrel Train', 'Luigi', 'Peach', 2]]));
  assert.strictEqual(E.standings(t)[0].points, E.standings(t)[1].points);
}

// race limit + edit
{
  const s = E.newSession({ name: 'L', players: ['A', 'B'], format: E.makeFormat('vs2', { raceLimit: 1 }) });
  const rr = race('Baby Park', [['A', 'Toad Kart', 'Toad', 'Koopa', 1], ['B', 'Barrel Train', 'Luigi', 'Peach', 2]]);
  const added = E.addRace(s, rr);
  assert.throws(() => E.addRace(s, rr), /full/);
  rr.perfs[0].finish = 2; rr.perfs[1].finish = 1;
  E.updateRace(s, added.id, rr); // editing a full session is allowed
  assert.strictEqual(s.races[0].perfs[0].finish, 2);
}

// 8-racer GP with bots: 2 humans, finishes 1..8
{
  const s = mk('gp2', ['A', 'B']);
  E.addRace(s, race('Luigi Circuit', [['A', 'Toad Kart', 'Toad', 'Koopa', 3], ['B', 'Barrel Train', 'Luigi', 'Peach', 8]]));
  assert.deepStrictEqual(E.standings(s).map((x) => x.points), [6, 0]);
  assert.strictEqual(E.standings(s)[0].finishes.length, 8);
}

// export / import round trip, CSV escaping, merge never overwrites
{
  const s = mk('vs2', ['A', 'B']);
  s.name = 'Fri, "big" night';
  E.addRace(s, Object.assign(race('Baby Park', [['A', 'Toad Kart', 'Toad', 'Koopa', 1], ['B', 'Barrel Train', 'Luigi', 'Peach', 2]]), { notes: 'line1\nline2' }));
  const csv = E.toCSV([s]);
  assert.ok(csv.startsWith(E.CSV_COLUMNS.join(',') + '\n'));
  assert.ok(csv.includes('"Fri, ""big"" night"'));
  assert.ok(csv.includes('"line1\nline2"'));
  assert.strictEqual(csv.trim().split('\n').length - 1 >= 2, true);
  const back = E.parseImport(E.toJSON([s]));
  assert.deepStrictEqual(back[0].races[0].perfs, s.races[0].perfs);
  const store = E.emptyStore();
  assert.deepStrictEqual(E.mergeImport(store, back), { added: 1, copies: 0, skipped: 0 });
  assert.deepStrictEqual(E.mergeImport(store, E.parseImport(E.toJSON([s]))), { added: 0, copies: 0, skipped: 1 });
  s.races[0].notes = 'changed';
  assert.deepStrictEqual(E.mergeImport(store, E.parseImport(E.toJSON([s]))), { added: 1, copies: 1, skipped: 0 });
  assert.strictEqual(store.sessions.length, 2);
  assert.strictEqual(store.sessions[0].races[0].notes, 'line1\nline2');
  assert.throws(() => E.parseImport('nope'), /JSON/);
  assert.throws(() => E.parseImport('{"app":"x"}'), /export/);
  const corrupt = JSON.parse(E.toJSON([s]));
  corrupt.sessions[0].races[0].perfs[1].finish = 1;
  assert.throws(() => E.parseImport(JSON.stringify(corrupt)), /duplicate finish/);
}

// storage failure paths
{
  const bad = { getItem() { throw new Error('x'); }, setItem() { throw new Error('x'); } };
  assert.deepStrictEqual(E.loadStore(bad).sessions, []);
  assert.strictEqual(E.saveStore(bad, E.emptyStore()), false);
  const mem = { d: {}, getItem(k) { return this.d[k] || null; }, setItem(k, v) { this.d[k] = v; } };
  assert.strictEqual(E.saveStore(mem, { schema: 1, sessions: [mk()] }), true);
  assert.strictEqual(E.loadStore(mem).sessions.length, 1);
}

// session creation guards
assert.throws(() => E.newSession({ name: '', players: ['A', 'B'], formatKey: 'vs2' }), /name/);
assert.throws(() => E.newSession({ name: 'x', players: ['A'], formatKey: 'vs2' }), /two players/);
assert.throws(() => E.newSession({ name: 'x', players: ['A', 'a'], formatKey: 'vs2' }), /unique/);
console.log('engine tests passed');
