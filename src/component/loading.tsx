import { useEffect, useRef, useState } from "react"

export type TuningStatus = "searching" | "connecting" | "connected"

type LoadingProps = {
  status?: TuningStatus
}

const SCALE_START = 87
const SCALE_END = 108
const MIN_FREQ = 87.5
const MAX_FREQ = 107.9
const SCALE_LABELS = [ 87, 90, 93, 96, 99, 102, 105, 108 ]
const SCALE_TICKS = Array.from({ length: SCALE_END - SCALE_START + 1 }, (_, i) => SCALE_START + i)
const SIGNAL_BARS = [ 0.3, 0.55, 0.8, 1 ]
const SIGNAL_COLORS = [ "#FF3E9D", "#FFD84D", "#4DD8FF", "#B8FF3C" ]

const FREQ_STEP_MS = 200
const OVERSHOOT_MS = 130
const OVERSHOOT_PCT = 1.2

const STATUS_TEXT: Record<TuningStatus, string> = {
  searching: "Tuning in",
  connecting: "Connecting",
  connected: "Now playing",
}

const toPercent = (freq: number) => ((freq - SCALE_START) / (SCALE_END - SCALE_START)) * 100
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
const randomBetween = (min: number, max: number) => min + Math.random() * (max - min)
const roundFreq = (freq: number) => Math.round(freq * 10) / 10

const pickTarget = (from: number) => {
  let target = from
  while (Math.abs(target - from) < 3) target = roundFreq(randomBetween(MIN_FREQ, MAX_FREQ))
  return target
}

export default function LoadingComponent({ status = "searching" }: LoadingProps) {
  const [ freq, setFreq ] = useState(MIN_FREQ)
  const [ locked, setLocked ] = useState(false)
  const needleRef = useRef<HTMLDivElement>(null)
  const scaleRef = useRef<HTMLDivElement>(null)
  const currentRef = useRef(MIN_FREQ)
  const targetRef = useRef(MIN_FREQ)

  // Needle sweep: move to a random station, overshoot slightly, settle, pause, repeat
  useEffect(() => {
    if (status === "connected") return

    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    let ticker: ReturnType<typeof setInterval> | undefined
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const tune = () => {
      if (cancelled) return
      const from = currentRef.current
      const target = pickTarget(from)
      targetRef.current = target
      setLocked(false)

      const fromPct = toPercent(from)
      const targetPct = toPercent(target)
      const sweepMs = reduceMotion ? 0 : 1200 + 600 * (Math.abs(target - from) / (MAX_FREQ - MIN_FREQ))
      const durationMs = sweepMs + (reduceMotion ? 0 : OVERSHOOT_MS)

      if (needleRef.current) {
        needleRef.current.getAnimations().forEach(a => a.cancel())
        needleRef.current.style.left = `${targetPct}%`
        if (!reduceMotion) {
          needleRef.current.animate([
            { left: `${fromPct}%`, easing: "cubic-bezier(0.45, 0, 0.25, 1)" },
            { left: `${targetPct + Math.sign(target - from) * OVERSHOOT_PCT}%`, offset: sweepMs / durationMs, easing: "ease-out" },
            { left: `${targetPct}%` },
          ], { duration: durationMs })
        }
      }

      // Subtle scale drift opposite to the needle, like a dial drum turning
      scaleRef.current?.animate(
        [ { transform: `translateX(${(50 - fromPct) * 0.06}px)` }, { transform: `translateX(${(50 - targetPct) * 0.06}px)` } ],
        { duration: durationMs, easing: "ease-in-out", fill: "forwards" },
      )

      const startedAt = performance.now()
      ticker = setInterval(() => {
        const t = Math.min(1, (performance.now() - startedAt) / Math.max(sweepMs, 1))
        setFreq(roundFreq(from + (target - from) * easeInOut(t)))
      }, FREQ_STEP_MS)

      timer = setTimeout(() => {
        clearInterval(ticker)
        currentRef.current = target
        setFreq(target)
        setLocked(true)
        timer = setTimeout(tune, reduceMotion ? 1200 : randomBetween(100, 250))
      }, durationMs)
    }

    tune()
    return () => {
      cancelled = true
      clearTimeout(timer)
      clearInterval(ticker)
    }
  }, [ status ])

  useEffect(() => {
    if (status === "connected") setFreq(targetRef.current)
  }, [ status ])

  const signalState = status === "connected" ? "connected" : status === "connecting" || locked ? "strong" : "weak"

  return <div
    role="status"
    aria-live="polite"
    className="fixed inset-0 z-40 w-screen h-dvh flex flex-col items-center justify-center bg-[#FF3E9D] px-4 overflow-hidden"
  >
    <div className="w-[88vw] max-w-md md:max-w-lg flex flex-col items-center gap-5 md:gap-7 bg-[#FFD84D] border-4 border-[#111111] rounded-xl shadow-[10px_10px_0_#111111] px-5 py-6 sm:px-8 md:px-10 md:py-9">

      {/* Frequency display */}
      <div className="w-full flex items-center justify-between gap-3 bg-[#111111] border-4 border-[#111111] rounded-lg shadow-[5px_5px_0_#4DD8FF] px-4 py-2 md:px-5 md:py-3">
        <p className="font-space-mono font-bold text-[#B8FF3C] tabular-nums leading-none text-[40px] sm:text-5xl md:text-6xl">
          {freq.toFixed(1)}<span className="text-base sm:text-lg md:text-xl ml-2 text-[#FF3E9D]">FM</span>
        </p>
        <div className="flex items-end gap-1 h-7 md:h-8" aria-hidden="true">
          {SIGNAL_BARS.map((peak, i) => (
            <span
              key={i}
              className="signal-bar"
              data-state={signalState}
              style={{ height: `${peak * 100}%`, background: SIGNAL_COLORS[i], animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* Frequency scale + tuning needle */}
      <div className="relative w-full bg-white border-4 border-[#111111] rounded-lg shadow-[5px_5px_0_#111111] px-2 pt-2 pb-8" aria-hidden="true">
        <div ref={scaleRef} className="relative h-10 mx-2">
          {SCALE_LABELS.map(label => (
            <span
              key={label}
              className="absolute top-0 -translate-x-1/2 font-space-mono font-bold text-[10px] sm:text-xs text-[#111111]"
              style={{ left: `${toPercent(label)}%` }}
            >
              {label}
            </span>
          ))}
          {SCALE_TICKS.map(tick => (
            <span
              key={tick}
              className={`absolute bottom-0 -translate-x-1/2 w-0.5 bg-[#111111] ${SCALE_LABELS.includes(tick) ? "h-4" : "h-2"}`}
              style={{ left: `${toPercent(tick)}%` }}
            />
          ))}
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-[#111111]" />
        </div>
        <div className="absolute inset-x-4 top-1 bottom-1">
          <div ref={needleRef} className="absolute top-0 bottom-0 -translate-x-1/2 flex flex-col items-center" style={{ left: `${toPercent(MIN_FREQ)}%` }}>
            <span className="w-1.5 flex-1 bg-[#FF3E9D] border-x-2 border-[#111111]" />
            <span className="size-5 rounded-full bg-[#FF3E9D] border-[3px] border-[#111111] shadow-[2px_2px_0_#111111]" />
          </div>
        </div>
      </div>

      <p className="font-archivo-black text-[#111111] text-lg sm:text-xl md:text-2xl uppercase tracking-wider bg-[#B8FF3C] border-4 border-[#111111] rounded-md shadow-[4px_4px_0_#111111] px-4 py-1 -rotate-2">
        {STATUS_TEXT[status]}
        {status !== "connected" && <>
          <span className="tuning-dot">.</span><span className="tuning-dot">.</span><span className="tuning-dot">.</span>
        </>}
      </p>
    </div>

    <span className="sr-only">{status === "connected" ? "Connected" : "Loading radio stations"}</span>
  </div>
}
