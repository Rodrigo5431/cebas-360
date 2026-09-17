import { cookies } from 'next/headers'

const ACCESS_TOKEN_COOKIE = 'cebas_access_token'

export async function serverRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value
  const response = await fetch(url, {
    ...options,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  })

  const contentType = response.headers.get('content-type') || ''
  if (!response.ok) {
    const body = contentType.includes('application/json') ? await response.json().catch(() => null) : null
    const message = typeof body?.message === 'string' ? body.message : `Não foi possível acessar ${url} (${response.status}).`
    throw new Error(message)
  }

  if (contentType.includes('application/json')) return response.json()
  return (await response.text()) as T
}
