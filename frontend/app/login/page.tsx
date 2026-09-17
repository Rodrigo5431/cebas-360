'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction, type LoginState } from '@/app/actions/auth'

const initialState: LoginState = {}

export default function LoginPage() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  useEffect(() => {
    if (state.success) router.replace('/')
  }, [router, state.success])

  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f2ea] px-5 py-10">
      <section className="w-full max-w-md rounded-2xl border border-[#ddd5c5] bg-[#fffdf9] p-8 shadow-[0_20px_60px_rgba(41,46,67,.10)] sm:p-10">
        <div className="mb-10 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center border border-[#c29121] font-serif text-2xl text-[#c29121]">C</div><div><b className="tracking-[.18em] text-[#172536]">COVAC</b><span className="block text-[10px] text-[#8192a2]">CEBAS Educação</span></div></div>
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#b18422]">Acesso seguro</p>
        <h1 className="mt-2 font-serif text-4xl text-[#292e43]">Bem-vindo de volta</h1>
        <p className="mt-3 text-sm leading-6 text-[#7d837e]">Entre para acompanhar a conformidade da sua instituição.</p>
        <div className="mt-6 rounded-lg border border-[#e4d5a8] bg-[#fff8df] px-4 py-3 text-sm text-[#6e5818]">
          <p className="font-semibold">Acesso de demonstração</p>
          <p className="mt-1 font-mono text-xs">admin@covac.com · senha123</p>
        </div>
        <form action={formAction} className="mt-8 space-y-5">
          <label className="block text-sm font-semibold text-[#303631]">Email<input name="email" type="email" autoComplete="email" required className="mt-2 w-full rounded-lg border border-[#d8d2c5] bg-white px-4 py-3 outline-none transition focus:border-[#c29121] focus:ring-2 focus:ring-[#c2912133]" /></label>
          <label className="block text-sm font-semibold text-[#303631]">Senha<input name="password" type="password" autoComplete="current-password" required className="mt-2 w-full rounded-lg border border-[#d8d2c5] bg-white px-4 py-3 outline-none transition focus:border-[#c29121] focus:ring-2 focus:ring-[#c2912133]" /></label>
          {state.error && <p role="alert" className="rounded-lg border border-[#e0b4ad] bg-[#fff4f1] px-4 py-3 text-sm text-[#9d4439]">{state.error}</p>}
          <button disabled={pending} className="w-full rounded-lg bg-[#b18416] px-4 py-3 font-semibold text-white transition hover:bg-[#946e0e] disabled:cursor-wait disabled:opacity-60">{pending ? 'Entrando...' : 'Entrar na plataforma'}</button>
        </form>
        <p className="mt-8 border-t border-[#eee8dd] pt-5 text-xs leading-5 text-[#92968f]">Sua sessão é protegida por cookie HttpOnly e não fica acessível ao JavaScript do navegador.</p>
      </section>
    </main>
  )
}
