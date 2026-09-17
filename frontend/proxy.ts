import { NextRequest, NextResponse } from 'next/server'

const COOKIE = 'cebas_access_token'

function hasValidExpiry(token: string) {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return typeof decoded.exp !== 'number' || decoded.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE)?.value
  if (token && hasValidExpiry(token)) return NextResponse.next()

  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('next', request.nextUrl.pathname)
  const response = NextResponse.redirect(loginUrl)
  if (token) response.cookies.delete(COOKIE)
  return response
}

export const config = {
  matcher: ['/((?!login|api/auth|api/backend|_next/static|_next/image|favicon.ico).*)'],
}
