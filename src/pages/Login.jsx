import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function traduzirErro(error) {
  const msg = error?.message ?? ''
  if (msg.includes('Invalid login credentials')) return 'Email ou senha incorretos.'
  if (msg.includes('Email not confirmed')) return 'Confirme seu email antes de entrar.'
  if (msg.includes('Too many requests')) return 'Muitas tentativas. Aguarde alguns minutos.'
  return 'Ocorreu um erro. Tente novamente.'
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await login(email, senha)
      navigate('/', { replace: true })
    } catch (err) {
      setErro(traduzirErro(err))
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-svh bg-mint-light flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <img
            src={`${import.meta.env.BASE_URL}icons/logo-essencia.png`}
            alt="ESSÊNCIA"
            style={{ maxWidth: '180px', width: '100%' }}
            className="mb-3"
          />
          <p className="text-mint-dark/70 text-sm">Adoração e Iniciação Musical</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-md px-8 py-8">
          <h1 className="text-2xl font-bold text-mint-dark mb-6 text-center">Entrar</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-light mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="seu@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-text text-sm focus:outline-none focus:border-mint focus:ring-2 focus:ring-mint/20 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-text-light mb-1">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-text text-sm focus:outline-none focus:border-mint focus:ring-2 focus:ring-mint/20 transition-colors"
              />
            </div>

            {erro && (
              <p className="text-sm text-red-500 text-center">{erro}</p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-mint text-white font-semibold rounded-xl py-3 mt-2 hover:bg-mint-dark transition-colors disabled:opacity-60 cursor-pointer"
            >
              {carregando ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-light mt-6">
          Primeira vez?{' '}
          <Link to="/cadastro" className="text-mint-dark font-semibold hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}
