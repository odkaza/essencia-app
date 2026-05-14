import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { versiculos } from '../data/versiculos'
import { useTurma } from '../hooks/useTurma'

function formatarData(iso) {
  const d = new Date(iso)
  const hoje = new Date()
  const diff = Math.floor((hoje - d) / 86400000)
  if (diff === 0) return 'Hoje'
  if (diff === 1) return 'Ontem'
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
}

export default function HomeInstrumento({ instrumento }) {
  const navigate = useNavigate()
  const versiculo = versiculos[new Date().getDay()]
  const label = instrumento === 'violao' ? 'Violão' : 'Teclado'

  const { turmas, buscarAvisos } = useTurma()
  const turma = turmas.find((t) => t.instrumento === instrumento) ?? null
  const [avisos, setAvisos] = useState([])

  useEffect(() => {
    if (turma?.id) {
      buscarAvisos(turma.id).then(setAvisos)
    } else {
      setAvisos([])
    }
  }, [turma?.id, buscarAvisos])

  return (
    <Layout instrumento={instrumento}>
      {/* Versículo do dia */}
      <div className="bg-mint-light rounded-2xl p-4 mb-4 text-center">
        <p className="text-mint-dark italic text-sm leading-relaxed">"{versiculo.texto}"</p>
        <p className="text-mint-dark/70 text-xs mt-1">— {versiculo.referencia}</p>
      </div>

      {/* Turma banner */}
      {turma && (
        <button
          onClick={() => navigate(`/${instrumento}/turmas`)}
          className="w-full mb-4 flex items-center gap-3 bg-white border border-mint-light rounded-2xl px-4 py-3 text-left hover:bg-mint-light/50 transition-colors"
        >
          <span className="text-xl">🎓</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-light">Sua turma</p>
            <p className="font-semibold text-mint-dark text-sm truncate">{turma.nome}</p>
          </div>
          <span className="text-gray-300 text-lg shrink-0">›</span>
        </button>
      )}

      {/* Boas vindas */}
      <h2 className="text-xl font-bold text-mint-dark mb-4">
        Olá! O que vamos estudar hoje?
      </h2>

      {/* Cards de navegação */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate(`/${instrumento}/aulas`)}
          className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md active:scale-98 transition-all border border-gray-100"
        >
          <div className="w-12 h-12 rounded-xl bg-mint-light flex items-center justify-center text-2xl flex-shrink-0">
            📚
          </div>
          <div className="text-left">
            <p className="font-semibold text-mint-dark">Minhas Aulas</p>
            <p className="text-text-light text-sm">10 aulas de {label}</p>
          </div>
          <span className="ml-auto text-gray-300 text-lg">›</span>
        </button>

        <button
          onClick={() => navigate(`/${instrumento}/ferramentas`)}
          className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md active:scale-98 transition-all border border-gray-100"
        >
          <div className="w-12 h-12 rounded-xl bg-mint-light flex items-center justify-center text-2xl flex-shrink-0">
            🛠️
          </div>
          <div className="text-left">
            <p className="font-semibold text-mint-dark">Ferramentas</p>
            <p className="text-text-light text-sm">Metrônomo, afinador, acordes</p>
          </div>
          <span className="ml-auto text-gray-300 text-lg">›</span>
        </button>

        <button
          onClick={() => navigate(`/${instrumento}/quiz/1`)}
          className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md active:scale-98 transition-all border border-gray-100"
        >
          <div className="w-12 h-12 rounded-xl bg-mint-light flex items-center justify-center text-2xl flex-shrink-0">
            📝
          </div>
          <div className="text-left">
            <p className="font-semibold text-mint-dark">Exercícios</p>
            <p className="text-text-light text-sm">Quiz de fixação por aula</p>
          </div>
          <span className="ml-auto text-gray-300 text-lg">›</span>
        </button>

        <button
          onClick={() => navigate(`/${instrumento}/turmas`)}
          className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md active:scale-98 transition-all border border-gray-100"
        >
          <div className="w-12 h-12 rounded-xl bg-mint-light flex items-center justify-center text-2xl flex-shrink-0">
            🎓
          </div>
          <div className="text-left">
            <p className="font-semibold text-mint-dark">Minhas Turmas</p>
            <p className="text-text-light text-sm">
              {turma ? turma.nome : 'Entrar com código do professor'}
            </p>
          </div>
          <span className="ml-auto text-gray-300 text-lg">›</span>
        </button>
      </div>

      {/* Avisos da turma */}
      {avisos.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          <h3 className="text-sm font-bold text-mint-dark">Avisos da Turma</h3>
          {avisos.map((aviso) => (
            <div key={aviso.id} className="bg-white rounded-2xl shadow-sm p-4 border-l-4 border-mint">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-semibold text-mint-dark leading-snug">{aviso.titulo}</p>
                <span className="text-xs text-text-light shrink-0">{formatarData(aviso.criado_em)}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{aviso.mensagem}</p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
