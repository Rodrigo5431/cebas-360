import Link from 'next/link'
import { ArrowLeft, FileQuestion, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f5f1e8] px-6 py-12 text-[#292e43] sm:px-10 lg:px-16">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
        <section className="w-full rounded-2xl border border-[#e1dbce] bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#f6ecd0] text-[#b18420]">
            <FileQuestion size={30} aria-hidden="true" />
          </div>
          <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.22em] text-[#b18420]">CEBAS 360</p>
          <h1 className="mt-3 font-serif text-4xl text-[#292e43] sm:text-5xl">Página não encontrada</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#778078]">
            A página, documento ou bolsista que você procura não está disponível ou foi movido para outro endereço.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#c29121] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#c29121] focus:ring-offset-2"
          >
            <Home size={15} aria-hidden="true" />
            Voltar para o início
          </Link>
          <Link href="/" className="mx-auto mt-5 flex w-fit items-center gap-1 text-xs font-semibold text-[#8b6b25] hover:underline">
            <ArrowLeft size={13} aria-hidden="true" />
            Retornar ao painel
          </Link>
        </section>
      </div>
    </main>
  )
}
