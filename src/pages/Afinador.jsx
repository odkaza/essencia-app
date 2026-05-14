import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import Layout from '../components/Layout'

// ── Music theory ──────────────────────────────────────────────────────────────
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const A4_FREQ = 440
const A4_MIDI = 69

function freqToNote(freq) {
  const midi  = 12 * Math.log2(freq / A4_FREQ) + A4_MIDI
  const midiR = Math.round(midi)
  return {
    name:   NOTE_NAMES[((midiR % 12) + 12) % 12],
    octave: Math.floor((midiR - 12) / 12),
    cents:  (midi - midiR) * 100,
    midi:   midiR,
  }
}

// ── Guitar strings — standard tuning ─────────────────────────────────────────
const CORDAS = [
  { corda: 6, nome: 'E2', freq: 82.41,  label: '6ª (Mi grave)' },
  { corda: 5, nome: 'A2', freq: 110.00, label: '5ª (Lá)'       },
  { corda: 4, nome: 'D3', freq: 146.83, label: '4ª (Ré)'       },
  { corda: 3, nome: 'G3', freq: 196.00, label: '3ª (Sol)'      },
  { corda: 2, nome: 'B3', freq: 246.94, label: '2ª (Si)'       },
  { corda: 1, nome: 'E4', freq: 329.63, label: '1ª (Mi agudo)' },
]

// ── Pitch detection: autocorrelation + Hann window ───────────────────────────
function detectPitch(buffer, sampleRate) {
  const N = buffer.length

  // RMS gate — reject silence
  let sumSq = 0
  for (let i = 0; i < N; i++) sumSq += buffer[i] * buffer[i]
  if (Math.sqrt(sumSq / N) < 0.015) return null

  // Hann window reduces spectral leakage
  const win = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    win[i] = buffer[i] * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (N - 1)))
  }

  const half   = N >> 1
  const tauMin = Math.floor(sampleRate / 400)                  // ~110 @ 44100 Hz
  const tauMax = Math.min(Math.floor(sampleRate / 70), half - 2) // ~630 @ 44100 Hz

  // Zero-lag energy (denominator for normalization)
  let e0 = 0
  for (let i = 0; i < half; i++) e0 += win[i] * win[i]
  if (e0 === 0) return null

  // Autocorrelation from (tauMin-1) to (tauMax+1) for parabolic interpolation
  const lo = Math.max(1, tauMin - 1)
  const hi = tauMax + 1
  const ac = new Float32Array(hi + 1)
  for (let tau = lo; tau <= hi; tau++) {
    let c = 0
    for (let i = 0; i < half; i++) c += win[i] * win[i + tau]
    ac[tau] = c
  }

  // Find best tau in [tauMin, tauMax]
  let bestTau = tauMin, bestVal = ac[tauMin]
  for (let tau = tauMin + 1; tau <= tauMax; tau++) {
    if (ac[tau] > bestVal) { bestVal = ac[tau]; bestTau = tau }
  }

  // Reject weak correlations (likely noise)
  if (bestVal / e0 < 0.1) return null

  // Parabolic interpolation for sub-sample accuracy
  const y1 = bestTau > lo ? ac[bestTau - 1] : bestVal
  const y3 = bestTau < hi ? ac[bestTau + 1] : bestVal
  const d  = 2 * (2 * bestVal - y1 - y3)
  const t  = d === 0 ? bestTau : bestTau - (y3 - y1) / d

  const freq = sampleRate / t
  return freq >= 70 && freq <= 400 ? freq : null
}

// ── Needle gauge ──────────────────────────────────────────────────────────────
const NW = 280, NH = 140, CX = 140, CY = 160, R = 155

function arcPath(cx, cy, r, a1, a2) {
  const rad = (d) => (d - 90) * Math.PI / 180
  return (
    `M ${cx + r * Math.cos(rad(a1))} ${cy + r * Math.sin(rad(a1))} ` +
    `A ${r} ${r} 0 0 1 ${cx + r * Math.cos(rad(a2))} ${cy + r * Math.sin(rad(a2))}`
  )
}

function NeedleGauge({ cents, color }) {
  const angle = Math.max(-75, Math.min(75, (cents / 50) * 75))

  return (
    <svg viewBox={`0 0 ${NW} ${NH}`} width="100%" style={{ maxWidth: 280, overflow: 'visible' }}>
      {/* Track arc */}
      <path d={arcPath(CX, CY, R - 20, -75, 75)}
        fill="none" stroke="#e5e7eb" strokeWidth={22} strokeLinecap="round" />
      {/* Green zone: ±10 cents ≈ ±15° */}
      <path d={arcPath(CX, CY, R - 20, -15, 15)}
        fill="none" stroke="#bbf7d0" strokeWidth={22} strokeLinecap="round" />
      {/* Tick marks */}
      {[-75, -50, -25, 0, 25, 50, 75].map((deg) => {
        const r = (deg - 90) * Math.PI / 180
        return (
          <line key={deg}
            x1={CX + (R - 32) * Math.cos(r)} y1={CY + (R - 32) * Math.sin(r)}
            x2={CX + (R -  8) * Math.cos(r)} y2={CY + (R -  8) * Math.sin(r)}
            stroke={deg === 0 ? '#4CAF80' : '#d1d5db'}
            strokeWidth={deg === 0 ? 2.5 : 1.5}
          />
        )
      })}
      {/* ♭ / ♯ labels */}
      <text x={14}      y={NH - 4} fontSize={10} fill="#9ca3af" textAnchor="middle">♭</text>
      <text x={NW - 14} y={NH - 4} fontSize={10} fill="#9ca3af" textAnchor="middle">♯</text>
      {/* Needle — CSS transition for smooth movement */}
      <line
        x1={CX} y1={CY} x2={CX} y2={CY - R}
        stroke={color} strokeWidth={2.5} strokeLinecap="round"
        style={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: `${CX}px ${CY}px`,
          transition: 'transform 300ms ease',
        }}
      />
      <circle cx={CX} cy={CY} r={5} fill={color} />
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Afinador() {
  const { pathname } = useLocation()
  const instrumento = pathname.startsWith('/teclado') ? 'teclado' : 'violao'

  const [status,   setStatus]   = useState('idle')  // idle | listening | denied | error
  const [detected, setDetected] = useState(null)
  const [rawFreq,  setRawFreq]  = useState(null)

  const streamRef   = useRef(null)
  const ctxRef      = useRef(null)
  const sourceRef   = useRef(null)
  const analyserRef = useRef(null)
  const rafRef      = useRef(null)
  const pcmBuf      = useRef(null)
  const noteHist    = useRef([])  // { midi, freq }[] — last 8 valid detections
  const lastSignal  = useRef(0)   // ms: last valid pitch detection
  const lastUpdate  = useRef(0)   // ms: last React state update

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    sourceRef.current?.disconnect()
    streamRef.current?.getTracks().forEach((t) => t.stop())
    ctxRef.current?.close()
    ctxRef.current    = null
    streamRef.current = null
    noteHist.current  = []
    setStatus('idle')
    setDetected(null)
    setRawFreq(null)
  }, [])

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      })
      streamRef.current = stream

      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      ctxRef.current = ctx

      const analyser = ctx.createAnalyser()
      analyser.fftSize = 4096
      analyserRef.current = analyser
      pcmBuf.current = new Float32Array(4096)

      const source = ctx.createMediaStreamSource(stream)
      sourceRef.current = source
      source.connect(analyser)

      noteHist.current = []
      lastSignal.current = performance.now()
      lastUpdate.current = 0
      setStatus('listening')

      function loop() {
        analyser.getFloatTimeDomainData(pcmBuf.current)
        const freq = detectPitch(pcmBuf.current, ctx.sampleRate)
        const now  = performance.now()

        if (freq !== null) {
          lastSignal.current = now
          const { midi } = freqToNote(freq)
          noteHist.current.push({ midi, freq })
          if (noteHist.current.length > 8) noteHist.current.shift()
        } else if (now - lastSignal.current > 1500) {
          // 1.5 s of continuous silence — clear history
          noteHist.current = []
        }

        // Update display at most every 250 ms
        if (now - lastUpdate.current >= 250) {
          lastUpdate.current = now
          const hist = noteHist.current

          if (hist.length === 0) {
            setDetected(null)
            setRawFreq(null)
          } else {
            // Consensus: at least 5 of the last 8 readings must agree on the same note
            const votes = {}
            for (const { midi } of hist) votes[midi] = (votes[midi] ?? 0) + 1
            const bestMidi = Number(
              Object.keys(votes).reduce((a, b) => (votes[a] > votes[b] ? a : b))
            )
            if (votes[bestMidi] >= 5) {
              const agreeing = hist.filter((h) => h.midi === bestMidi)
              const avgFreq  = agreeing.reduce((s, h) => s + h.freq, 0) / agreeing.length
              setRawFreq(Math.round(avgFreq * 10) / 10)
              setDetected(freqToNote(avgFreq))
            }
            // No consensus — keep current display unchanged
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

  const cents     = detected?.cents ?? 0
  const inTune    = detected !== null && Math.abs(cents) <= 10
  const tuneColor = detected === null ? '#9ca3af' : inTune ? '#4CAF80' : '#ef4444'

  const closestCorda = rawFreq
    ? CORDAS.reduce((best, c) =>
        Math.abs(c.freq - rawFreq) < Math.abs(best.freq - rawFreq) ? c : best
      )
    : null

  return (
    <Layout instrumento={instrumento}>
      <div className="flex flex-col items-center gap-5 py-4">
        <h1 className="text-2xl font-bold text-mint-dark">Afinador</h1>

        {/* Instruction banner */}
        {status !== 'denied' && status !== 'error' && (
          <div className="flex items-center gap-2 bg-mint-light rounded-xl px-4 py-2.5 max-w-xs w-full">
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" className="text-mint-dark shrink-0">
              <path d="M10 2a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" fill="currentColor" />
              <path d="M5 9a5 5 0 0 0 10 0M10 16v3M7.5 19h5"
                stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
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
              <div className="text-7xl font-bold leading-none transition-colors duration-300"
                style={{ color: tuneColor }}>
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
                  Corda sugerida: {closestCorda.label}
                </div>
              )}
            </>
          ) : (
            <div className="text-5xl font-bold text-gray-300">—</div>
          )}
        </div>

        {/* Start / Stop button */}
        <button
          onClick={status === 'listening' ? stop : start}
          className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all duration-150"
          style={{
            background: status === 'listening' ? '#ef4444' : '#4CAF80',
            boxShadow:  status === 'listening' ? '0 0 20px #fca5a5' : '0 0 20px #86efac',
          }}
          aria-label={status === 'listening' ? 'Parar afinador' : 'Iniciar afinador'}
        >
          {status === 'listening' ? (
            <svg viewBox="0 0 24 24" width="30" height="30" fill="white">
              <rect x="5"  y="5" width="5" height="14" rx="1" />
              <rect x="14" y="5" width="5" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="30" height="30" fill="white">
              <path d="M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4Z" />
              <path d="M6 10a6 6 0 0 0 12 0M12 18v4M9 22h6"
                stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          )}
        </button>

        <p className="text-xs text-text-light -mt-2">
          {status === 'listening' ? 'Toque para parar e economizar bateria' : 'Toque para iniciar'}
        </p>

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

        {/* String reference table */}
        <div className="w-full max-w-xs">
          <p className="text-xs text-text-light text-center uppercase tracking-widest mb-3">
            Referência — Afinação Padrão
          </p>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {CORDAS.map((c, i) => {
              const isClosest = closestCorda?.corda === c.corda && status === 'listening' && rawFreq
              return (
                <div
                  key={c.corda}
                  className={`flex items-center px-4 py-3 ${
                    i < CORDAS.length - 1 ? 'border-b border-gray-100' : ''
                  } ${isClosest ? 'bg-mint-light' : ''}`}
                >
                  <span className="w-6 h-6 rounded-full bg-mint-light text-mint-dark text-xs font-bold flex items-center justify-center mr-3 shrink-0">
                    {c.corda}
                  </span>
                  <span className="flex-1 text-sm text-text font-medium">{c.label}</span>
                  <span className="text-xs text-text-light tabular-nums">{c.freq} Hz</span>
                  <span
                    className="ml-2 text-xs font-bold w-8 text-right"
                    style={{ color: isClosest ? tuneColor : '#9ca3af' }}
                  >
                    {c.nome}
                  </span>
                </div>
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
