import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const storageKey = (instrumento) => `essencia_quiz_${instrumento}`

function lerLocal(instrumento) {
  try { return JSON.parse(localStorage.getItem(storageKey(instrumento)) ?? '{}') }
  catch { return {} }
}

export function useQuiz(instrumento) {
  const { user } = useAuth()
  const [scores, setScores] = useState(() => lerLocal(instrumento))

  useEffect(() => {
    if (!instrumento) return

    setScores(lerLocal(instrumento))

    if (!user) return

    supabase
      .from('quiz_resultados')
      .select('aula_id, acertos, total, criado_em')
      .eq('user_id', user.id)
      .eq('instrumento', instrumento)
      .order('criado_em', { ascending: true })
      .then(({ data }) => {
        if (!data?.length) return
        const map = {}
        for (const r of data) {
          const prev = map[r.aula_id]
          map[r.aula_id] = {
            melhor:     Math.max(prev?.melhor ?? 0, r.acertos),
            ultimo:     r.acertos,
            tentativas: (prev?.tentativas ?? 0) + 1,
          }
        }
        setScores(map)
      })
  }, [user, instrumento])

  const salvarScore = useCallback(
    async (aulaId, acertos, total) => {
      setScores((prev) => {
        const p = prev[aulaId] ?? { melhor: 0, tentativas: 0 }
        return {
          ...prev,
          [aulaId]: {
            melhor:     Math.max(p.melhor, acertos),
            ultimo:     acertos,
            tentativas: p.tentativas + 1,
          },
        }
      })

      if (!user) {
        const local = lerLocal(instrumento)
        const p     = local[aulaId] ?? { melhor: 0, tentativas: 0 }
        local[aulaId] = {
          melhor:     Math.max(p.melhor, acertos),
          ultimo:     acertos,
          tentativas: p.tentativas + 1,
        }
        localStorage.setItem(storageKey(instrumento), JSON.stringify(local))
        return
      }

      await supabase.from('quiz_resultados').insert({
        user_id: user.id,
        instrumento,
        aula_id: aulaId,
        acertos,
        total,
      })
    },
    [user, instrumento]
  )

  return { scores, salvarScore }
}
