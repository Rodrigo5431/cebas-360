'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { request } from '@/lib/api'
import type { User } from '@/types'

const SessionContext = createContext<{ user: User | null; isLoading: boolean }>({ 
  user: null, 
  isLoading: true 
})

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // A tipagem explícita <{ user: User }> na chamada e nos parâmetros 
    // do .then e .catch resolve o erro do TypeScript
    request<{ user: User }>('/api/auth/session')
      .then((data: { user: User }) => {
        setUser(data?.user ?? null)
      })
      .catch((error: unknown) => {
        console.error('Sessão não encontrada ou expirada:', error)
        setUser(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <SessionContext.Provider value={{ user, isLoading }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  return useContext(SessionContext)
}