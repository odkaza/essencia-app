import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const storageKey = (instrumento) => `essencia_progresso_${instrumento}`

function lerLocal(instrumento) {
  try { return JSON.parse(localStorage.getItem(storageKey(instrumento)) ?? '[]') }
  catch { return [] }
}

export function useProgresso(instrumento) {
  const { user } = useAuth()
  const [concluidas, setConcluidas] = useState(() => lerLocal(instrumento))
  const [sincronizando, setSincronizando] = useState(false)

  useEffect(() => {
    if (!instrumento) return

    const local = lerLocal(instrumento)
    setConcluidas(local)

    if (!user) return

    supabase
      .from('progresso')
      .select('aula_id')
      .eq('user_id', user.id)
      .eq('instrumento', instrumento)
      .then(({ data }) => {
        const remoto = data?.map((r) => r.aula_id) ?? []
        const merged = [...new Set([...local, ...remoto])]
        setConcluidas(merged)

        // Migrate local-only items to Supabase
        const soLocal = local.filter((id) => !remoto.includes(id))
        soLocal.forEach((aulaId) =>
          supabase.from('progresso').upsert(
            { user_id: user.id, instrumento, aula_id: aulaId },
            { onConflict: 'user_id,instrumento,aula_id' }
          )
        )
      })
  }, [user, instrumento])

  const marcarConcluida = useCallback(
    async (aulaId) => {
      if (concluidas.includes(aulaId)) return

      const novas = [...concluidas, aulaId]
      setConcluidas(novas)
      localStorage.setItem(storageKey(instrumento), JSON.stringify(novas))

      if (!user) return

      setSincronizando(true)
      try {
        await supabase.from('progresso').upsert(
          { user_id: user.id, instrumento, aula_id: aulaId },
          { onConflict: 'user_id,instrumento,aula_id' }
        )
      } finally {
        setSincronizando(false)
      }
    },
    [concluidas, user, instrumento]
  )

  return { concluidas, marcarConcluida, sincronizando }
}
