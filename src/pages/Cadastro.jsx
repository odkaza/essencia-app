import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function traduzirErro(error) {
  const msg = error?.message ?? ''
  if (msg.includes('already registered') || msg.includes('User already registered')) return 'Este email já está cadastrado.'
  if (msg.includes('Password should be at least') || msg.includes('weak_password')) return 'A senha deve ter no mínimo 6 caracteres.'
  if (msg.includes('invalid') || msg.includes('email')) return 'Email inválido.'
  return 'Ocorreu um erro. Tente novamente.'
}

export default function Cadastro() {
  const { cadastro } = useAuth()
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [papel, setPapel] = useState('aluno')
  const [codigoTurma, setCodigoTurma] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }
    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    setCarregando(true)
    try {
      await cadastro(nome, email, senha, papel, codigoTurma)
      navigate('/', { replace: true })
    } catch (err) {
      setErro(traduzirErro(err))
    } finally {
      setCarregando(false)
    }
  }

  const inputClass =
    'w-full border border-gray-200 rounded-xl px-4 py-3 text-text text-sm focus:outline-none focus:border-mint focus:ring-2 focus:ring-mint/20 transition-colors'

  return (
    <div className="min-h-svh bg-mint-light flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={`${import.meta.env.BASE_URL}icons/logo-essencia.png`}
            alt="ESSÊNCIA"
            style={{ maxWidth: '160px', width: '100%' }}
            className="mb-3"
          />
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-md px-8 py-8">
          <h1 className="text-2xl font-bold text-mint-dark mb-6 text-center">Criar conta</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Nome */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-text-light mb-1">
                Nome completo
              </label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                autoComplete="name"
                placeholder="Seu nome"
                className={inputClass}
              />
            </div>

            {/* Email */}
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
                className={inputClass}
              />
            </div>

            {/* Senha */}
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
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                className={inputClass}
              />
            </div>

            {/* Confirmar senha */}
            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-text-light mb-1">
                Confirmar senha
              </label>
              <input
                id="confirmarSenha"
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Repita a senha"
                className={inputClass}
              />
            </div>

            {/* Papel selector */}
            <div>
              <p className="text-sm font-medium text-text-light mb-2">Sou</p>
              <div className="flex gap-2">
                {['aluno', 'professor'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPapel(p)}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer capitalize ${
                      papel === p
                        ? 'bg-mint text-white border-mint'
                        : 'border-gray-200 text-text-light hover:border-mint'
                    }`}
                  >
                    {p === 'aluno' ? 'Aluno' : 'Professor'}
                  </button>
                ))}
              </div>
            </div>

            {/* Código da turma — apenas aluno */}
            {papel === 'aluno' && (
              <div>
                <label htmlFor="codigoTurma" className="block text-sm font-medium text-text-light mb-1">
                  Código da turma{' '}
                  <span className="text-xs text-text-light/60">(opcional)</span>
                </label>
                <input
                  id="codigoTurma"
                  type="text"
                  value={codigoTurma}
                  onChange={(e) => setCodigoTurma(e.target.value)}
                  placeholder="Ex: TURMA-2024"
                  className={inputClass}
                />
              </div>
            )}

            {erro && (
              <p className="text-sm text-red-500 text-center">{erro}</p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-mint text-white font-semibold rounded-xl py-3 mt-2 hover:bg-mint-dark transition-colors disabled:opacity-60 cursor-pointer"
            >
              {carregando ? 'Criando conta…' : 'Criar conta'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-light mt-6">
          Já tenho conta.{' '}
          <Link to="/login" className="text-mint-dark font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
