// Generates TecladoVisual note arrays from a chord name string.
// Covers chords that appear in any major/minor harmonic field.

const NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

// Normalise enharmonic equivalents to the NOTES array names
const ALIAS = { Db:'C#', Eb:'D#', Gb:'F#', Ab:'G#', Bb:'A#' }

// Semitone intervals above root for each quality
const INTERVALS = {
  '':    [0, 4, 7],   // major
  'm':   [0, 3, 7],   // minor
  'dim': [0, 3, 6],   // diminished
}

function parseChordName(nome) {
  let s = nome
  let root = ''
  if (s.length >= 2 && (s[1] === '#' || s[1] === 'b')) {
    root = s.slice(0, 2)
    s    = s.slice(2)
  } else {
    root = s[0]
    s    = s.slice(1)
  }
  const quality = s === 'dim' ? 'dim' : s === 'm' ? 'm' : ''
  return { root: ALIAS[root] ?? root, quality }
}

/**
 * Returns { nome, notas, descricao } or null if chord can't be resolved.
 * notas: array of note IDs like 'C3', 'E3', 'G3' — fits inside 2 octaves from C3.
 */
export function getAcordeTeclado(nome) {
  const { root, quality } = parseChordName(nome)
  const ri = NOTES.indexOf(root)
  if (ri === -1) return null

  const intervals = INTERVALS[quality] ?? INTERVALS['']

  const notas = intervals.map((semitones) => {
    const ni  = (ri + semitones) % 12
    // Place note in octave 3; if its index is below root index it wraps to octave 4
    const oct = ni < ri ? 4 : 3
    return NOTES[ni] + oct
  })

  const QUAL_LABEL = { '': 'maior', m: 'menor', dim: 'diminuto' }
  return { nome, notas, descricao: QUAL_LABEL[quality] }
}
