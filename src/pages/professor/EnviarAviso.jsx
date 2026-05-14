import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ProfessorLayout from '../../components/ProfessorLayout'
import { useProfessor } from '../../hooks/useProfessor'

function formatarData(iso) {
  const d = new Date(iso)
  const diff = Math.floor((Date.now() - d) / 86400000)
  if (diff === 0) return 'Hoje'
  if (diff === 1) return 'Ontem'
  if (diff < 7) return `${diff} dias atrás`
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function EnviarAviso() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const turmaPreSelecionada = searchParams.get('turma')

  const { turmas, enviarAviso, buscarAvisosTurma } = useProfessor()

  const [turmaSelecionada, setTurmaSelecionada] = useState('')
  const [titulo, setTitulo] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [historico, setHistorico] = useState([])

  useEffect(() => {
    if (turmaPreSelecionada) {
      setTurmaSelecionada(turmaPreSelecionada)
    } else if (turmas.length > 0 && !turmaSelecionada) {
      setTurmaSelecionada(turmas[0].id)
    }
  }, [turmas, turmaPreSelecionada])

  useEffect(() => {
    if (!turmaSelecionada) return
    buscarAvisosTurma(turmaSelecionada).then(setHistorico)
  }, [turmaSelecionada, buscarAvisosTurma])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!turmaSelecionada) { setErro('Selecione uma turma'); return }
    if (!titulo.trim()) { setErro('Digite o título'); return }
    if (!mensagem.trim()) { setErro('Digite a mensagem'); return }
    setErro('')
    setEnviando(true)
    try {
      const novo = await enviarAviso(turmaSelecionada, titulo.trim(), mensagem.trim())
      setHistorico((prev) => [novo, ...prev])
      setTitulo('')
      setMensagem('')
      setSucesso(true)
      setTimeout(() => setSucesso(false), 3000)
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
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
          <h1 className="text-2xl font-bold text-mint-dark">Enviar Aviso</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Turma selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-mint-dark">Turma</label>
            {turmas.length === 0 ? (
              <p className="text-sm text-text-light">Você ainda não tem turmas.</p>
            ) : (
              <select
                value={turmaSelecionada}
                onChange={(e) => setTurmaSelecionada(e.target.value)}
                className="w-full border-2 border-mint-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mint bg-white"
              >
                {turmas.map((t) => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
            )}
          </div>

          {/* Título */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-mint-dark">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Próxima aula — Acordes de Ré"
              className="w-full border-2 border-mint-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mint"
            />
          </div>

          {/* Mensagem */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-mint-dark">Mensagem</label>
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Digite sua mensagem para os alunos…"
              rows={4}
              className="w-full border-2 border-mint-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mint resize-none"
            />
          </div>

          {erro && <p className="text-sm text-red-500 text-center">{erro}</p>}
          {sucesso && (
            <p className="text-sm text-mint-dark text-center font-semibold">✅ Aviso enviado com sucesso!</p>
          )}

          <button
            type="submit"
            disabled={enviando || turmas.length === 0}
            className="w-full py-4 rounded-2xl bg-mint text-white font-bold text-base hover:bg-mint-dark transition-colors disabled:opacity-60 shadow-sm"
          >
            {enviando ? 'Enviando…' : '📢 Enviar Aviso'}
          </button>
        </form>

        {/* Histórico */}
        {historico.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-bold text-mint-dark">Histórico de Avisos</h2>
            <div className="flex flex-col gap-3">
              {historico.map((aviso) => (
                <div key={aviso.id} className="bg-white rounded-2xl shadow-sm p-4 border-l-4 border-mint">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-mint-dark leading-snug">{aviso.titulo}</p>
                    <span className="text-xs text-text-light shrink-0">{formatarData(aviso.criado_em)}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{aviso.mensagem}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ProfessorLayout>
  )
}
