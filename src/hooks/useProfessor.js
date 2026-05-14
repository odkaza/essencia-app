import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function gerarCodigo() {
  return Array.from({ length: 6 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
}

export function useProfessor() {
  const { user } = useAuth()
  const [turmas, setTurmas] = useState([])
  const [loading, setLoading] = useState(false)

  const buscarTurmas = useCallback(async () => {
    if (!user) return []
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('turmas')
        .select('id, nome, instrumento, codigo, criado_em')
        .eq('professor_id', user.id)
        .order('criado_em', { ascending: false })
      if (error) throw error
      const lista = data ?? []
      setTurmas(lista)
      return lista
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) buscarTurmas()
    else setTurmas([])
  }, [user, buscarTurmas])

  const buscarDetalheTurma = useCallback(async (turmaId) => {
    const { data: turma, error } = await supabase
      .from('turmas')
      .select('id, nome, instrumento, codigo')
      .eq('id', turmaId)
      .eq('professor_id', user.id)
      .single()
    if (error) throw error

    const { data: membros } = await supabase
      .from('turma_membros')
      .select('aluno_id, entrou_em, profiles!turma_membros_aluno_id_fkey(nome)')
      .eq('turma_id', turmaId)

    const alunoIds = (membros ?? []).map((m) => m.aluno_id)
    const progMap = {}

    if (alunoIds.length > 0) {
      const { data: prog } = await supabase
        .from('progresso')
        .select('user_id, aula_id, concluida_em')
        .in('user_id', alunoIds)
        .eq('instrumento', turma.instrumento)

      for (const p of prog ?? []) {
        if (!progMap[p.user_id]) progMap[p.user_id] = { count: 0, ultimoAcesso: null }
        progMap[p.user_id].count++
        if (!progMap[p.user_id].ultimoAcesso || p.concluida_em > progMap[p.user_id].ultimoAcesso) {
          progMap[p.user_id].ultimoAcesso = p.concluida_em
        }
      }
    }

    const alunos = (membros ?? []).map((m) => ({
      id: m.aluno_id,
      nome: m.profiles?.nome ?? '—',
      entrou_em: m.entrou_em,
      aulasConc: progMap[m.aluno_id]?.count ?? 0,
      ultimoAcesso: progMap[m.aluno_id]?.ultimoAcesso ?? null,
    }))

    return { turma, alunos }
  }, [user])

  const criarTurma = useCallback(async (nome, instrumento) => {
    const codigo = gerarCodigo()
    const { data, error } = await supabase
      .from('turmas')
      .insert({ nome, instrumento, codigo, professor_id: user.id })
      .select()
      .single()
    if (error) throw error
    await buscarTurmas()
    return data
  }, [user, buscarTurmas])

  const enviarAviso = useCallback(async (turmaId, titulo, mensagem) => {
    const { data, error } = await supabase
      .from('avisos')
      .insert({ turma_id: turmaId, titulo, mensagem })
      .select()
      .single()
    if (error) throw error
    return data
  }, [])

  const buscarAvisosTurma = useCallback(async (turmaId) => {
    const { data, error } = await supabase
      .from('avisos')
      .select('id, titulo, mensagem, criado_em')
      .eq('turma_id', turmaId)
      .order('criado_em', { ascending: false })
      .limit(10)
    if (error) return []
    return data ?? []
  }, [])

  return { turmas, loading, buscarTurmas, buscarDetalheTurma, criarTurma, enviarAviso, buscarAvisosTurma }
}
