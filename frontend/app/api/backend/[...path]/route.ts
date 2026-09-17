import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const ACCESS_TOKEN_COOKIE = 'cebas_access_token'
const API_URL = process.env.API_URL

function getTargetUrl(path: string[], search: string) {
  if (!API_URL) throw new Error('A variável API_URL não está configurada.')
  const base = new URL(API_URL)
  const target = new URL(path.join('/'), `${base.toString().replace(/\/$/, '')}/`)
  target.search = search
  return target
}

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await context.params
    const targetUrl = getTargetUrl(path, request.nextUrl.search)
    const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value

    const headers = new Headers(request.headers)
    headers.delete('host')
    headers.delete('cookie')
    if (token) headers.set('authorization', `Bearer ${token}`)

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.arrayBuffer(),
      cache: 'no-store',
    })

    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type') ?? 'application/json',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível acessar a API.'
    return NextResponse.json({ message }, { status: 502 })
  }
}

export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const PATCH = proxy
export const DELETE = proxy
