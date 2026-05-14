import { useState } from 'react'
import Layout from '../components/Layout'
import DiagramaViolao from '../components/DiagramaViolao'
import TecladoVisual from '../components/TecladoVisual'
import { getCampoHarmonico, TONICS } from '../data/campos-harmonicos'
import { acordesViolao } from '../data/acordes-violao'
import { getAcordeTeclado } from '../data/acordes-teclado'

// Roman numeral quality labels
const GRAU_COLOR = {
  '':    'text-mint-dark bg-mint-light',
  'm':   'text-blue-700 bg-blue-50',
  'dim': 'text-orange-700 bg-orange-50',
}
const GRAU_TAG = {
  '':    'M',
  'm':   'm',
  'dim': '°',
}

export default function CampoHarmonico({ instrumento }) {
  const [tonica, setTonica]     = useState('C')
  const [modo, setModo]         = useState('maior')
  const [acordeSel, setAcordeSel] = useState(null)   // { nome, idx }

  const campo = getCampoHarmonico(tonica, modo)

  function toggleAcorde(nome, idx) {
    setAcordeSel(prev => (prev?.idx === idx ? null : { nome, idx }))
  }

  // Resolve diagram data for the selected chord
  const diagramaViolao = acordeSel ? acordesViolao[acordeSel.nome] ?? null : null
  const diagramaTeclado = acordeSel ? getAcordeTeclado(acordeSel.nome) : null

  return (
    <Layout instrumento={instrumento}>
      <div className="py-4 flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-mint-dark">Campo Harmônico</h1>

        {/* ── Key selector ── */}
        <div>
          <p className="text-xs text-text-light uppercase tracking-widest mb-2">Tonalidade</p>
          <div className="grid grid-cols-4 gap-1.5">
            {TONICS.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTonica(t.id); setAcordeSel(null) }}
                className={`py-2 rounded-xl text-sm font-semibold border-2 transition-colors ${
                  tonica === t.id
                    ? 'bg-mint text-white border-mint shadow-sm'
                    : 'bg-white text-mint-dark border-mint-light hover:border-mint'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Maior / Menor toggle ── */}
        <div className="flex rounded-2xl bg-mint-light p-1 gap-1">
          {['maior', 'menor'].map((m) => (
            <button
              key={m}
              onClick={() => { setModo(m); setAcordeSel(null) }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors capitalize ${
                modo === m
                  ? 'bg-white text-mint-dark shadow-sm'
                  : 'text-mint-dark/60 hover:text-mint-dark'
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Field heading ── */}
        <div className="text-center">
          <span className="text-lg font-bold text-mint-dark">
            {tonica} {modo === 'maior' ? 'Maior' : 'Menor'}
          </span>
        </div>

        {/* ── Degree table ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {campo.map((grau, i) => {
            const isSelected = acordeSel?.idx === i
            const hasViolao  = instrumento === 'violao' && !!acordesViolao[grau.nome]
            const hasTeclado = instrumento === 'teclado'

            return (
              <div key={i}>
                <button
                  onClick={() => toggleAcorde(grau.nome, i)}
                  className={`flex items-center w-full px-4 py-3.5 transition-colors ${
                    i < campo.length - 1 ? 'border-b border-gray-100' : ''
                  } ${isSelected ? 'bg-mint-light' : 'hover:bg-gray-50'}`}
                >
                  {/* Grau label */}
                  <span className="w-10 text-xs font-bold text-text-light tabular-nums">
                    {grau.grau}
                  </span>

                  {/* Chord name */}
                  <span className="flex-1 text-left text-base font-bold text-mint-dark">
                    {grau.nome}
                  </span>

                  {/* Quality badge */}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full mr-3 ${GRAU_COLOR[grau.qualidade]}`}>
                    {GRAU_TAG[grau.qualidade]}
                  </span>

                  {/* Diagram availability indicator */}
                  {(hasViolao || hasTeclado) ? (
                    <svg
                      viewBox="0 0 20 20" width="16" height="16" fill="none"
                      className={`transition-transform duration-200 ${isSelected ? 'rotate-90 text-mint' : 'text-mint-light'}`}
                    >
                      <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="text-[10px] text-text-light w-4" />
                  )}
                </button>

                {/* ── Inline diagram panel ── */}
                {isSelected && (
                  <div className="bg-mint-light/40 px-4 py-4 border-b border-gray-100">
                    {instrumento === 'violao' ? (
                      diagramaViolao ? (
                        <div className="flex justify-center">
                          <DiagramaViolao acorde={diagramaViolao} tamanho="md" />
                        </div>
                      ) : (
                        <p className="text-xs text-text-light text-center py-2">
                          Diagrama não disponível para este acorde.
                        </p>
                      )
                    ) : (
                      diagramaTeclado ? (
                        <div className="flex flex-col items-center gap-2">
                          <TecladoVisual
                            notas={diagramaTeclado.notas}
                            oitavas={2}
                            startOctave={3}
                          />
                          <p className="text-xs text-text-light">
                            Notas: {diagramaTeclado.notas.map(n => n.replace(/\d/, '')).join(' – ')}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-text-light text-center py-2">
                          Diagrama não disponível para este acorde.
                        </p>
                      )
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-3 justify-center flex-wrap pb-2">
          {[
            { label: 'M — Maior',     cls: 'text-mint-dark bg-mint-light' },
            { label: 'm — Menor',     cls: 'text-blue-700 bg-blue-50' },
            { label: '° — Diminuto',  cls: 'text-orange-700 bg-orange-50' },
          ].map(({ label, cls }) => (
            <span key={label} className={`text-[10px] font-semibold px-2 py-1 rounded-full ${cls}`}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </Layout>
  )
}
