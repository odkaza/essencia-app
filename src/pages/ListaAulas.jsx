import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { aulasViolao } from '../data/aulas-violao'
import { aulasTeclado } from '../data/aulas-teclado'

function lerProgresso(instrumento) {
  try {
    return JSON.parse(localStorage.getItem(`essencia_progresso_${instrumento}`) ?? '[]')
  } catch {
    return []
  }
}

export default function ListaAulas({ instrumento }) {
  const navigate = useNavigate()
  const aulas = instrumento === 'teclado' ? aulasTeclado : aulasViolao
  const [concluidas, setConcluidas] = useState(() => lerProgresso(instrumento))

  // Re-read when returning to this page
  useEffect(() => {
    const handler = () => setConcluidas(lerProgresso(instrumento))
    window.addEventListener('focus', handler)
    return () => window.removeEventListener('focus', handler)
  }, [instrumento])

  const total = aulas.length
  const numConcluidas = concluidas.filter(id => aulas.some(a => a.id === id)).length
  const pct = total > 0 ? (numConcluidas / total) * 100 : 0

  return (
    <Layout instrumento={instrumento}>
      <div className="py-4 flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-mint-dark">Aulas</h1>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-text-light mb-2">
            <span>Progresso</span>
            <span>{numConcluidas} de {total} concluídas</span>
          </div>
          <div className="h-2.5 bg-mint-light rounded-full overflow-hidden">
            <div
              className="h-full bg-mint rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Lesson list */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {aulas.map((aula, i) => {
            const concluida = concluidas.includes(aula.id)
            return (
              <button
                key={aula.id}
                onClick={() => navigate(`/${instrumento}/aulas/${aula.id}`)}
                className={`flex items-center w-full px-4 py-3.5 text-left transition-colors hover:bg-gray-50 active:bg-mint-light ${
                  i < aulas.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                {/* Lesson number */}
                <span className="w-7 shrink-0 text-sm font-bold text-text-light tabular-nums">
                  {i + 1}
                </span>

                {/* Title + description */}
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-sm font-bold text-mint-dark leading-snug">{aula.titulo}</p>
                  <p className="text-xs text-text-light mt-0.5 truncate">{aula.descricao}</p>
                </div>

                {/* Status icon */}
                <span className="text-lg shrink-0">{concluida ? '✅' : '🔓'}</span>
              </button>
            )
          })}
        </div>

        {numConcluidas === total && total > 0 && (
          <div className="text-center py-3 bg-mint-light rounded-2xl">
            <p className="text-sm font-bold text-mint-dark">🎉 Parabéns! Você concluiu todas as aulas!</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
