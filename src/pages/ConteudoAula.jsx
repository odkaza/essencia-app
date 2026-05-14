import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import DiagramaViolao from '../components/DiagramaViolao'
import TecladoVisual from '../components/TecladoVisual'
import { aulasViolao } from '../data/aulas-violao'
import { aulasTeclado } from '../data/aulas-teclado'
import { acordesViolao } from '../data/acordes-violao'
import { getAcordeTeclado } from '../data/acordes-teclado'

const STORAGE_KEY = (instrumento) => `essencia_progresso_${instrumento}`

function lerProgresso(instrumento) {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY(instrumento)) ?? '[]')
  } catch {
    return []
  }
}

function salvarProgresso(instrumento, ids) {
  localStorage.setItem(STORAGE_KEY(instrumento), JSON.stringify(ids))
}

function DiagramasSecao({ instrumento, acordes }) {
  if (!acordes?.length) return null

  if (instrumento === 'violao') {
    return (
      <div className="mt-3 flex flex-wrap gap-4 justify-center">
        {acordes.map((nome) => {
          const acorde = acordesViolao[nome]
          return acorde ? (
            <DiagramaViolao key={nome} acorde={acorde} tamanho="sm" />
          ) : null
        })}
      </div>
    )
  }

  return (
    <div className="mt-3 flex flex-col gap-4">
      {acordes.map((nome) => {
        const acorde = getAcordeTeclado(nome)
        return acorde ? (
          <div key={nome} style={{ maxWidth: '70%', margin: '10px auto' }}>
            <p className="text-xs font-bold text-mint-dark text-center mb-1">
              {acorde.nome} <span className="font-normal text-text-light">({acorde.descricao})</span>
            </p>
            <TecladoVisual notas={acorde.notas} oitavas={2} startOctave={3} />
          </div>
        ) : null
      })}
    </div>
  )
}

export default function ConteudoAula({ instrumento }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const aulas = instrumento === 'teclado' ? aulasTeclado : aulasViolao
  const aulaIdx = aulas.findIndex((a) => a.id === id)
  const aula = aulas[aulaIdx]

  const [concluidas, setConcluidas] = useState(() => lerProgresso(instrumento))

  if (!aula) {
    navigate(`/${instrumento}/aulas`, { replace: true })
    return null
  }

  const concluida = concluidas.includes(id)

  function marcarConcluida() {
    if (concluida) return
    const novas = [...concluidas, id]
    setConcluidas(novas)
    salvarProgresso(instrumento, novas)
  }

  const aulaAnterior = aulaIdx > 0 ? aulas[aulaIdx - 1] : null
  const proximaAula  = aulaIdx < aulas.length - 1 ? aulas[aulaIdx + 1] : null

  return (
    <Layout instrumento={instrumento}>
      <div className="py-4 flex flex-col gap-4">

        {/* Header */}
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate(`/${instrumento}/aulas`)}
            className="mt-0.5 p-1.5 rounded-xl hover:bg-mint-light transition-colors shrink-0 text-mint-dark"
          >
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none">
              <path
                d="M13 4l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div>
            <p className="text-xs text-text-light">
              Aula {aulaIdx + 1} de {aulas.length}
            </p>
            <h1 className="text-xl font-bold text-mint-dark leading-snug">{aula.titulo}</h1>
          </div>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-3">
          {aula.secoes.map((secao, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-4">
              <h2 className="text-sm font-bold text-mint-dark mb-2">{secao.titulo}</h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {secao.conteudo}
              </p>
              <DiagramasSecao instrumento={instrumento} acordes={secao.acordes} />
            </div>
          ))}
        </div>

        {/* Mark complete */}
        <button
          onClick={marcarConcluida}
          disabled={concluida}
          className={`w-full py-4 rounded-2xl text-base font-bold transition-all ${
            concluida
              ? 'bg-mint-light text-mint-dark cursor-default'
              : 'bg-mint text-white shadow-sm hover:bg-mint-dark active:scale-95'
          }`}
        >
          {concluida ? '✅  Aula Concluída' : 'Marcar como Concluída'}
        </button>

        {/* Quiz shortcut */}
        <button
          onClick={() => navigate(`/${instrumento}/quiz/${id}`)}
          className="w-full py-3.5 rounded-2xl text-sm font-bold border-2 border-mint-light text-mint-dark hover:border-mint hover:bg-mint-light transition-colors"
        >
          🎵 Fazer Quiz desta Aula
        </button>

        {/* Lesson navigation */}
        <div className="flex gap-3 pb-2">
          <button
            onClick={() => aulaAnterior && navigate(`/${instrumento}/aulas/${aulaAnterior.id}`)}
            disabled={!aulaAnterior}
            className={`flex-1 py-3 rounded-2xl text-sm font-semibold border-2 transition-colors ${
              aulaAnterior
                ? 'border-mint-light text-mint-dark hover:border-mint active:bg-mint-light'
                : 'border-gray-100 text-gray-300 cursor-default'
            }`}
          >
            ← Anterior
          </button>
          <button
            onClick={() => proximaAula && navigate(`/${instrumento}/aulas/${proximaAula.id}`)}
            disabled={!proximaAula}
            className={`flex-1 py-3 rounded-2xl text-sm font-semibold border-2 transition-colors ${
              proximaAula
                ? 'border-mint-light text-mint-dark hover:border-mint active:bg-mint-light'
                : 'border-gray-100 text-gray-300 cursor-default'
            }`}
          >
            Próxima →
          </button>
        </div>

      </div>
    </Layout>
  )
}
