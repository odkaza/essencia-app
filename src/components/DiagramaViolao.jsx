// Chord diagram for guitar.
// Data format:
//   cordas: [null, 3, 2, 0, 1, 0]  — index 0 = string 6 (low E), null = muted, 0 = open, n = fret
//   dedos:  [null, 3, 2, 0, 1, 0]  — finger number for each string (0 = no label)
//   pestana: null | { casa, dedo, de?, ate? }  — barre fret, finger, string range (default all)

const SS = 16   // horizontal spacing between strings
const FS = 19   // vertical spacing between frets
const DOT_R = 6.5  // finger dot radius
const NUT_H = 5    // nut bar height
const PAD_L = 20
const PAD_R = 20
const PAD_TOP = 50  // space for chord name + indicators
const PAD_BOT = 10

const GRID_W = 5 * SS   // 80
const GRID_H = 5 * FS   // 95
const SVG_W = GRID_W + PAD_L + PAD_R   // 120
const SVG_H = GRID_H + PAD_TOP + PAD_BOT  // 155

const SIZES = {
  sm: [SVG_W * 0.864, SVG_H * 0.864],
  md: [SVG_W, SVG_H],
  lg: [SVG_W * 1.4, SVG_H * 1.4],
}

export default function DiagramaViolao({ acorde, tamanho = 'md' }) {
  if (!acorde) return null

  const { nome, descricao, cordas = [], dedos = [], pestana = null } = acorde

  // ── Determine the starting fret of the grid ──────────────────────────────
  const fretsUsados = cordas.filter((c) => c && c > 0)
  let startFret = 1
  if (pestana) {
    startFret = pestana.casa
  } else if (fretsUsados.length > 0 && Math.max(...fretsUsados) > 5) {
    startFret = Math.min(...fretsUsados)
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  const strX = (i) => PAD_L + i * SS
  const fretY = (fret) => PAD_TOP + (fret - startFret) * FS + FS / 2

  function isBarreNote(i) {
    if (!pestana) return false
    const de = pestana.de ?? 0
    const ate = pestana.ate ?? 5
    return cordas[i] === pestana.casa && i >= de && i <= ate
  }

  const [w, h] = SIZES[tamanho] ?? SIZES.md

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      width={w}
      height={h}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Diagrama do acorde ${nome}`}
      style={{ display: 'block' }}
    >
      {/* ── Chord name ───────────────────────────────────────────────────── */}
      <text
        x={SVG_W / 2} y={14}
        textAnchor="middle" dominantBaseline="central"
        fontSize={14} fontWeight="700" fill="#2D6E52"
        fontFamily="Inter, system-ui, sans-serif"
      >
        {nome}
      </text>

      {descricao && (
        <text
          x={SVG_W / 2} y={28}
          textAnchor="middle" dominantBaseline="central"
          fontSize={9} fill="#9ca3af"
          fontFamily="Inter, system-ui, sans-serif"
        >
          {descricao}
        </text>
      )}

      {/* ── X / O indicators above each string ──────────────────────────── */}
      {cordas.map((fret, i) => {
        const x = strX(i)
        const y = PAD_TOP - 11
        if (fret === null) {
          return (
            <text
              key={i} x={x} y={y}
              textAnchor="middle" dominantBaseline="central"
              fontSize={12} fontWeight="700" fill="#ef4444"
              fontFamily="Inter, system-ui, sans-serif"
            >
              ×
            </text>
          )
        }
        if (fret === 0) {
          return (
            <circle
              key={i} cx={x} cy={y} r={4.5}
              fill="none" stroke="#374151" strokeWidth={1.5}
            />
          )
        }
        return null
      })}

      {/* ── Nut (thick top bar when starting at fret 1) ──────────────────── */}
      {startFret === 1 ? (
        <rect
          x={PAD_L - 1} y={PAD_TOP - NUT_H / 2}
          width={GRID_W + 2} height={NUT_H}
          rx={2} fill="#1f2937"
        />
      ) : (
        /* Fret number label when not starting at fret 1 */
        <text
          x={PAD_L - 5} y={PAD_TOP + FS / 2}
          textAnchor="end" dominantBaseline="central"
          fontSize={9} fill="#6b7280"
          fontFamily="Inter, system-ui, sans-serif"
        >
          {startFret}ª
        </text>
      )}

      {/* ── Fret lines (6 lines = top + 5 fret boundaries) ──────────────── */}
      {Array.from({ length: 6 }, (_, j) => (
        <line
          key={j}
          x1={PAD_L} y1={PAD_TOP + j * FS}
          x2={PAD_L + GRID_W} y2={PAD_TOP + j * FS}
          stroke={j === 0 && startFret === 1 ? 'transparent' : '#d1d5db'}
          strokeWidth={1}
        />
      ))}

      {/* ── String lines (6 vertical lines) ─────────────────────────────── */}
      {Array.from({ length: 6 }, (_, i) => (
        <line
          key={i}
          x1={PAD_L + i * SS} y1={PAD_TOP}
          x2={PAD_L + i * SS} y2={PAD_TOP + GRID_H}
          stroke="#9ca3af"
          strokeWidth={i === 0 || i === 5 ? 1.5 : 1}
        />
      ))}

      {/* ── Barre / Pestana ──────────────────────────────────────────────── */}
      {pestana && (() => {
        const de = pestana.de ?? 0
        const ate = pestana.ate ?? 5
        const y = fretY(pestana.casa)
        const x1 = strX(de)
        const x2 = strX(ate)
        return (
          <rect
            x={x1 - DOT_R} y={y - DOT_R}
            width={x2 - x1 + DOT_R * 2} height={DOT_R * 2}
            rx={DOT_R}
            fill="#2D6E52"
          />
        )
      })()}

      {/* ── Finger dots ──────────────────────────────────────────────────── */}
      {cordas.map((fret, i) => {
        if (!fret || fret === 0) return null
        if (isBarreNote(i)) return null   // barre already covers this note

        const x = strX(i)
        const y = fretY(fret)
        const dedo = dedos[i]

        return (
          <g key={i}>
            <circle cx={x} cy={y} r={DOT_R} fill="#2D6E52" />
            {dedo > 0 && (
              <text
                x={x} y={y}
                textAnchor="middle" dominantBaseline="central"
                fontSize={8} fontWeight="700" fill="white"
                fontFamily="Inter, system-ui, sans-serif"
              >
                {dedo}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
