import { useState, useEffect, useRef, useCallback } from 'react'
import * as Tone from 'tone'
import Layout from '../components/Layout'
import { useLocation } from 'react-router-dom'

const BPM_MIN = 40
const BPM_MAX = 220

const COMPASSOS = [
  { label: '2/4', beats: 2 },
  { label: '3/4', beats: 3 },
  { label: '4/4', beats: 4 },
]

const BPM_PRESETS = [
  { label: 'Largo',    bpm: 50  },
  { label: 'Adagio',   bpm: 72  },
  { label: 'Andante',  bpm: 90  },
  { label: 'Moderato', bpm: 108 },
  { label: 'Allegro',  bpm: 132 },
  { label: 'Presto',   bpm: 168 },
]

export default function Metronomo() {
  const { pathname } = useLocation()
  const instrumento = pathname.startsWith('/teclado') ? 'teclado' : 'violao'

  const [bpm, setBpm] = useState(100)
  const [tocando, setTocando] = useState(false)
  const [compassoIdx, setCompassoIdx] = useState(2)
  const [beatAtual, setBeatAtual] = useState(-1)

  const seqRef      = useRef(null)
  const accentRef   = useRef(null)
  const tickRef     = useRef(null)
  // True only after the user has clicked Play and Tone.start() has resolved.
  // Guards every Tone call so nothing touches AudioContext before user interaction.
  const audioReady  = useRef(false)

  const stopMetronome = useCallback(() => {
    if (!audioReady.current) return
    seqRef.current?.stop()
    seqRef.current?.dispose()
    seqRef.current = null
    Tone.getTransport().stop()
    setBeatAtual(-1)
  }, [])

  const startMetronome = useCallback(async () => {
    // Tone.start() must be the very first Tone call — resumes the AudioContext
    // after the browser's autoplay policy blocks it until a user gesture.
    await Tone.start()
    audioReady.current = true

    if (!accentRef.current) {
      accentRef.current = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 },
        volume: -6,
      }).toDestination()
    }
    if (!tickRef.current) {
      tickRef.current = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.04 },
        volume: -12,
      }).toDestination()
    }

    const beats = COMPASSOS[compassoIdx].beats
    Tone.getTransport().bpm.value = bpm

    seqRef.current = new Tone.Sequence(
      (time, beat) => {
        if (beat === 0) {
          accentRef.current?.triggerAttackRelease('C5', '16n', time)
        } else {
          tickRef.current?.triggerAttackRelease('G4', '16n', time)
        }
        Tone.getDraw().schedule(() => {
          setBeatAtual(beat)
        }, time)
      },
      Array.from({ length: beats }, (_, i) => i),
      '4n'
    )

    seqRef.current.start(0)
    Tone.getTransport().start()
  }, [bpm, compassoIdx])

  const togglePlay = useCallback(async () => {
    if (tocando) {
      stopMetronome()
      setTocando(false)
    } else {
      await startMetronome()
      setTocando(true)
    }
  }, [tocando, startMetronome, stopMetronome])

  // Sync BPM to transport while playing
  useEffect(() => {
    if (tocando && audioReady.current) {
      Tone.getTransport().bpm.value = bpm
    }
  }, [bpm, tocando])

  // Restart when compasso changes while playing
  useEffect(() => {
    if (tocando) {
      stopMetronome()
      setTocando(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compassoIdx])

  // Cleanup on unmount — only touches Tone if it was ever started
  useEffect(() => () => {
    stopMetronome()
    accentRef.current?.dispose()
    tickRef.current?.dispose()
    accentRef.current = null
    tickRef.current = null
  }, [stopMetronome])

  function clampBpm(v) {
    return Math.min(BPM_MAX, Math.max(BPM_MIN, v))
  }

  const beats = COMPASSOS[compassoIdx].beats

  return (
    <Layout instrumento={instrumento}>
      <div className="flex flex-col items-center gap-6 py-6">

        <h1 className="text-2xl font-bold text-mint-dark">Metrônomo</h1>

        {/* Beat indicator dots */}
        <div className="flex gap-3">
          {Array.from({ length: beats }, (_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-75"
              style={{
                width: i === 0 ? 22 : 18,
                height: i === 0 ? 22 : 18,
                background:
                  beatAtual === i
                    ? i === 0 ? '#2D6E52' : '#4CAF80'
                    : '#d1d5db',
                boxShadow:
                  beatAtual === i
                    ? `0 0 12px ${i === 0 ? '#2D6E52' : '#4CAF80'}`
                    : 'none',
              }}
            />
          ))}
        </div>

        {/* BPM display */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setBpm((v) => clampBpm(v - 1))}
            onContextMenu={(e) => { e.preventDefault(); setBpm((v) => clampBpm(v - 5)) }}
            className="w-12 h-12 rounded-full bg-mint-light text-mint-dark text-2xl font-bold flex items-center justify-center active:scale-95 transition-transform select-none"
            aria-label="Diminuir BPM"
          >
            −
          </button>

          <div className="flex flex-col items-center w-28">
            <span className="text-7xl font-bold text-mint-dark leading-none tabular-nums">
              {bpm}
            </span>
            <span className="text-xs text-text-light mt-1 uppercase tracking-widest">BPM</span>
          </div>

          <button
            onClick={() => setBpm((v) => clampBpm(v + 1))}
            onContextMenu={(e) => { e.preventDefault(); setBpm((v) => clampBpm(v + 5)) }}
            className="w-12 h-12 rounded-full bg-mint-light text-mint-dark text-2xl font-bold flex items-center justify-center active:scale-95 transition-transform select-none"
            aria-label="Aumentar BPM"
          >
            +
          </button>
        </div>

        {/* Slider */}
        <input
          type="range"
          min={BPM_MIN}
          max={BPM_MAX}
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="w-full max-w-xs accent-mint"
          aria-label="BPM slider"
        />

        {/* Play / Stop */}
        <button
          onClick={togglePlay}
          className="w-24 h-24 rounded-full bg-mint shadow-lg flex items-center justify-center active:scale-95 transition-all duration-150"
          style={{ boxShadow: tocando ? '0 0 24px #4CAF80' : undefined }}
          aria-label={tocando ? 'Parar metrônomo' : 'Iniciar metrônomo'}
        >
          {tocando ? (
            <svg viewBox="0 0 24 24" width="36" height="36" fill="white">
              <rect x="5" y="5" width="5" height="14" rx="1" />
              <rect x="14" y="5" width="5" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="36" height="36" fill="white">
              <polygon points="6,4 20,12 6,20" />
            </svg>
          )}
        </button>

        {/* Time signature selector */}
        <div className="flex gap-2">
          {COMPASSOS.map((c, i) => (
            <button
              key={c.label}
              onClick={() => setCompassoIdx(i)}
              className={`px-5 py-2 rounded-full font-semibold text-sm border-2 transition-colors ${
                compassoIdx === i
                  ? 'bg-mint text-white border-mint'
                  : 'bg-white text-mint-dark border-mint-light hover:border-mint'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* BPM presets */}
        <div className="w-full max-w-xs">
          <p className="text-xs text-text-light text-center uppercase tracking-widest mb-2">
            Andamentos
          </p>
          <div className="grid grid-cols-3 gap-2">
            {BPM_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setBpm(p.bpm)}
                className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  bpm === p.bpm
                    ? 'bg-mint text-white border-mint'
                    : 'bg-white text-mint-dark border-mint-light hover:border-mint'
                }`}
              >
                <span className="block">{p.label}</span>
                <span className="block text-[10px] opacity-70">{p.bpm}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-text-light text-center max-w-xs">
          Clique direito nos botões +/− para pular 5 BPM
        </p>
      </div>
    </Layout>
  )
}
