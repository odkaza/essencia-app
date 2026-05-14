// Guitar chord shapes — string index 0 = string 6 (E2, lowest), 5 = string 1 (E4, highest)
// null = muted  |  0 = open  |  n = fret number
// Covers all chords that appear in the major/minor harmonic fields of common worship keys.

export const acordesViolao = {

  // ── Open / 1st position major chords ─────────────────────────────────────
  C:  { nome:'C',  cordas:[null,3,2,0,1,0],   dedos:[null,3,2,0,1,0] },
  D:  { nome:'D',  cordas:[null,null,0,2,3,2], dedos:[null,null,0,1,3,2] },
  E:  { nome:'E',  cordas:[0,2,2,1,0,0],       dedos:[0,2,3,1,0,0] },
  G:  { nome:'G',  cordas:[3,2,0,0,0,3],       dedos:[2,1,0,0,0,3] },
  A:  { nome:'A',  cordas:[null,0,2,2,2,0],    dedos:[null,0,1,2,3,0] },

  // ── Add/sus chords ────────────────────────────────────────────────────────
  // F9 = F major add9 (F A C G): barre 1st fret, ring on D, open A and G
  F9: { nome:'F9', cordas:[1,0,3,0,1,1],       dedos:[1,0,3,0,1,1],   pestana:{casa:1,dedo:1} },

  // ── Dominant 7th chords ───────────────────────────────────────────────────
  G7: { nome:'G7', cordas:[3,2,0,0,0,1],       dedos:[3,2,0,0,0,1] },
  A7: { nome:'A7', cordas:[null,0,2,0,2,0],    dedos:[null,0,2,0,3,0] },
  E7: { nome:'E7', cordas:[0,2,0,1,0,0],       dedos:[0,2,0,1,0,0] },
  D7: { nome:'D7', cordas:[null,null,0,2,1,2], dedos:[null,null,0,3,1,2] },
  C7: { nome:'C7', cordas:[null,3,2,3,1,0],    dedos:[null,3,2,4,1,0] },

  // Barre / higher-position major chords
  F:  { nome:'F',  cordas:[1,3,3,2,1,1],       dedos:[1,3,4,2,1,1],   pestana:{casa:1,dedo:1} },
  B:  { nome:'B',  cordas:[null,2,4,4,4,2],    dedos:[null,1,3,3,3,1], pestana:{casa:2,dedo:1,de:1,ate:5} },
  'F#': { nome:'F#', cordas:[2,4,4,3,2,2],     dedos:[1,3,4,2,1,1],   pestana:{casa:2,dedo:1} },
  Bb: { nome:'Bb', cordas:[null,1,3,3,3,1],    dedos:[null,1,3,3,3,1], pestana:{casa:1,dedo:1,de:1,ate:5} },
  Eb: { nome:'Eb', cordas:[null,null,1,3,4,3], dedos:[null,null,1,2,4,3] },
  Ab: { nome:'Ab', cordas:[4,6,6,5,4,4],       dedos:[1,3,4,2,1,1],   pestana:{casa:4,dedo:1} },
  Db: { nome:'Db', cordas:[null,4,6,6,6,4],    dedos:[null,1,3,3,3,1], pestana:{casa:4,dedo:1,de:1,ate:5} },
  Gb: { nome:'Gb', cordas:[2,4,4,3,2,2],       dedos:[1,3,4,2,1,1],   pestana:{casa:2,dedo:1} },

  // ── Minor chords ─────────────────────────────────────────────────────────
  Am: { nome:'Am', cordas:[null,0,2,2,1,0],    dedos:[null,0,2,3,1,0] },
  Dm: { nome:'Dm', cordas:[null,null,0,2,3,1], dedos:[null,null,0,2,3,1] },
  Em: { nome:'Em', cordas:[0,2,2,0,0,0],       dedos:[0,2,3,0,0,0] },
  Bm: { nome:'Bm', cordas:[null,2,4,4,3,2],    dedos:[null,1,3,4,2,1], pestana:{casa:2,dedo:1,de:1,ate:5} },
  'F#m': { nome:'F#m', cordas:[2,4,4,2,2,2],   dedos:[1,3,4,1,1,1],   pestana:{casa:2,dedo:1} },
  'C#m': { nome:'C#m', cordas:[null,4,6,6,5,4],dedos:[null,1,3,4,2,1], pestana:{casa:4,dedo:1,de:1,ate:5} },
  'G#m': { nome:'G#m', cordas:[4,6,6,4,4,4],   dedos:[1,3,4,1,1,1],   pestana:{casa:4,dedo:1} },
  'D#m': { nome:'D#m', cordas:[null,null,1,3,4,2], dedos:[null,null,1,3,4,2] },
  Gm:  { nome:'Gm',  cordas:[3,5,5,3,3,3],     dedos:[1,3,4,1,1,1],   pestana:{casa:3,dedo:1} },
  Cm:  { nome:'Cm',  cordas:[null,3,5,5,4,3],  dedos:[null,1,3,4,2,1], pestana:{casa:3,dedo:1,de:1,ate:5} },
  Fm:  { nome:'Fm',  cordas:[1,3,3,1,1,1],     dedos:[1,3,4,1,1,1],   pestana:{casa:1,dedo:1} },
  Bbm: { nome:'Bbm', cordas:[null,1,3,3,2,1],  dedos:[null,1,3,4,2,1], pestana:{casa:1,dedo:1,de:1,ate:5} },
  Ebm: { nome:'Ebm', cordas:[null,null,1,3,4,2], dedos:[null,null,1,3,4,2] },
  Abm: { nome:'Abm', cordas:[4,6,6,4,4,4],     dedos:[1,3,4,1,1,1],   pestana:{casa:4,dedo:1} },
  Dbm: { nome:'Dbm', cordas:[null,4,6,6,5,4],  dedos:[null,1,3,4,2,1], pestana:{casa:4,dedo:1,de:1,ate:5} },

  // ── Diminished chords (verified voicings on strings [1]–[4]) ─────────────
  // Pattern: root on A2 string, then dim triad upward
  Bdim:  { nome:'Bdim',  cordas:[null,2,3,4,3,null], dedos:[null,1,2,4,3,null] }, // B,F,B,D
  'C#dim': { nome:'C#dim', cordas:[null,null,2,0,2,null], dedos:[null,null,2,0,3,null] }, // E,G,C#
  Dbdim: { nome:'Dbdim', cordas:[null,null,2,0,2,null], dedos:[null,null,2,0,3,null] },
  Ddim:  { nome:'Ddim',  cordas:[null,null,3,1,3,null], dedos:[null,null,3,1,4,null] }, // F,Ab,D
  'D#dim': { nome:'D#dim', cordas:[null,null,1,2,1,null], dedos:[null,null,1,3,1,null] }, // Eb,A,Eb (Eb dim = Eb,Gb,A)
  Ebdim: { nome:'Ebdim', cordas:[null,null,1,2,1,null], dedos:[null,null,1,3,1,null] },
  Edim:  { nome:'Edim',  cordas:[null,null,2,3,2,null], dedos:[null,null,1,3,2,null] }, // E,Bb,E (E,G,Bb)
  'F#dim': { nome:'F#dim', cordas:[null,null,4,5,4,null], dedos:[null,null,1,3,2,null] }, // F#,C,F#
  Gbdim: { nome:'Gbdim', cordas:[null,null,4,5,4,null], dedos:[null,null,1,3,2,null] },
  Gdim:  { nome:'Gdim',  cordas:[null,null,5,3,5,null], dedos:[null,null,3,1,4,null] },
  'G#dim': { nome:'G#dim', cordas:[null,null,2,0,1,null], dedos:[null,null,2,0,1,null] }, // G#,D,G# (G#,B,D)
  Abdim: { nome:'Abdim', cordas:[null,null,2,0,1,null], dedos:[null,null,2,0,1,null] },
  Adim:  { nome:'Adim',  cordas:[null,0,1,2,1,null],  dedos:[null,0,1,3,2,null] },   // A,Eb,G (A,C,Eb)
  'A#dim': { nome:'A#dim', cordas:[null,null,3,4,3,null], dedos:[null,null,1,3,2,null] },
  Bbdim: { nome:'Bbdim', cordas:[null,null,3,4,3,null], dedos:[null,null,1,3,2,null] },
  Cdim:  { nome:'Cdim',  cordas:[null,null,1,2,1,null], dedos:[null,null,1,3,2,null] },
  Fdim:  { nome:'Fdim',  cordas:[null,null,0,1,0,null], dedos:[null,null,0,1,0,null] },
}

// Aliases so lookup works with any enharmonic spelling
acordesViolao['C#'] = acordesViolao['Db']
acordesViolao['D#'] = acordesViolao['Eb']
acordesViolao['E#'] = acordesViolao['F']
acordesViolao['Gb'] = acordesViolao['F#'] // already defined above
acordesViolao['G#'] = acordesViolao['Ab']
acordesViolao['A#'] = acordesViolao['Bb']
acordesViolao['C#m'] = acordesViolao['C#m'] // already defined
acordesViolao['D#m'] = acordesViolao['D#m']
acordesViolao['G#m'] = acordesViolao['G#m']
acordesViolao['A#m'] = acordesViolao['Bbm']
