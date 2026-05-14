import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTurma } from '../hooks/useTurma'
import Layout from '../components/Layout'

const INSTRUMENTO_LABEL = { violao: '🎸 Violão', teclado: '🎹 Teclado' }

function CardTurma({ turma }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <p className="font-bold text-mint-dark">{turma.nome}</p>
        <span className="text-xs bg-mint-light text-mint-dark font-medium px-2 py-0.5 rounded-full">
          {INSTRUMENTO_LABEL[turma.instrumento] ?? turma.instrumento}
        </span>
      </div>
      <p className="text-xs text-text-light">Prof. {turma.professor_nome}</p>
      <p className="text-xs text-gray-300 font-mono mt-1 tracking-widest">{turma.codigo}</p>
    </div>
  )
}

function ModalEntrarTurma({ onEntrar, onFechar }) {
  const [codigo, setCodigo] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (codigo.length !== 6) {
      setErro('O código deve ter 6 caracteres')
      return
    }
    setErro('')
    setCarregando(true)
    try {
      await onEntrar(codigo)
      onFechar()
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-6">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col gap-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-mint-dark text-lg">Entrar com código</h2>
          <button onClick={onFechar} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <p className="text-sm text-text-light">Digite o código de 6 caracteres fornecido pelo seu professor.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
            placeholder="ABC123"
            className="w-full border-2 border-mint-light rounded-xl px-4 py-3 text-center text-xl font-mono tracking-widest focus:outline-none focus:border-mint"
            autoFocus
            autoComplete="off"
          />
          {erro && <p className="text-xs text-red-500 text-center">{erro}</p>}
          <button
            type="submit"
            disabled={carregando || codigo.length !== 6}
            className="w-full py-3 rounded-xl bg-mint text-white font-bold text-sm hover:bg-mint-dark transition-colors disabled:opacity-50"
          >
            {carregando ? 'Entrando…' : 'Entrar na Turma'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function MinhasTurmas({ instrumento }) {
  const navigate = useNavigate()
  const { turmas, loading, entrarNaTurma } = useTurma()
  const [modalAberto, setModalAberto] = useState(false)

  return (
    <Layout instrumento={instrumento}>
      <div className="py-4 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-xl hover:bg-mint-light transition-colors shrink-0 text-mint-dark"
          >
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none">
              <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-mint-dark">Minhas Turmas</h1>
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-3 border-mint border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && turmas.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <p className="text-4xl mb-3">🎓</p>
            <p className="font-semibold text-mint-dark">Você ainda não está em nenhuma turma</p>
            <p className="text-sm text-text-light mt-1">Peça o código ao seu professor e clique em "Entrar com código".</p>
          </div>
        )}

        {!loading && turmas.length > 0 && (
          <div className="flex flex-col gap-3">
            {turmas.map((t) => (
              <CardTurma key={t.id} turma={t} />
            ))}
          </div>
        )}

        <button
          onClick={() => setModalAberto(true)}
          className="w-full py-4 rounded-2xl text-sm font-bold border-2 border-mint text-mint-dark hover:bg-mint-light transition-colors"
        >
          + Entrar com código
        </button>
      </div>

      {modalAberto && (
        <ModalEntrarTurma
          onEntrar={entrarNaTurma}
          onFechar={() => setModalAberto(false)}
        />
      )}
    </Layout>
  )
}
