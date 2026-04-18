---
title: "Roguelike Craps: Svelte Game Loop Design (v2)"
date: 2026-04-18
---

This design turns your `node-craps` simulator into a "run-based" browser game:

- You start with a bankroll.
- You choose a strategy (loaded dynamically from `node-craps`) and stop boundaries.
- You simulate hands until one boundary is hit.
- You choose the next strategy and continue the same run.
- The run ends when bankroll reaches 0 (bust) or target goal (win).

## Core Product Shape

### Main loop

1. **Initialize run**
   - `startingBankroll`
   - `goalBankroll`
   - optional `maxTotalHands` for the entire run
2. **Create stage** (a stage is one strategy segment)
   - choose `strategy`
   - choose stage exit criteria
3. **Simulate stage** hand-by-hand
4. **Stop stage** when first boundary is hit
5. **Apply stage result** to run history
6. If run still active, return to strategy selection
7. End run with `BUST`, `GOAL_REACHED`, or `TOTAL_HANDS_REACHED`

This is effectively a finite state machine (FSM), which maps well to Svelte stores.

## Domain Model

```ts
type RunStatus = 'SETUP' | 'READY_FOR_STAGE' | 'RUNNING_STAGE' | 'STAGE_COMPLETE' | 'RUN_COMPLETE'

type RunEndReason = 'BUST' | 'GOAL_REACHED' | 'TOTAL_HANDS_REACHED'

type StageExitReason =
  | 'HIT_HIGH_WATER'
  | 'HIT_LOW_WATER'
  | 'HIT_STAGE_HAND_LIMIT'
  | 'HIT_TOTAL_HAND_LIMIT'
  | 'BUST'
  | 'GOAL_REACHED'

type StrategyId = string

interface StrategyDefinition {
  id: StrategyId
  name: string
  description?: string
  riskTags?: string[]
}

interface RunConfig {
  startingBankroll: number
  goalBankroll: number
  maxTotalHands?: number
  seed?: string
}

interface StageConfig {
  strategyId: StrategyId
  highWaterMark?: number // absolute bankroll
  lowWaterMark?: number  // absolute bankroll
  maxHands?: number
  speed: 'instant' | 'fast' | 'step'
}

interface HandResult {
  runId: string
  stageNumber: number
  handNumber: number
  strategyId: StrategyId
  bankrollBefore: number
  bankrollAfter: number
  net: number
  summary: string
  startedAtIso: string
  completedAtIso: string
  rolls: number[]
  events: string[]
  detail?: Record<string, unknown> // full payload from node-craps for expandable view
}

interface StageResult {
  runId: string
  stageNumber: number
  strategyId: StrategyId
  startedAtBankroll: number
  endedAtBankroll: number
  handsPlayed: number
  exitReason: StageExitReason
  pnl: number
  startedAtIso: string
  completedAtIso: string
}

interface RunTranscript {
  runId: string
  startedAtIso: string
  completedAtIso?: string
  runConfig: RunConfig
  stageResults: StageResult[]
  hands: HandResult[]
  finalBankroll: number
  endReason?: RunEndReason
}
```

## Svelte Architecture

## Routes / pages

- `/play` route for active simulation:
  - `src/routes/play/+page.svelte`
- `/history` route for previous runs:
  - `src/routes/history/+page.svelte`
- Optional component split:
  - `RunSetupPanel.svelte`
  - `StageSetupPanel.svelte`
  - `SimulationControls.svelte`
  - `BankrollChart.svelte`
  - `TranscriptTable.svelte`
  - `HandRow.svelte` (collapsed summary + expandable details)
  - `RunHistoryTable.svelte`

## Store design

Use a central writable store (or a small store module) to hold run + stage state:

```ts
interface GameState {
  status: RunStatus
  runConfig: RunConfig | null
  availableStrategies: StrategyDefinition[]
  bankroll: number
  totalHands: number
  stageNumber: number
  currentStage: StageConfig | null
  stageHands: number
  history: StageResult[]
  handLog: HandResult[] // current run transcript
  runId: string | null
  runEndReason?: RunEndReason
}
```

Derived stores:

- `canStartRun`
- `canStartStage`
- `isRunning`
- `roi`
- `distanceToGoal`
- `canExportTranscript`
- `allRunsFromStorage`

## Engine Integration (`node-craps`)

Wrap your simulator behind a tiny adapter so UI never depends on raw library calls:

```ts
interface CrapsEngine {
  listStrategies(): StrategyDefinition[]
  setRollSequence?(rolls: number[]): void // deterministic testing hook (optional in production)
  nextHand(input: {
    bankroll: number
    strategyId: StrategyId
    tableState?: unknown
  }): {
    bankrollAfter: number
    tableState?: unknown
    detail: HandResult
  }
}
```

This allows you to:

- source strategies directly from the library (no duplicated hard-coded list)
- swap strategies cleanly between stages
- support deterministic replay with seeded RNG
- test loop logic independent of rendering

### Engine injection rule

The game loop should depend on an engine interface, not a concrete `node-craps` import:

```ts
interface GameLoopDeps {
  engine: CrapsEngine
  now: () => string
  randomSeed?: string
}
```

In production, pass your real `node-craps` adapter.
In tests, pass a fake engine that returns scripted hand outcomes.

### Strategy loading rule

On app boot, call `engine.listStrategies()` and store the result in `availableStrategies`.
If the library adds/removes strategies, the UI automatically reflects that change.

## Game Loop Algorithm

Pseudo-code for a cancellable async loop:

```ts
while (state.status === 'RUNNING_STAGE') {
  const result = engine.nextHand({ bankroll, strategyId, tableState })
  applyHand(result)
  appendToTranscript(result.detail)

  const reason = evaluateBoundaries(state)
  if (reason) {
    finalizeStage(reason)
    break
  }

  if (speed !== 'instant') await sleep(frameDelay)
  await tick() // keep UI responsive
}
```

### Boundary evaluation order (important)

Use deterministic priority to avoid ambiguity when several boundaries are crossed in one hand:

1. `bankroll <= 0` -> `BUST`
2. `bankroll >= goalBankroll` -> `GOAL_REACHED`
3. `bankroll >= highWaterMark` -> `HIT_HIGH_WATER`
4. `bankroll <= lowWaterMark` -> `HIT_LOW_WATER`
5. `stageHands >= maxHands` -> `HIT_STAGE_HAND_LIMIT`
6. `totalHands >= maxTotalHands` -> `HIT_TOTAL_HAND_LIMIT`

## UX Flow

## Setup panel

- Starting bankroll
- Goal bankroll
- Optional total hand cap
- Seed (optional)

CTA: **Start Run**

## Stage panel (shown after run starts)

- Strategy selector populated from `availableStrategies`
- Stage boundaries:
  - High water
  - Low water
  - Max hands
- Speed selector (`step`, `fast`, `instant`)

CTA: **Run Stage**

## Live simulation panel

- Current bankroll
- Stage P/L
- Total hands
- Last hand outcome
- Pause / Resume / Stop Stage
- Hand transcript table:
  - default row: hand summary (`hand #`, strategy, net, bankroll after)
  - click row expands into full detail (`rolls`, event breakdown, bet resolution payload)

## Run history (current run)

- Table of stages
- Sparkline chart for bankroll trajectory
- "What happened" badges for each exit reason

## Saved game history view

- Separate `/history` screen listing all completed runs from browser storage.
- Columns: run start/end time, starting bankroll, ending bankroll, peak bankroll, total hands, end reason.
- Click a run to open full transcript and export options.

## Browser storage plan

Persist completed runs using `localStorage` (or IndexedDB if transcripts become large).

Storage key proposal:

```txt
crapsRogue:runs:v1
```

Shape:

```ts
interface StoredRuns {
  schemaVersion: 1
  runs: RunTranscript[]
}
```

Retention options:

- keep all runs (default)
- max N runs (e.g., 100) with oldest trimmed

## Balancing and Feel (Roguelike Layer)

To make it feel like a roguelike instead of a plain simulator:

- **Meta-progression stats** (across runs):
  - best bankroll peak
  - longest survival by hands
  - win rate by strategy
- **Unlocks**:
  - strategies unlocked after milestones
  - optional modifiers (e.g., reduced max odds, hot table bonus)
- **Risk events between stages**:
  - choose one of 2 modifiers before next stage
  - each has upside + downside

Start simple: implement pure simulation first, add meta layer later.

## Reporting / export

- Provide **Download Report** button at run completion and in history detail view.
- Supported formats:
  - `JSON` (full fidelity transcript)
  - `CSV` (stage summary + hand summary rows)
- File naming:
  - `craps-run-<runId>-<YYYYMMDD-HHmm>.json`
  - `craps-run-<runId>-<YYYYMMDD-HHmm>.csv`

## MVP Scope (first shippable version)

1. Single page with 3 panels: run setup, stage setup, results
2. Dynamic strategy list from `node-craps` (no hard-coded list)
3. Stage boundaries: high/low/max-hands
4. Run end: bust or goal
5. Hand transcript (summary rows with expandable details)
6. One bankroll chart
7. Run report export (JSON at minimum)
8. Persistent history page backed by browser storage

Defer until v2:

- animation polish
- unlock system
- achievements
- sharable run seed links

## Testing Plan

## Automated test strategy (game-specific only)

Goal: test only your game loop + mechanics (not `node-craps` internals).

Approach:

1. Keep all run/stage mechanics in pure functions where possible.
2. Inject dependencies (`engine`, clock, RNG seed source) into the loop runner.
3. Use either:
   - deterministic roll sequences via `engine.setRollSequence(...)`, or
   - a full fake engine that returns exact scripted `HandResult` values.
4. Assert only game-owned behavior:
   - ending criteria
   - stage exit criteria
   - precedence order
   - transcript construction
   - storage/export behavior

## Unit tests

- `evaluateBoundaries` priority and correctness
- stage finalization math (P/L, hand counts)
- run completion triggers
- transcript append/expand model transformation correctness
- storage key serialization/deserialization (`crapsRogue:runs:v1`)

## Integration tests

- start run -> run stage -> stage complete -> run complete
- switch strategies between stages preserves bankroll
- deterministic seed yields identical stage results
- strategies shown in UI exactly match `engine.listStrategies()`
- completed run appears in `/history` after reload
- exported JSON can be re-imported and parsed
- deterministic roll sequence yields identical exit reason and transcript
- fake-engine scenario can force each exit reason independently

## Manual QA checklist

- high and low water crossed near same hand uses correct priority
- rapid instant mode does not freeze UI
- pause/resume works without double-counting hands
- resetting starts a clean run
- hand rows are collapsed by default and expand correctly on click
- exporting report downloads a valid file with expected naming
- prior runs remain available after browser refresh

## Example test harness patterns

### Pattern A: deterministic dice sequence using real adapter

Use this when you want confidence the adapter wiring is correct while still stabilizing outcomes.

```ts
const engine = createNodeCrapsAdapter()
engine.setRollSequence?.([7, 11, 2, 3, 12, 6, 8, 7])

const runner = createGameRunner({ engine, now: fixedClock('2026-04-18T00:00:00Z') })
const result = runner.runStage(...)
expect(result.exitReason).toBe('HIT_HIGH_WATER')
```

### Pattern B: fake engine for pure game-loop mechanics

Use this as the default for automation so tests do not re-test `node-craps`.

```ts
const engine = createFakeEngine({
  strategies: [{ id: 'any', name: 'Any' }],
  hands: [
    { net: +10, bankrollAfter: 110 },
    { net: -30, bankrollAfter: 80 },
  ],
})

const runner = createGameRunner({ engine, now: fixedClock('2026-04-18T00:00:00Z') })
const result = runner.runStage(...)
expect(result.exitReason).toBe('HIT_LOW_WATER')
```

Recommended split:

- ~80% tests use fake engine (fast, deterministic, game-only)
- ~20% tests use deterministic roll sequence on real adapter (wiring confidence)

## Suggested Implementation Order

1. Add `GameState` store and FSM transitions
2. Build run setup form and stage setup form
3. Implement simulator adapter (`node-craps` wrapper)
4. Implement async stage loop with cancellation
5. Add transcript table (summary + expandable hand details)
6. Add history persistence and `/history` route
7. Add JSON/CSV export
8. Add seed + replay support

---

If you want, the next step is for me to sketch concrete Svelte component props/events and a TypeScript `gameEngine.ts` scaffold you can drop directly into your app.
