import { useEffect, useReducer } from 'react'
import { useLang } from './context'

// ---------------------------------------------------------------------------
// Bug Hunt — 30 saniyəlik mini oyun.
// Baqlar xanalarda görünür və bir müddət sonra qaçır; onları tutmaq xal verir.
// Yaşıl "feature"lərə toxunmaq xal aparır. Oyun getdikcə sürətlənir.
// Bütün təsadüfi dəyərlər reducer-dən KƏNARDA yaradılır (reducer təmiz qalır).
// ---------------------------------------------------------------------------

const SIZE = 16 // 4×4
const ROUND_MS = 30_000
const TICK_MS = 100
const FEATURE_PENALTY = 3
const BEST_KEY = 'bughunt-best'

const empty = () => Array(SIZE).fill(null)

const initial = {
  status: 'idle', // idle | playing | over
  timeLeft: ROUND_MS,
  score: 0,
  combo: 0,
  hits: 0,
  escaped: 0,
  cells: empty(),
  best: 0,
  newRecord: false,
}

function spawn(cells, type, ttl, r) {
  const free = []
  cells.forEach((c, i) => !c && free.push(i))
  if (!free.length) return cells
  const next = cells.slice()
  next[free[Math.floor(r * free.length)]] = { type, ttl }
  return next
}

function reducer(state, action) {
  switch (action.type) {
    case 'start':
      return { ...initial, status: 'playing', best: state.best }

    case 'tick': {
      if (state.status !== 'playing') return state
      const timeLeft = state.timeLeft - TICK_MS
      if (timeLeft <= 0) {
        const newRecord = state.score > state.best
        return {
          ...state,
          timeLeft: 0,
          status: 'over',
          cells: empty(),
          newRecord,
          best: newRecord ? state.score : state.best,
        }
      }

      const elapsed = ROUND_MS - timeLeft
      let escaped = state.escaped
      let combo = state.combo

      // vaxtı bitən xanaları təmizlə; qaçan baq kombonu sıfırlayır
      let cells = state.cells.map((c) => {
        if (!c) return c
        const ttl = c.ttl - TICK_MS
        if (ttl > 0) return { ...c, ttl }
        if (c.type === 'bug') {
          escaped += 1
          combo = 0
        }
        return null
      })

      const [r1, r2, r3, r4] = action.rand
      const bugs = cells.filter((c) => c?.type === 'bug').length
      const features = cells.filter((c) => c?.type === 'feature').length
      const maxBugs = 1 + Math.floor(elapsed / 8000) // 1 → 4
      const bugTtl = Math.max(650, 1400 - elapsed / 40) // 1.4s → 0.65s

      if (bugs < maxBugs && r1 < 0.35) cells = spawn(cells, 'bug', bugTtl, r2)
      if (features < 2 && elapsed > 3000 && r3 < 0.04) cells = spawn(cells, 'feature', 1800, r4)

      return { ...state, timeLeft, cells, escaped, combo }
    }

    case 'hit': {
      if (state.status !== 'playing') return state
      const cell = state.cells[action.index]
      if (!cell || cell.type === 'squashed' || cell.type === 'oops') return state
      const cells = state.cells.slice()
      if (cell.type === 'bug') {
        const combo = state.combo + 1
        cells[action.index] = { type: 'squashed', ttl: 300 }
        return { ...state, cells, combo, hits: state.hits + 1, score: state.score + (combo >= 5 ? 2 : 1) }
      }
      cells[action.index] = { type: 'oops', ttl: 400 }
      return { ...state, cells, combo: 0, score: Math.max(0, state.score - FEATURE_PENALTY) }
    }

    default:
      return state
  }
}

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0
  } catch {
    return 0
  }
}

export default function BugHunt() {
  const { tr } = useLang()
  const g = tr.game
  const [state, dispatch] = useReducer(reducer, initial, (s) => ({ ...s, best: readBest() }))
  const { status, score, combo, timeLeft, cells, hits, escaped, best, newRecord } = state

  // oyun dövrü
  useEffect(() => {
    if (status !== 'playing') return
    const id = setInterval(
      () => dispatch({ type: 'tick', rand: [Math.random(), Math.random(), Math.random(), Math.random()] }),
      TICK_MS,
    )
    return () => clearInterval(id)
  }, [status])

  // rekord dəyişəndə brauzerdə yadda saxla
  useEffect(() => {
    try {
      localStorage.setItem(BEST_KEY, String(best))
    } catch {
      /* ignore */
    }
  }, [best])

  const start = () => dispatch({ type: 'start' })

  const total = hits + escaped
  const accuracy = total ? Math.round((hits / total) * 100) : 0
  const seconds = Math.ceil(timeLeft / 1000)

  return (
    <div className="glow-card rounded-3xl border border-line bg-surface p-5 backdrop-blur-sm sm:p-8">
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
        {/* izah və nəticələr */}
        <div className="order-2 lg:order-1">
          <h3 className="text-2xl font-bold sm:text-3xl">
            <span className="font-mono text-primary-text">{'>'}</span> Bug Hunt
          </h3>
          <p className="mt-3 max-w-md leading-relaxed text-muted">{g.intro}</p>
          <ul className="mt-4 space-y-2 text-sm text-fg-soft">
            <li className="flex items-center gap-2">
              <BugIcon className="h-5 w-5 text-rose-400" /> {g.ruleBug}
            </li>
            <li className="flex items-center gap-2">
              <FeatureIcon className="h-5 w-5 text-primary-text" /> {g.ruleFeature}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 text-center font-mono text-accent">×2</span> {g.ruleCombo}
            </li>
          </ul>

          <div aria-live="polite" className="mt-6 min-h-[4.5rem]">
            {status === 'over' && (
              <div className="rounded-card border border-primary/30 bg-primary/10 p-4">
                <p className="font-semibold">
                  {newRecord ? `🏆 ${g.newRecord}` : g.gameOver} — {score} {g.points}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {g.caught}: {hits} · {g.escaped}: {escaped} · {g.accuracy}: {accuracy}%
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={start}
              disabled={status === 'playing'}
              className="rounded-btn bg-primary px-6 py-3 font-semibold text-on-primary transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'idle' ? g.start : g.again}
            </button>
            <span className="font-mono text-sm text-subtle">
              {g.best}: <span className="text-fg-soft">{best}</span>
            </span>
          </div>
        </div>

        {/* oyun sahəsi */}
        <div className="order-1 mx-auto w-full max-w-sm lg:order-2 lg:w-96">
          <div className="mb-3 flex items-center justify-between font-mono text-sm">
            <span>
              {g.score}: <span className="font-bold text-primary-text">{score}</span>
            </span>
            <span className={combo >= 5 ? 'text-accent' : 'text-subtle'}>combo ×{combo}</span>
            <span className={status === 'playing' && seconds <= 5 ? 'text-rose-400' : 'text-fg-soft'}>{seconds}s</span>
          </div>
          <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-chip">
            <div
              className="h-full rounded-full bg-linear-to-r from-primary to-accent transition-[width] duration-100 ease-linear"
              style={{ width: `${(timeLeft / ROUND_MS) * 100}%` }}
            />
          </div>

          <div className="relative">
            <div role="group" aria-label={g.board} className="grid grid-cols-4 gap-2 sm:gap-3">
              {cells.map((c, i) => (
                <Cell key={i} cell={c} index={i} label={g} onHit={() => dispatch({ type: 'hit', index: i })} disabled={status !== 'playing'} />
              ))}
            </div>
            {status !== 'playing' && (
              <button
                type="button"
                onClick={start}
                className="absolute inset-0 flex items-center justify-center rounded-card bg-bg/60 font-mono text-lg font-bold text-primary-text backdrop-blur-[2px] transition hover:bg-bg/50"
              >
                ▶ {status === 'idle' ? g.start : g.again}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Cell({ cell, index, label, onHit, disabled }) {
  const type = cell?.type
  const name = type === 'bug' ? label.cellBug : type === 'feature' ? label.cellFeature : label.cellEmpty

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={`${index + 1}: ${name}`}
      // toxunma/siçan üçün dərhal reaksiya; klaviatura (Enter/Space) üçün onClick
      onPointerDown={(e) => {
        if (e.button === 0) onHit()
      }}
      onClick={(e) => {
        if (e.detail === 0) onHit()
      }}
      className={`flex aspect-square touch-manipulation select-none items-center justify-center rounded-xl border transition-colors ${
        type === 'oops'
          ? 'border-rose-400/60 bg-rose-500/15'
          : type === 'squashed'
            ? 'border-primary/50 bg-primary/10'
            : 'border-line bg-chip hover:border-line-strong'
      }`}
    >
      {type === 'bug' && <BugIcon className="bug-pop h-3/5 w-3/5 text-rose-400" />}
      {type === 'feature' && <FeatureIcon className="bug-pop h-1/2 w-1/2 text-primary-text" />}
      {type === 'squashed' && <span className="bug-pop font-mono text-sm font-bold text-primary-text">+1</span>}
      {type === 'oops' && <span className="bug-pop font-mono text-sm font-bold text-rose-400">−{FEATURE_PENALTY}</span>}
    </button>
  )
}

const BugIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" {...p}>
    <path d="M9 7.5a3 3 0 0 1 6 0" />
    <path d="M8 4.5 9.5 6.5M16 4.5l-1.5 2" />
    <rect x="7" y="8" width="10" height="12" rx="5" fill="currentColor" fillOpacity="0.18" />
    <path d="M12 9v10M3.5 11H7M17 11h3.5M3.5 16H7M17 16h3.5M5 20.5l2.5-2M19 20.5l-2.5-2" />
  </svg>
)

const FeatureIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" fill="currentColor" fillOpacity="0.15" />
    <path d="m8 12.5 2.5 2.5L16 9.5" />
  </svg>
)
