# Solitaire deal tools (draw 2)

Generates and verifies the 366 fixed deals used by `static/solitaire/` (one per calendar day, same every year).

- `engine.js` loads the game's own cards/deal/rules **and solver** code from `static/solitaire/index.html`, so tools and browser agree.
- `player.js` is a simulated human: it sees only face-up cards, the top waste card and the foundations; plays safe foundation moves, moves that turn over a face-down card (most face-down first), waste plays, and only then draws; after a full pass with nothing to do it tries riskier moves, then gives up. Ties are broken at random. The share of random runs it wins is a deal's difficulty as a player would experience it.
- `rate.js [N] [runs]` scores deals `0..N-1` (seed `klondike-draw2-deal-<n>`) with the player in 4 threads (a deal lost 6 times in a row is skipped), writing `rates.json` (not committed). Used: `node rate.js 4000 30` -> 826 deals won 30/30.
- `build.js` takes deals the player always wins, spreads 366 picks across them, scatters them over the calendar, rewrites the `DEALS` table in `index.html`, and writes `deals.json`.
- `verify.js` plays every day's deal 30 times with the player through the real engine; all must end with 52 cards on the foundations (a win by legal moves also proves the deal is solvable).
- The solver in the page (DFS with a transposition table; talon as a cyclic list plus waste pointer) powers the in-game Auto-solve. It is not used to pick deals: it hits its search cap on some deals the player wins easily, and "solver search effort" turned out to track real difficulty poorly (the first set of "easy" deals was won only 56% of the time by the player; "hard" 25%). `search.js [N] [cap]` still runs it over a range of deals if you want to compare.
