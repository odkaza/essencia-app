import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfessorLayout from '../../components/ProfessorLayout'
import { useAuth } from '../../contexts/AuthContext'
import { useProfessor } from '../../hooks/useProfessor'
import { supabase } from '../../lib/supabase'

const INST_LABEL = { violao: '🎸 Violão', teclado: '🎹 Teclado' }

function CardStat({ valor, label, cor }) {
  return (
    <div className={`flex-1 rounded-2xl p-4 text-center ${cor}`}>
      <p className="text-3xl font-bold text-mint-dark">{valor}</p>
      <p className="text-xs text-text-light mt-1">{label}</p>
    </div>
  )
}

export default function PainelProfessor() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { turmas, loading, buscarTurmas } = useProfessor()
  const [totalAlunos, setTotalAlunos] = useState(0)

  useEffect(() => {
    if (!turmas.length) return
    const ids = turmas.map((t) => t.id)
    supabase
      .from('turma_membros')
      .select('aluno_id')
      .in('turma_id', ids)
      .then(({ data }) => {
        const unicos = new Set((data ?? []).map((m) => m.aluno_id))
        setTotalAlunos(unicos.size)
      })
  }, [turmas])

  return (
    <ProfessorLayout>
      <div className="py-4 flex flex-col gap-6">
        {/* Saudação */}
        <div>
          <p className="text-sm text-text-light">Painel do Professor</p>
          <h1 className="text-2xl font-bold text-mint-dark mt-0.5">
            Olá, {profile?.nome?.split(' ')[0] ?? 'Professor'}! 👋
          </h1>
        </div>

        {/* Stats */}
        <div className="flex gap-3">
          <CardStat valor={turmas.length} label="Turmas ativas" cor="bg-mint-light" />
          <CardStat valor={totalAlunos} label="Alunos no total" cor="bg-white shadow-sm" />
        </div>

        {/* Ações rápidas */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/professor/nova-turma')}
            className="flex-1 py-3 rounded-2xl bg-mint text-white font-bold text-sm hover:bg-mint-dark transition-colors shadow-sm"
          >
            + Nova Turma
          </button>
          <button
            onClick={() => navigate('/professor/aviso')}
            className="flex-1 py-3 rounded-2xl border-2 border-mint-light text-mint-dark font-bold text-sm hover:bg-mint-light transition-colors"
          >
            📢 Enviar Aviso
          </button>
        </div>

        {/* Lista de turmas */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-mint-dark">Suas Turmas</h2>

          {loading && (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-4 border-mint border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && turmas.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
              <p className="text-4xl mb-3">🏫</p>
              <p className="font-semibold text-mint-dark">Nenhuma turma ainda</p>
              <p className="text-sm text-text-light mt-1">Crie sua primeira turma para começar.</p>
            </div>
          )}

          {turmas.map((turma) => (
            <button
              key={turma.id}
              onClick={() => navigate(`/professor/turma/${turma.id}`)}
              className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3 text-left hover:shadow-md transition-shadow w-full"
            >
              <div className="w-10 h-10 rounded-xl bg-mint-light flex items-center justify-center text-xl shrink-0">
                {turma.instrumento === 'teclado' ? '🎹' : '🎸'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-mint-dark truncate">{turma.nome}</p>
                <p className="text-xs text-text-light">{INST_LABEL[turma.instrumento]} · Código: {turma.codigo}</p>
              </div>
              <span className="text-gray-300 text-lg shrink-0">›</span>
            </button>
          ))}
        </div>
      </div>
    </ProfessorLayout>
  )
}
