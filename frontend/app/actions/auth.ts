'use server'

import { cookies } from 'next/headers'
import { ACCESS_TOKEN_COOKIE, getTokenFromResponse } from '@/lib/auth'
const API_URL = process.env.API_URL
const LOGIN_PATH = process.env.API_LOGIN_PATH ?? '/login'

export type LoginState = {
  error?: string
  success?: boolean
}

function getApiUrl(path: string) {
  if (!API_URL) throw new Error('A variável API_URL não está configurada.')
  return new URL(path, API_URL).toString()
}

export async function loginAction(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) return { error: 'Informe seu email e sua senha.' }

  let response: Response
  try {
    response = await fetch(getApiUrl(LOGIN_PATH), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    })
  } catch {
    return { error: 'Não foi possível conectar ao serviço de autenticação.' }
  }

  if (!response.ok) return { error: 'Email ou senha inválidos.' }

  const body = await response.clone().json().catch(() => null)
  const token = getTokenFromResponse(response, body)
  if (!token) return { error: 'A resposta de login não contém um token válido.' }

  const cookieStore = await cookies()
  cookieStore.set(ACCESS_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  })

  return { success: true }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(ACCESS_TOKEN_COOKIE)
}
