import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export function useTurma() {
  const { user } = useAuth()
  const [turmas, setTurmas] = useState([])
  const [loading, setLoading] = useState(false)

  const buscarMinhasTurmas = useCallback(async () => {
    if (!user) return []
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('turma_membros')
        .select(`
          turmas (
            id, nome, instrumento, codigo,
            professor:profiles!turmas_professor_id_fkey (nome)
          )
        `)
        .eq('aluno_id', user.id)
      if (error) throw error
      const lista = (data ?? [])
        .map((m) => m.turmas)
        .filter(Boolean)
        .map((t) => ({ ...t, professor_nome: t.professor?.nome ?? '—' }))
      setTurmas(lista)
      return lista
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) buscarMinhasTurmas()
    else setTurmas([])
  }, [user, buscarMinhasTurmas])

  const entrarNaTurma = useCallback(async (codigo) => {
    if (!user) throw new Error('Faça login para entrar em uma turma')

    const { data: turma, error: errTurma } = await supabase
      .from('turmas')
      .select('id, nome, instrumento')
      .eq('codigo', codigo.toUpperCase())
      .single()
    if (errTurma || !turma) throw new Error('Código de turma inválido')

    const { data: existing } = await supabase
      .from('turma_membros')
      .select('turma_id')
      .eq('turma_id', turma.id)
      .eq('aluno_id', user.id)
      .maybeSingle()
    if (existing) throw new Error('Você já está nessa turma')

    const { error: errInsert } = await supabase
      .from('turma_membros')
      .insert({ turma_id: turma.id, aluno_id: user.id })
    if (errInsert) throw errInsert

    await buscarMinhasTurmas()
    return turma
  }, [user, buscarMinhasTurmas])

  const buscarAvisos = useCallback(async (turmaId) => {
    const { data, error } = await supabase
      .from('avisos')
      .select('id, titulo, mensagem, criado_em')
      .eq('turma_id', turmaId)
      .order('criado_em', { ascending: false })
      .limit(3)
    if (error) return []
    return data ?? []
  }, [])

  return { turmas, loading, buscarMinhasTurmas, entrarNaTurma, buscarAvisos }
}
