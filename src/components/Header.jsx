import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header({ instrumento }) {
  const navigate = useNavigate()
  const { profile, logout } = useAuth()
  const label = instrumento === 'violao' ? '🎸 Violão' : '🎹 Teclado'

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

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

        <div className="flex items-center gap-2">
          {instrumento && (
            <span className="text-sm font-medium text-text-light">{label}</span>
          )}
          {profile?.papel === 'professor' && (
            <button
              onClick={() => navigate('/professor')}
              className="text-xs text-amber-600 border border-amber-400 rounded-full px-3 py-1 hover:bg-amber-50 transition-colors cursor-pointer"
              aria-label="Painel do professor"
            >
              Painel do Professor
            </button>
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
          <button
            onClick={handleLogout}
            className="text-xs text-text-light border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-50 transition-colors cursor-pointer"
            aria-label="Sair da conta"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  )
}
