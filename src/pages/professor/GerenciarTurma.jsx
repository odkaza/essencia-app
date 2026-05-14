import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProfessorLayout from '../../components/ProfessorLayout'
import { useProfessor } from '../../hooks/useProfessor'
import { aulasViolao } from '../../data/aulas-violao'
import { aulasTeclado } from '../../data/aulas-teclado'

function formatarData(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  const diff = Math.floor((Date.now() - d) / 86400000)
  if (diff === 0) return 'Hoje'
  if (diff === 1) return 'Ontem'
  if (diff < 7) return `${diff} dias atrás`
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
}

function BarraProgresso({ valor, total }) {
  const pct = total > 0 ? (valor / total) * 100 : 0
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-mint rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-text-light tabular-nums shrink-0">{valor}/{total}</span>
    </div>
  )
}

export default function GerenciarTurma() {
  const { turmaId } = useParams()
  const navigate = useNavigate()
  const { buscarDetalheTurma } = useProfessor()

  const [turma, setTurma] = useState(null)
  const [alunos, setAlunos] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    buscarDetalheTurma(turmaId)
      .then(({ turma: t, alunos: a }) => {
        setTurma(t)
        setAlunos(a)
      })
      .catch(() => navigate('/professor', { replace: true }))
      .finally(() => setLoading(false))
  }, [turmaId, buscarDetalheTurma, navigate])

  async function copiarCodigo() {
    if (!turma) return
    await navigator.clipboard.writeText(turma.codigo)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  if (loading) {
    return (
      <ProfessorLayout>
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-mint border-t-transparent rounded-full animate-spin" />
        </div>
      </ProfessorLayout>
    )
  }

  if (!turma) return null

  const totalAulas = turma.instrumento === 'teclado' ? aulasTeclado.length : aulasViolao.length
  const INST_LABEL = { violao: '🎸 Violão', teclado: '🎹 Teclado' }

  return (
    <ProfessorLayout>
      <div className="py-4 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate('/professor')}
            className="mt-0.5 p-1.5 rounded-xl hover:bg-mint-light transition-colors shrink-0 text-mint-dark"
          >
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none">
              <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div>
            <span className="text-xs bg-mint-light text-mint-dark font-medium px-2 py-0.5 rounded-full">
              {INST_LABEL[turma.instrumento]}
            </span>
            <h1 className="text-xl font-bold text-mint-dark mt-1">{turma.nome}</h1>
          </div>
        </div>

        {/* Código de acesso */}
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center gap-3">
          <p className="text-xs text-text-light font-medium uppercase tracking-wide">Código de Acesso</p>
          <p className="text-5xl font-mono font-bold text-mint-dark tracking-[0.25em]">{turma.codigo}</p>
          <button
            onClick={copiarCodigo}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all ${
              copiado ? 'bg-mint-light text-mint-dark' : 'border border-mint-light text-mint-dark hover:bg-mint-light'
            }`}
          >
            {copiado ? '✅ Copiado!' : '📋 Copiar código'}
          </button>
          <p className="text-xs text-text-light text-center">
            Compartilhe este código com seus alunos para que eles entrem na turma.
          </p>
        </div>

        {/* Ações */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/professor/aviso?turma=${turma.id}`)}
            className="flex-1 py-3 rounded-2xl bg-mint text-white font-bold text-sm hover:bg-mint-dark transition-colors"
          >
            📢 Enviar Aviso
          </button>
          <button
            onClick={() => navigate('/professor/nova-turma')}
            className="flex-1 py-3 rounded-2xl border-2 border-mint-light text-mint-dark font-bold text-sm hover:bg-mint-light transition-colors"
          >
            + Nova Turma
          </button>
        </div>

        {/* Lista de alunos */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-mint-dark">Alunos</h2>
            <span className="text-xs text-text-light">{alunos.length} matriculado{alunos.length !== 1 ? 's' : ''}</span>
          </div>

          {alunos.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
              <p className="text-3xl mb-2">🎓</p>
              <p className="text-sm text-text-light">Nenhum aluno ainda. Compartilhe o código da turma!</p>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {alunos.map((aluno, i) => (
              <div
                key={aluno.id}
                className={`px-4 py-3.5 ${i < alunos.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-mint-dark truncate">{aluno.nome}</p>
                  <span className="text-xs text-text-light shrink-0">{formatarData(aluno.ultimoAcesso)}</span>
                </div>
                <BarraProgresso valor={aluno.aulasConc} total={totalAulas} />
                {aluno.aulasConc === totalAulas && (
                  <p className="text-xs text-mint-dark mt-0.5">🎉 Concluiu todas as aulas!</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProfessorLayout>
  )
}
