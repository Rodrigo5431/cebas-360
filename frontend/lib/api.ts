import { useEffect, useState } from 'react'
import { logoutAction } from '@/app/actions/auth'
import type { ApiState } from '@/types'

function mergeHeaders(headers?: HeadersInit) {
  return {
    'Content-Type': 'application/json',
    ...(headers || {}),
  }
}

/** Client-safe request. The same-origin proxy adds the HttpOnly JWT cookie server-side. */
export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `/api/proxy${path.startsWith('/') ? path : `/${path}`}`
  const headers = new Headers(mergeHeaders(options?.headers))

  const response = await fetch(url, {
    ...options,
    credentials: 'same-origin',
    headers,
  })

  if (response.status === 401 && typeof window !== 'undefined') {
    window.location.href = '/login'
  }

  return parseResponse<T>(response, url)
}

export const clientRequest = request

async function parseResponse<T>(response: Response, url: string): Promise<T> {
  const contentType = response.headers.get('content-type') || ''

  if (!response.ok) {
    const body = contentType.includes('application/json') ? await response.json().catch(() => null) : null
    const message = typeof body?.message === 'string' ? body.message : `Não foi possível acessar ${url} (${response.status}).`
    throw new Error(message)
  }

  if (contentType.includes('application/json')) return response.json()
  return (await response.text()) as T
}

export function useApi<T>(url: string, initial: T | null = null): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: initial,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    let active = true
    setState({ data: initial, isLoading: true, error: null })

    request<T>(url)
      .then((data) => active && setState({ data, isLoading: false, error: null }))
      .catch((error) =>
        active &&
        setState({
          data: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Erro inesperado ao carregar os dados.',
        })
      )

    return () => {
      active = false
    }
  }, [url])

  return state
}