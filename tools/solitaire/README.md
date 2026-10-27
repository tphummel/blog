# Solitaire deal tools

Generates and verifies (draw 2) the 366 fixed deals used by `static/solitaire/` (one per calendar day, same every year).

- `engine.js` loads the game's own cards/deal/rules **and solver** code from `static/solitaire/index.html`, so tools and browser agree.
- The solver (in the page; also powers the in-game Auto-solve) is a draw-2, unlimited-pass, all-cards-visible DFS with a transposition table. The talon is a cyclic list plus a waste pointer, so only cards actually reachable by drawing/recycling are playable. Safe foundation moves are applied automatically. Foundation-to-tableau moves are never used, so "solvable" means solvable without them.
- `search.js [N] [cap]` solves deals `0..N-1` (seed `klondike-draw2-deal-<n>`) in 4 threads, writing `pool.json` (not committed). Used: `node search.js 4000 100000` (2334 solved).
- `build.js` ranks solved deals by DFS nodes to first solution (the difficulty metric): easy = lowest 30%, medium = 35-65%, hard = top 30%. It picks 120 / 120 / 126 spread across each bucket, assigns them to days (1-10 easy, 11-20 medium, 21+ hard, Feb 29 hard), rewrites the `DEALS` table in `index.html`, and writes `deals.json`.
- `verify.js` re-solves all 366 days and replays each solution through the real game engine; every one must end with 52 cards on the foundations.

Difficulty is search effort for a solver, not a measured human win rate. Easy deals are ones a no-backtracking greedy player mostly wins.
