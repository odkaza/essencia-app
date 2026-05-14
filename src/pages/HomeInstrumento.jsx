import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { versiculos } from '../data/versiculos'

export default function HomeInstrumento({ instrumento }) {
  const navigate = useNavigate()
  const versiculo = versiculos[new Date().getDay()]
  const label = instrumento === 'violao' ? 'Violão' : 'Teclado'

  return (
    <Layout instrumento={instrumento}>
      {/* Versículo do dia */}
      <div className="bg-mint-light rounded-2xl p-4 mb-6 text-center">
        <p className="text-mint-dark italic text-sm leading-relaxed">"{versiculo.texto}"</p>
        <p className="text-mint-dark/70 text-xs mt-1">— {versiculo.referencia}</p>
      </div>

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
      </div>
    </Layout>
  )
}
