import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import ProgressoAula from '../components/ProgressoAula'
import { aulasViolao } from '../data/aulas-violao'
import { aulasTeclado } from '../data/aulas-teclado'
import { useProgresso } from '../hooks/useProgresso'

export default function ListaAulas({ instrumento }) {
  const navigate = useNavigate()
  const aulas = instrumento === 'teclado' ? aulasTeclado : aulasViolao
  const { concluidas } = useProgresso(instrumento)

  const total = aulas.length
  const numConcluidas = concluidas.filter((id) => aulas.some((a) => a.id === id)).length

  return (
    <Layout instrumento={instrumento}>
      <div className="py-4 flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-mint-dark">Aulas</h1>

        {/* Progress bar */}
        <ProgressoAula total={total} numConcluidas={numConcluidas} />

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
