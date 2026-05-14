import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfessorLayout from '../../components/ProfessorLayout'
import { useProfessor } from '../../hooks/useProfessor'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
function gerarCodigo() {
  return Array.from({ length: 6 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
}

export default function NovaTurma() {
  const navigate = useNavigate()
  const { criarTurma } = useProfessor()

  const [nome, setNome] = useState('')
  const [instrumento, setInstrumento] = useState('violao')
  const [codigo, setCodigo] = useState(() => gerarCodigo())
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nome.trim()) { setErro('Digite o nome da turma'); return }
    setErro('')
    setSalvando(true)
    try {
      await criarTurma(nome.trim(), instrumento)
      navigate('/professor')
    } catch (err) {
      setErro(err.message)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <ProfessorLayout>
      <div className="py-4 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/professor')}
            className="p-1.5 rounded-xl hover:bg-mint-light transition-colors shrink-0 text-mint-dark"
          >
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none">
              <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-mint-dark">Nova Turma</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nome */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-mint-dark">Nome da turma</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Violão Iniciantes 2025"
              className="w-full border-2 border-mint-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mint"
              autoFocus
            />
          </div>

          {/* Instrumento */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-mint-dark">Instrumento</label>
            <div className="flex gap-3">
              {[
                { val: 'violao', label: '🎸 Violão' },
                { val: 'teclado', label: '🎹 Teclado' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setInstrumento(val)}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-colors ${
                    instrumento === val
                      ? 'bg-mint border-mint text-white'
                      : 'border-mint-light text-mint-dark hover:bg-mint-light'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Código gerado */}
          <div className="bg-mint-light rounded-2xl p-5 flex flex-col items-center gap-3">
            <p className="text-xs text-text-light font-medium uppercase tracking-wide">Código de Acesso</p>
            <p className="text-4xl font-mono font-bold text-mint-dark tracking-[0.3em]">{codigo}</p>
            <button
              type="button"
              onClick={() => setCodigo(gerarCodigo())}
              className="text-xs text-mint-dark underline underline-offset-2"
            >
              Gerar novo código
            </button>
          </div>

          {erro && <p className="text-sm text-red-500 text-center">{erro}</p>}

          <button
            type="submit"
            disabled={salvando}
            className="w-full py-4 rounded-2xl bg-mint text-white font-bold text-base hover:bg-mint-dark transition-colors disabled:opacity-60 shadow-sm"
          >
            {salvando ? 'Criando turma…' : 'Criar Turma'}
          </button>
        </form>
      </div>
    </ProfessorLayout>
  )
}
