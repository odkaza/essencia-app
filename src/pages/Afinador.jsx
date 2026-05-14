import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import Layout from '../components/Layout'

// ── Music theory constants ────────────────────────────────────────────────────
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const A4_FREQ = 440
const A4_MIDI = 69

function freqToMidi(freq) {
  return 12 * Math.log2(freq / A4_FREQ) + A4_MIDI
}

function midiToFreq(midi) {
  return A4_FREQ * Math.pow(2, (midi - A4_MIDI) / 12)
}

function freqToNote(freq) {
  if (!freq || freq < 20) return null
  const midi = freqToMidi(freq)
  const midiRound = Math.round(midi)
  const cents = (midi - midiRound) * 100
  const octave = Math.floor((midiRound - 12) / 12)
  const name = NOTE_NAMES[((midiRound % 12) + 12) % 12]
  const targetFreq = midiToFreq(midiRound)
  return { name, octave, cents, targetFreq, midi: midiRound }
}

// ── Guitar string reference (standard tuning) ────────────────────────────────
const CORDAS = [
  { corda: 6, nome: 'E2', freq: 82.41,  label: '6ª (Mi grave)' },
  { corda: 5, nome: 'A2', freq: 110.00, label: '5ª (Lá)' },
  { corda: 4, nome: 'D3', freq: 146.83, label: '4ª (Ré)' },
  { corda: 3, nome: 'G3', freq: 196.00, label: '3ª (Sol)' },
  { corda: 2, nome: 'B3', freq: 246.94, label: '2ª (Si)' },
  { corda: 1, nome: 'E4', freq: 329.63, label: '1ª (Mi agudo)' },
]

// ── YIN pitch detector ────────────────────────────────────────────────────────
// Simplified YIN algorithm — more accurate than plain autocorrelation for
// guitar strings because it normalises the difference function, avoiding
// strong-harmonic false positives on low strings.
function detectPitch(buffer, sampleRate) {
  const N = buffer.length
  const half = Math.floor(N / 2)

  // RMS gate — reject ambient silence
  let rms = 0
  for (let i = 0; i < N; i++) rms += buffer[i] * buffer[i]
  rms = Math.sqrt(rms / N)
  if (rms < 0.02) return null

  // Step 1: difference function  d(τ) = Σ (x[i] − x[i+τ])²
  const diff = new Float32Array(half)
  diff[0] = 0
  for (let tau = 1; tau < half; tau++) {
    let sum = 0
    for (let i = 0; i < half; i++) {
      const delta = buffer[i] - buffer[i + tau]
      sum += delta * delta
    }
    diff[tau] = sum
  }

  // Step 2: cumulative mean normalised difference function (CMNDF)
  const cmndf = new Float32Array(half)
  cmndf[0] = 1
  let runSum = 0
  for (let tau = 1; tau < half; tau++) {
    runSum += diff[tau]
    cmndf[tau] = runSum === 0 ? 0 : diff[tau] / (runSum / tau)
  }

  // Step 3: find first tau where cmndf dips below threshold 0.15
  const THRESHOLD = 0.15
  let tau = -1
  // Start search from lag corresponding to ~1400 Hz minimum (avoid ultra-short periods)
  const tauMin = Math.floor(sampleRate / 1400)
  const tauMax = Math.floor(sampleRate / 70)   // ~70 Hz = lowest guitar string

  for (let t = tauMin; t < Math.min(tauMax, half - 1); t++) {
    if (cmndf[t] < THRESHOLD) {
      // Walk to local minimum
      while (t + 1 < half && cmndf[t + 1] < cmndf[t]) t++
      tau = t
      break
    }
  }

  // Fallback: absolute minimum in range if threshold never crossed
  if (tau === -1) {
    let minVal = Infinity
    for (let t = tauMin; t < Math.min(tauMax, half); t++) {
      if (cmndf[t] < minVal) { minVal = cmndf[t]; tau = t }
    }
    // Reject weak detections (probably noise)
    if (minVal > 0.35) return null
  }

  if (tau <= 0) return null

  // Step 4: parabolic interpolation for sub-sample accuracy
  const y1 = cmndf[tau - 1] ?? cmndf[tau]
  const y2 = cmndf[tau]
  const y3 = cmndf[tau + 1] ?? cmndf[tau]
  const denom = 2 * (2 * y2 - y1 - y3)
  const refined = denom === 0 ? tau : tau - (y3 - y1) / denom

  const freq = sampleRate / refined
  return freq >= 70 && freq <= 1400 ? freq : null
}

// ── Needle SVG ────────────────────────────────────────────────────────────────
const NEEDLE_W = 280
const NEEDLE_H = 140
const CX = NEEDLE_W / 2
const CY = NEEDLE_H + 10
const RADIUS = 150

function NeedleGauge({ cents, color }) {
  const angle = (cents / 50) * (75 * Math.PI / 180)
  const rad = (-Math.PI / 2) + angle
  const tipX = CX + RADIUS * Math.cos(rad)
  const tipY = CY + RADIUS * Math.sin(rad)

  return (
    <svg viewBox={`0 0 ${NEEDLE_W} ${NEEDLE_H}`} width="100%" style={{ maxWidth: 280 }}>
      {/* Arc track */}
      <path
        d={arcPath(CX, CY, RADIUS - 18, -75, 75)}
        fill="none" stroke="#e5e7eb" strokeWidth="24" strokeLinecap="round"
      />
      {/* Green center zone (±5 cents) */}
      <path
        d={arcPath(CX, CY, RADIUS - 18, -7.5, 7.5)}
        fill="none" stroke="#bbf7d0" strokeWidth="24" strokeLinecap="round"
      />
      {/* Tick marks */}
      {[-75, -50, -25, 0, 25, 50, 75].map((deg) => {
        const r = deg * Math.PI / 180 - Math.PI / 2
        const inner = RADIUS - 30
        const outer = RADIUS - 6
        return (
          <line
            key={deg}
            x1={CX + inner * Math.cos(r)} y1={CY + inner * Math.sin(r)}
            x2={CX + outer * Math.cos(r)} y2={CY + outer * Math.sin(r)}
            stroke={deg === 0 ? '#4CAF80' : '#9ca3af'}
            strokeWidth={deg === 0 ? 2.5 : 1}
          />
        )
      })}
      {/* Labels */}
      <text x={12} y={NEEDLE_H - 4} fontSize={9} fill="#9ca3af" textAnchor="middle">♭</text>
      <text x={NEEDLE_W - 12} y={NEEDLE_H - 4} fontSize={9} fill="#9ca3af" textAnchor="middle">♯</text>
      {/* Needle */}
      <line x1={CX} y1={CY} x2={tipX} y2={tipY} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      {/* Pivot dot */}
      <circle cx={CX} cy={CY} r={5} fill={color} />
    </svg>
  )
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  const toRad = (d) => (d - 90) * Math.PI / 180
  const sx = cx + r * Math.cos(toRad(startDeg))
  const sy = cy + r * Math.sin(toRad(startDeg))
  const ex = cx + r * Math.cos(toRad(endDeg))
  const ey = cy + r * Math.sin(toRad(endDeg))
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Afinador() {
  const { pathname } = useLocation()
  const instrumento = pathname.startsWith('/teclado') ? 'teclado' : 'violao'

  const [status, setStatus]     = useState('idle')   // idle | listening | denied | error
  const [detected, setDetected] = useState(null)
  const [rawFreq, setRawFreq]   = useState(null)
  const [cordaSel, setCordaSel] = useState(null)

  const audioCtxRef   = useRef(null)
  const analyserRef   = useRef(null)
  const sourceRef     = useRef(null)
  const streamRef     = useRef(null)
  const rafRef        = useRef(null)
  const bufferRef     = useRef(null)
  const freqHistRef   = useRef([])   // moving-average buffer — last 12 valid readings
  const lastUpdateRef = useRef(0)    // timestamp of last React state update

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    sourceRef.current?.disconnect()
    streamRef.current?.getTracks().forEach((t) => t.stop())
    audioCtxRef.current?.close()
    audioCtxRef.current = null
    streamRef.current = null
    freqHistRef.current = []
    setStatus('idle')
    setDetected(null)
    setRawFreq(null)
  }, [])

  const start = useCallback(async () => {
    try {
      // Disable all mobile DSP processing that interferes with pitch detection
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
        video: false,
      })
      streamRef.current = stream

      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      audioCtxRef.current = ctx

      const analyser = ctx.createAnalyser()
      analyser.fftSize = 4096   // larger window = finer frequency resolution
      analyserRef.current = analyser
      bufferRef.current = new Float32Array(analyser.fftSize)

      const source = ctx.createMediaStreamSource(stream)
      sourceRef.current = source
      source.connect(analyser)

      freqHistRef.current = []
      lastUpdateRef.current = 0
      setStatus('listening')

      function loop() {
        analyser.getFloatTimeDomainData(bufferRef.current)
        const freq = detectPitch(bufferRef.current, ctx.sampleRate)

        if (freq) {
          const hist = freqHistRef.current
          hist.push(freq)
          if (hist.length > 12) hist.shift()

          const now = performance.now()
          if (now - lastUpdateRef.current >= 200) {
            lastUpdateRef.current = now
            const avg = hist.reduce((s, v) => s + v, 0) / hist.length
            setRawFreq(Math.round(avg * 10) / 10)
            setDetected(freqToNote(avg))
          }
        } else {
          freqHistRef.current = []
          const now = performance.now()
          if (now - lastUpdateRef.current >= 200) {
            lastUpdateRef.current = now
            setDetected(null)
            setRawFreq(null)
          }
        }

        rafRef.current = requestAnimationFrame(loop)
      }
      loop()
    } catch (err) {
      setStatus(err.name === 'NotAllowedError' ? 'denied' : 'error')
    }
  }, [])

  useEffect(() => () => stop(), [stop])

  const cents = detected?.cents ?? 0
  const inTune = detected && Math.abs(cents) <= 5
  const tuneColor = !detected ? '#9ca3af' : inTune ? '#4CAF80' : '#ef4444'

  const closestCorda = rawFreq
    ? CORDAS.reduce((best, c) =>
        Math.abs(c.freq - rawFreq) < Math.abs(best.freq - rawFreq) ? c : best
      )
    : null

  return (
    <Layout instrumento={instrumento}>
      <div className="flex flex-col items-center gap-5 py-4">
        <h1 className="text-2xl font-bold text-mint-dark">Afinador</h1>

        {/* Instruction banner — shown while idle or listening */}
        {status !== 'denied' && status !== 'error' && (
          <div className="flex items-center gap-2 bg-mint-light rounded-xl px-4 py-2.5 max-w-xs w-full">
            {/* Microphone icon */}
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" className="text-mint-dark shrink-0">
              <path d="M10 2a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" fill="currentColor" />
              <path d="M5 9a5 5 0 0 0 10 0M10 16v3M7.5 19h5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
            <p className="text-xs text-mint-dark font-medium leading-snug">
              Toque a corda perto do microfone do celular
            </p>
          </div>
        )}

        {/* Needle gauge */}
        <div className="w-full flex justify-center">
          <NeedleGauge cents={status === 'listening' ? cents : 0} color={tuneColor} />
        </div>

        {/* Note display */}
        <div className="flex flex-col items-center gap-1 min-h-[90px] justify-center">
          {detected ? (
            <>
              <div
                className="text-7xl font-bold leading-none transition-colors duration-200"
                style={{ color: tuneColor }}
              >
                {detected.name}
                <sub className="text-3xl font-semibold" style={{ color: tuneColor }}>
                  {detected.octave}
                </sub>
              </div>
              <div className="text-sm font-medium tabular-nums" style={{ color: tuneColor }}>
                {rawFreq} Hz
              </div>
              <div className="text-xs text-text-light mt-0.5">
                {inTune
                  ? '✓ Afinado'
                  : cents > 0
                  ? `+${Math.round(cents)}¢ agudo`
                  : `${Math.round(cents)}¢ grave`}
              </div>
              {closestCorda && (
                <div className="text-xs text-text-light">
                  Corda: {closestCorda.label} ({closestCorda.freq} Hz)
                </div>
              )}
            </>
          ) : (
            <div className="text-5xl font-bold text-gray-300">—</div>
          )}
        </div>

        {/* Play / Stop button */}
        <button
          onClick={status === 'listening' ? stop : start}
          className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all duration-150"
          style={{
            background: status === 'listening' ? '#ef4444' : '#4CAF80',
            boxShadow: status === 'listening' ? '0 0 20px #fca5a5' : '0 0 20px #86efac',
          }}
          aria-label={status === 'listening' ? 'Parar afinador' : 'Iniciar afinador'}
        >
          {status === 'listening' ? (
            <svg viewBox="0 0 24 24" width="30" height="30" fill="white">
              <rect x="5" y="5" width="5" height="14" rx="1" />
              <rect x="14" y="5" width="5" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="30" height="30" fill="white">
              <path d="M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4Z" />
              <path d="M6 10a6 6 0 0 0 12 0M12 18v4M9 22h6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          )}
        </button>

        {/* Status label under the button */}
        <p className="text-xs text-text-light -mt-2">
          {status === 'listening' ? 'Toque para parar e economizar bateria' : 'Toque para iniciar'}
        </p>

        {/* Error states */}
        {status === 'denied' && (
          <p className="text-sm text-red-500 text-center max-w-xs">
            Permissão de microfone negada. Verifique as configurações do navegador.
          </p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-500 text-center max-w-xs">
            Não foi possível acessar o microfone.
          </p>
        )}

        {/* Guitar string reference table */}
        <div className="w-full max-w-xs">
          <p className="text-xs text-text-light text-center uppercase tracking-widest mb-3">
            Referência — Afinação Padrão
          </p>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {CORDAS.map((c, i) => {
              const isClosest = closestCorda?.corda === c.corda && status === 'listening' && rawFreq
              const isSel = cordaSel === c.corda
              return (
                <button
                  key={c.corda}
                  onClick={() => setCordaSel(isSel ? null : c.corda)}
                  className={`flex items-center w-full px-4 py-3 transition-colors ${
                    i < CORDAS.length - 1 ? 'border-b border-gray-100' : ''
                  } ${isClosest ? 'bg-mint-light' : isSel ? 'bg-mint-light/50' : 'hover:bg-gray-50'}`}
                >
                  <span className="w-6 h-6 rounded-full bg-mint-light text-mint-dark text-xs font-bold flex items-center justify-center mr-3 shrink-0">
                    {c.corda}
                  </span>
                  <span className="flex-1 text-left text-sm text-text font-medium">
                    {c.label}
                  </span>
                  <span className="text-xs text-text-light tabular-nums">
                    {c.freq} Hz
                  </span>
                  <span
                    className="ml-2 text-xs font-bold w-8 text-right"
                    style={{ color: isClosest ? tuneColor : '#9ca3af' }}
                  >
                    {c.nome}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <p className="text-[10px] text-text-light text-center max-w-xs pb-2">
          Melhor resultado em ambiente silencioso com o volume do instrumento alto.
        </p>
      </div>
    </Layout>
  )
}
