import { useState, useMemo } from 'react'
import Layout from '../components/Layout'
import DiagramaViolao from '../components/DiagramaViolao'
import TecladoVisual from '../components/TecladoVisual'
import { acordesViolao } from '../data/acordes-violao'
import { getAcordeTeclado } from '../data/acordes-teclado'

function getCategory(nome) {
  if (nome.includes('dim')) return 'dim'
  if (nome.includes('7')) return '7'
  if (/m$/.test(nome)) return 'm'
  return 'M'
}

const CATEGORY_LABEL = { M: 'maior', m: 'menor', '7': 'dom. 7ª', dim: 'diminuto' }

// Skip alias keys by checking if key === chord.nome
const VIOLAO_CHORDS = Object.entries(acordesViolao)
  .filter(([key, val]) => key === val.nome)
  .map(([, val]) => val)

const TECLADO_NAMES = [
  'C', 'D', 'E', 'F', 'G', 'A', 'B', 'F#', 'Bb', 'Eb', 'Ab', 'Db',
  'Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm', 'F#m', 'Bbm', 'Ebm', 'Abm', 'Dbm',
  'Cdim', 'Ddim', 'Edim', 'Fdim', 'Gdim', 'Adim', 'Bdim',
]

const TECLADO_CHORDS = TECLADO_NAMES.map((n) => getAcordeTeclado(n)).filter(Boolean)

const FILTERS_VIOLAO = [
  { id: 'all', label: 'Todos' },
  { id: 'M',   label: 'Maiores' },
  { id: 'm',   label: 'Menores' },
  { id: '7',   label: 'Com sétima' },
]

const FILTERS_TECLADO = [
  { id: 'all', label: 'Todos' },
  { id: 'M',   label: 'Maiores' },
  { id: 'm',   label: 'Menores' },
]

export default function DiagramasAcordes({ instrumento }) {
  const [filtro, setFiltro]         = useState('all')
  const [selecionado, setSelecionado] = useState(null)

  const allChords = instrumento === 'violao' ? VIOLAO_CHORDS : TECLADO_CHORDS
  const filters   = instrumento === 'violao' ? FILTERS_VIOLAO : FILTERS_TECLADO

  const chords = useMemo(
    () =>
      filtro === 'all'
        ? allChords
        : allChords.filter((a) => getCategory(a.nome) === filtro),
    [allChords, filtro]
  )

  function openChord(acorde) {
    const desc = acorde.descricao ?? CATEGORY_LABEL[getCategory(acorde.nome)]
    setSelecionado({ ...acorde, descricao: desc })
  }

  return (
    <Layout instrumento={instrumento}>
      <div className="py-4">
        <h1 className="text-2xl font-bold text-mint-dark mb-1">Diagramas de Acordes</h1>
        <p className="text-sm text-text-light mb-5">
          {instrumento === 'teclado'
            ? 'Posição das notas no teclado'
            : 'Posição dos dedos no violão'}
        </p>

        {/* Filter pills */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={`
                shrink-0 text-sm font-medium px-4 py-1.5 rounded-full border transition-colors cursor-pointer
                ${filtro === f.id
                  ? 'bg-mint text-white border-mint'
                  : 'text-mint-dark border-mint/40 hover:border-mint bg-transparent'}
              `}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Chord grid — 3 columns */}
        <div className="grid grid-cols-3 gap-2">
          {chords.map((acorde) => (
            <button
              key={acorde.nome}
              onClick={() => openChord(acorde)}
              className="
                bg-white rounded-xl p-3 shadow-sm text-center
                border-2 border-transparent
                hover:border-mint hover:shadow-md
                active:scale-95
                transition-all duration-150
                cursor-pointer
              "
            >
              <span className="block text-base font-bold text-mint-dark leading-tight">
                {acorde.nome}
              </span>
              <span className="block text-[10px] text-text-light mt-0.5">
                {acorde.descricao ?? CATEGORY_LABEL[getCategory(acorde.nome)]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom-sheet modal */}
      {selecionado && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={() => setSelecionado(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Sheet */}
          <div
            className="relative bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl px-6 pt-4 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle (mobile only) */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 sm:hidden" />

            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-2xl font-bold text-mint-dark leading-tight">
                  {selecionado.nome}
                </h2>
                <p className="text-sm text-text-light capitalize">{selecionado.descricao}</p>
              </div>
              <button
                onClick={() => setSelecionado(null)}
                className="text-gray-400 hover:text-gray-600 p-1 -mr-1 cursor-pointer"
                aria-label="Fechar"
              >
                <svg viewBox="0 0 20 20" width="22" height="22" fill="none">
                  <path
                    d="M4 4l12 12M16 4L4 16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Diagram */}
            <div className="flex justify-center">
              {instrumento === 'violao' ? (
                <DiagramaViolao acorde={selecionado} tamanho="lg" />
              ) : (
                <TecladoVisual notas={selecionado.notas} />
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
