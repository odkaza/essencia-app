import { useMemo } from 'react'

const WW = 30      // white key width
const WH = 118     // white key height
const BW = 18      // black key width
const BH = 74      // black key height
const LABEL_H = 18 // height for note-name labels below keys
const RX = 3       // corner radius

// x-offset of each black key from the start of its octave.
// Array indexed by white key position (C=0 … B=6).
// null = no black key after that white key (E and B have none).
const BLACK_OFFSETS = [
  WW * 1 - BW / 2,  // C#  (at C/D boundary)
  WW * 2 - BW / 2,  // D#  (at D/E boundary)
  null,              // E   → no black
  WW * 4 - BW / 2,  // F#  (at F/G boundary)
  WW * 5 - BW / 2,  // G#  (at G/A boundary)
  WW * 6 - BW / 2,  // A#  (at A/B boundary)
  null,              // B   → no black
]

const WHITE_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const BLACK_NAMES = ['C#', 'D#', null, 'F#', 'G#', 'A#', null]

function buildKeys(oitavas, startOctave) {
  const whites = []
  const blacks = []
  for (let o = 0; o < oitavas; o++) {
    const oct = startOctave + o
    const octX = o * 7 * WW
    for (let i = 0; i < 7; i++) {
      whites.push({
        id: `${WHITE_NAMES[i]}${oct}`,
        name: WHITE_NAMES[i],
        isC: WHITE_NAMES[i] === 'C',
        x: octX + i * WW,
        isBlack: false,
      })
      const offset = BLACK_OFFSETS[i]
      if (offset !== null) {
        blacks.push({
          id: `${BLACK_NAMES[i]}${oct}`,
          name: BLACK_NAMES[i],
          x: octX + offset,
          isBlack: true,
        })
      }
    }
  }
  return { whites, blacks }
}

// Plain function (not a component) to avoid re-mount issues from nested definitions.
function fingerMark(k, cx, cy, size, dedos) {
  const dedo = dedos[k.id]
  if (!dedo) return null
  return (
    <g key={`d-${k.id}`}>
      <circle cx={cx} cy={cy} r={size + 2} fill="white" fillOpacity={0.25} />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size}
        fontWeight="700"
        fill="white"
        fontFamily="Inter, system-ui, sans-serif"
      >
        {dedo}
      </text>
    </g>
  )
}

export default function TecladoVisual({
  notas = [],
  dedos = {},
  oitavas = 2,
  startOctave = 3,
  corDestaque = '#4CAF80',
  corMaoEsquerda = '#F59E0B',
  corMaoDireita = '#10B981',
  notasME = [],
  notasMD = [],
  onKeyClick = null,
  selectedNotas = [],
}) {
  const { whites, blacks } = useMemo(
    () => buildKeys(oitavas, startOctave),
    [oitavas, startOctave]
  )

  const simpleSet   = useMemo(() => new Set(notas),         [notas])
  const meSet       = useMemo(() => new Set(notasME),       [notasME])
  const mdSet       = useMemo(() => new Set(notasMD),       [notasMD])
  const selectedSet = useMemo(() => new Set(selectedNotas), [selectedNotas])

  const svgW = oitavas * 7 * WW
  const svgH = WH + LABEL_H

  function keyFill(k) {
    if (selectedSet.has(k.id)) return '#F59E0B'
    if (meSet.has(k.id)) return corMaoEsquerda
    if (mdSet.has(k.id)) return corMaoDireita
    if (simpleSet.has(k.id)) return corDestaque
    return k.isBlack ? '#1f2937' : '#ffffff'
  }

  function isHighlighted(k) {
    return simpleSet.has(k.id) || meSet.has(k.id) || mdSet.has(k.id) || selectedSet.has(k.id)
  }

  const clickable = !!onKeyClick

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', minWidth: `${Math.min(svgW, 320)}px` }}
        role="img"
        aria-label="Teclado de piano"
      >
        {/* Dark housing behind the keys */}
        <rect x={0} y={0} width={svgW} height={WH} rx={6} fill="#374151" />

        {/* ── White keys ── */}
        {whites.map((k) => (
          <rect
            key={k.id}
            x={k.x + 0.5}
            y={0.5}
            width={WW - 1}
            height={WH - 1}
            rx={RX}
            fill={keyFill(k)}
            stroke="#d1d5db"
            strokeWidth={1}
            style={{ cursor: clickable ? 'pointer' : 'default' }}
            onClick={clickable ? () => onKeyClick(k.id) : undefined}
          />
        ))}

        {/* Finger numbers on highlighted white keys */}
        {whites.map((k) =>
          isHighlighted(k)
            ? fingerMark(k, k.x + WW / 2, WH - 14, 13, dedos)
            : null
        )}

        {/* Note name labels below white keys */}
        {whites.map((k) => (
          <text
            key={`lbl-${k.id}`}
            x={k.x + WW / 2}
            y={WH + LABEL_H / 2 + 1}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={10}
            fontWeight={k.isC ? '700' : '400'}
            fill={isHighlighted(k) ? corDestaque : '#9ca3af'}
            fontFamily="Inter, system-ui, sans-serif"
          >
            {k.name}
          </text>
        ))}

        {/* ── Black keys (rendered last so they appear on top) ── */}
        {blacks.map((k) => (
          <rect
            key={k.id}
            x={k.x}
            y={0}
            width={BW}
            height={BH}
            rx={RX}
            fill={keyFill(k)}
            style={{ cursor: clickable ? 'pointer' : 'default' }}
            onClick={clickable ? () => onKeyClick(k.id) : undefined}
          />
        ))}

        {/* Finger numbers on highlighted black keys */}
        {blacks.map((k) =>
          isHighlighted(k)
            ? fingerMark(k, k.x + BW / 2, BH - 11, 10, dedos)
            : null
        )}
      </svg>
    </div>
  )
}
