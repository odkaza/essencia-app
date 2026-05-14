const NOTES_SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
const NOTES_FLAT  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B']

// Keys that should use flat notation for their derived chords
const FLAT_KEYS = new Set(['F','Bb','Eb','Ab','Db','Gb'])

const MAIOR_STEPS   = [0, 2, 4, 5, 7, 9, 11]
const MENOR_STEPS   = [0, 2, 3, 5, 7, 8, 10]
const MAIOR_QUALITY = ['', 'm', 'm', '', '', 'm', 'dim']
const MENOR_QUALITY = ['m', 'dim', '', 'm', 'm', '', '']

export const GRAUS_MAIOR = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']
export const GRAUS_MENOR = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']

// All 12 tonics shown in the key selector
export const TONICS = [
  { id: 'C',  label: 'C'  },
  { id: 'Db', label: 'Db' },
  { id: 'D',  label: 'D'  },
  { id: 'Eb', label: 'Eb' },
  { id: 'E',  label: 'E'  },
  { id: 'F',  label: 'F'  },
  { id: 'F#', label: 'F#' },
  { id: 'G',  label: 'G'  },
  { id: 'Ab', label: 'Ab' },
  { id: 'A',  label: 'A'  },
  { id: 'Bb', label: 'Bb' },
  { id: 'B',  label: 'B'  },
]

function noteIdx(name) {
  const i = NOTES_SHARP.indexOf(name)
  return i !== -1 ? i : NOTES_FLAT.indexOf(name)
}

/**
 * Returns the 7 chords of the harmonic field for a given tonic and mode.
 * Each entry: { grau, nome, qualidade }
 *   qualidade: '' (major) | 'm' (minor) | 'dim'
 */
export function getCampoHarmonico(tonica, modo) {
  const useFlat = FLAT_KEYS.has(tonica)
  const NOTES   = useFlat ? NOTES_FLAT : NOTES_SHARP
  const root    = noteIdx(tonica)
  if (root === -1) return []

  const steps  = modo === 'menor' ? MENOR_STEPS   : MAIOR_STEPS
  const quals  = modo === 'menor' ? MENOR_QUALITY : MAIOR_QUALITY
  const graus  = modo === 'menor' ? GRAUS_MENOR   : GRAUS_MAIOR

  return steps.map((step, i) => ({
    grau:      graus[i],
    nome:      NOTES[(root + step) % 12] + quals[i],
    qualidade: quals[i],
  }))
}
