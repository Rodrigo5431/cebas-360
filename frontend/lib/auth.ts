import { cookies } from 'next/headers'
import type { User } from '@/types'

export const ACCESS_TOKEN_COOKIE = 'cebas_access_token'

type JwtPayload = {
  sub?: string | number
  id?: string | number
  name?: string
  email?: string
  exp?: number
}

function decodePayload(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(Buffer.from(normalized, 'base64').toString('utf8')) as JwtPayload
  } catch {
    return null
  }
}

export function userFromToken(token: string | undefined): User | null {
  if (!token) return null
  const payload = decodePayload(token)
  if (!payload || (payload.exp && payload.exp * 1000 <= Date.now())) return null
  const id = payload.id ?? payload.sub
  if (!id || !payload.name || !payload.email) return null
  return { id: String(id), name: payload.name, email: payload.email }
}

export async function getSessionUser() {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value
  return userFromToken(token)
}

export function auditPayload(user: User) {
  return { auditor: { id: user.id, name: user.name, email: user.email } }
}

export function getTokenFromResponse(response: Response, body: unknown) {
  const authorization = response.headers.get('authorization')
  if (authorization?.toLowerCase().startsWith('bearer ')) return authorization.slice(7).trim()
  if (body && typeof body === 'object') {
    const record = body as Record<string, unknown>
    if (typeof record.token === 'string') return record.token
    if (typeof record.access_token === 'string') return record.access_token
  }
  return null
}
