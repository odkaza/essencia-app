import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import DiagramaViolao from '../components/DiagramaViolao'
import TecladoVisual from '../components/TecladoVisual'
import { aulasViolao } from '../data/aulas-violao'
import { aulasTeclado } from '../data/aulas-teclado'
import { acordesViolao } from '../data/acordes-violao'
import { getAcordeTeclado } from '../data/acordes-teclado'
import { useProgresso } from '../hooks/useProgresso'
import { useAuth } from '../contexts/AuthContext'

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

function IconeNuvem({ animando }) {
  if (animando) {
    return (
      <span className="flex items-center gap-1 text-xs text-mint-dark/50">
        <span className="w-3 h-3 border-2 border-mint/40 border-t-mint rounded-full animate-spin inline-block" />
        sincronizando…
      </span>
    )
  }
  return (
    <span className="text-xs text-mint-dark/50 flex items-center gap-1">
      <svg viewBox="0 0 20 20" width="14" height="14" fill="none" className="inline">
        <path d="M5 10a4 4 0 01.5-7.9A5.5 5.5 0 0115 6.5h.5a3 3 0 010 6H5a3 3 0 010-6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M7.5 11.5l2 2 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      salvo na nuvem
    </span>
  )
}

export default function ConteudoAula({ instrumento }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const aulas = instrumento === 'teclado' ? aulasTeclado : aulasViolao
  const aulaIdx = aulas.findIndex((a) => a.id === id)
  const aula = aulas[aulaIdx]

  const { concluidas, marcarConcluida, sincronizando } = useProgresso(instrumento)

  if (!aula) {
    navigate(`/${instrumento}/aulas`, { replace: true })
    return null
  }

  const concluida = concluidas.includes(id)

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
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={() => marcarConcluida(id)}
            disabled={concluida}
            className={`w-full py-4 rounded-2xl text-base font-bold transition-all ${
              concluida
                ? 'bg-mint-light text-mint-dark cursor-default'
                : 'bg-mint text-white shadow-sm hover:bg-mint-dark active:scale-95'
            }`}
          >
            {concluida ? '✅  Aula Concluída' : 'Marcar como Concluída'}
          </button>
          {concluida && user && (
            <IconeNuvem animando={sincronizando} />
          )}
        </div>

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
