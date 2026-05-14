import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

const TOOLS_VIOLAO = [
  {
    slug: 'metronomo',
    label: 'Metrônomo',
    descricao: 'Marque o tempo com BPM ajustável',
    icon: (
      <svg viewBox="0 0 40 40" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Pendulum body */}
        <polygon points="20,4 30,36 10,36" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
        {/* Pendulum rod */}
        <line x1="20" y1="4" x2="20" y2="36" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
        {/* Weight */}
        <rect x="15" y="16" width="10" height="5" rx="2" fill="currentColor" />
        {/* Base */}
        <line x1="8" y1="36" x2="32" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    slug: 'afinador',
    label: 'Afinador',
    descricao: 'Afine as cordas com o microfone',
    violaoOnly: true,
    icon: (
      <svg viewBox="0 0 40 40" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Tuning fork shape */}
        <line x1="20" y1="36" x2="20" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 8 C14 8 14 20 20 20 C26 20 26 8 26 8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        <line x1="14" y1="8" x2="14" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="26" y1="8" x2="26" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    slug: 'campo-harmonico',
    label: 'Campo Harmônico',
    descricao: 'Explore os acordes de cada tonalidade',
    icon: (
      <svg viewBox="0 0 40 40" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Staff lines */}
        {[8, 14, 20, 26, 32].map((y) => (
          <line key={y} x1="4" y1={y} x2="36" y2={y} stroke="currentColor" strokeWidth="1.2" />
        ))}
        {/* Notes */}
        <ellipse cx="12" cy="26" rx="3.5" ry="2.5" fill="currentColor" />
        <line x1="15.5" y1="26" x2="15.5" y2="12" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="22" cy="20" rx="3.5" ry="2.5" fill="currentColor" />
        <line x1="25.5" y1="20" x2="25.5" y2="6" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="32" cy="14" rx="3.5" ry="2.5" fill="currentColor" />
        <line x1="28.5" y1="14" x2="28.5" y2="28" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    slug: 'acordes',
    label: 'Diagramas de Acordes',
    descricao: 'Consulte a posição dos acordes',
    icon: (
      <svg viewBox="0 0 40 40" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Fretboard grid */}
        {[8, 16, 24, 32].map((y) => (
          <line key={y} x1="8" y1={y} x2="32" y2={y} stroke="currentColor" strokeWidth="1.5" />
        ))}
        {[8, 15, 22, 29, 32].map((x, i) => (
          <line key={i} x1={x} y1="8" x2={x} y2="32" stroke="currentColor" strokeWidth={i === 0 || i === 4 ? 2 : 1} />
        ))}
        {/* Dots */}
        <circle cx="15" cy="12" r="3" fill="currentColor" />
        <circle cx="22" cy="20" r="3" fill="currentColor" />
        <circle cx="15" cy="28" r="3" fill="currentColor" />
      </svg>
    ),
  },
]

const TOOLS_TECLADO = TOOLS_VIOLAO.filter((t) => !t.violaoOnly)

export default function Ferramentas({ instrumento }) {
  const navigate = useNavigate()
  const tools = instrumento === 'teclado' ? TOOLS_TECLADO : TOOLS_VIOLAO

  return (
    <Layout instrumento={instrumento}>
      <div className="py-4">
        <h1 className="text-2xl font-bold text-mint-dark mb-1">Ferramentas</h1>
        <p className="text-sm text-text-light mb-6">
          {instrumento === 'teclado' ? 'Recursos para teclado' : 'Recursos para violão'}
        </p>

        <div className="flex flex-col gap-3">
          {tools.map((tool) => (
            <button
              key={tool.slug}
              onClick={() => navigate(`/${instrumento}/ferramentas/${tool.slug}`)}
              className="
                flex items-center gap-4 w-full
                bg-white rounded-2xl p-5 shadow-sm
                border-2 border-transparent
                hover:border-mint hover:shadow-md hover:-translate-y-0.5
                active:scale-98
                transition-all duration-150
                text-left
              "
            >
              <div className="text-mint shrink-0">
                {tool.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-mint-dark">{tool.label}</span>
                  {tool.violaoOnly && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-mint-light text-mint-dark">
                      Violão
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-light mt-0.5">{tool.descricao}</p>
              </div>
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" className="text-mint shrink-0">
                <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  )
}
