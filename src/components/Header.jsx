import { useNavigate } from 'react-router-dom'

export default function Header({ instrumento }) {
  const navigate = useNavigate()
  const label = instrumento === 'violao' ? '🎸 Violão' : '🎹 Teclado'

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-2xl mx-auto px-5 h-16 flex items-center justify-between">
        <img
          src={`${import.meta.env.BASE_URL}icons/logo-essencia-tipo.png`}
          alt="ESSÊNCIA"
          onClick={() => {
              localStorage.removeItem('essencia_instrumento')
              navigate('/')
            }}
          style={{ height: '45px', width: 'auto', cursor: 'pointer' }}
        />

        <div className="flex items-center gap-3">
          {instrumento && (
            <span className="text-sm font-medium text-text-light">{label}</span>
          )}
          <button
            onClick={() => {
              localStorage.removeItem('essencia_instrumento')
              navigate('/')
            }}
            className="text-xs text-mint-dark border border-mint rounded-full px-3 py-1 hover:bg-mint-light transition-colors cursor-pointer"
            aria-label="Trocar instrumento"
          >
            Trocar
          </button>
        </div>
      </div>
    </header>
  )
}
