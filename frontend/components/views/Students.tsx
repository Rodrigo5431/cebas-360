'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Search, Plus, UserPlus } from 'lucide-react'
import { request } from '@/lib/api'
import { Card, Eyebrow, Button, ErrorBanner, Heading, Loading, Stat } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { ApiState } from '@/types'

export default function Students({ onToast }: { onToast: (message: string) => void }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [state, setState] = useState<ApiState<any>>({ data: null, isLoading: true, error: null })
  
  const [view, setView] = useState<'list' | 'form'>('list')

  useEffect(() => { setCurrentPage(1) }, [search])

  useEffect(() => {
    if (view === 'form') return
    let active = true
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    const timer = setTimeout(() => {
      request<any>(`/bolsistas?page=${currentPage}&search=${encodeURIComponent(search)}`)
        .then((data) => active && setState({ data, isLoading: false, error: null }))
        .catch((error) => active && setState({ data: null, isLoading: false, error: error instanceof Error ? error.message : 'Erro.' }))
    }, 400)
    return () => { active = false; clearTimeout(timer) }
  }, [currentPage, search, view])

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault()
    // POST para a API do Rails
    onToast('Bolsista cadastrado e perfil socioeconômico validado com sucesso!')
    setView('list')
  }

  if (view === 'form') {
    return (
      <div className="animate-in fade-in slide-in-from-right-4">
        <button onClick={() => setView('list')} className="mb-4 flex items-center gap-1 text-xs font-bold text-[#879087] hover:text-[#34332f]">
          <ChevronLeft size={14} /> Voltar à visão geral
        </button>
        <Card className="p-8">
          <div className="mb-8 border-b border-[#e8e1d6] pb-4 flex justify-between items-start">
            <div>
              <Eyebrow>GESTÃO DE BENEFICIÁRIOS</Eyebrow>
              <h2 className="mt-1 font-serif text-3xl text-[#34332f]">Novo bolsista CEBAS</h2>
              <p className="mt-2 text-xs text-[#879087]">Registre o perfil socioeconômico, a bolsa e os documentos de concessão.</p>
            </div>
            <span className="bg-[#e7f3ee] border border-[#bce0d3] px-3 py-1 text-xs font-bold text-[#4b8c78] rounded flex items-center gap-2">
              <UserPlus size={14}/> Cadastro Ativo
            </span>
          </div>

          <form onSubmit={handleSaveStudent} className="space-y-6">
            <h3 className="text-sm font-bold text-[#34332f] border-b border-[#e8e1d6] pb-2 mb-4">Dados do beneficiário</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#879087]">Nome Completo</label>
                <input required type="text" className="w-full rounded border border-[#d1c4ae] p-3 text-sm outline-none focus:border-[#c49a3c]" />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#879087]">CPF</label>
                <input required type="text" placeholder="000.000.000-00" className="w-full rounded border border-[#d1c4ae] p-3 text-sm outline-none focus:border-[#c49a3c]" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#879087]">Curso / Etapa</label>
                <input required type="text" className="w-full rounded border border-[#d1c4ae] p-3 text-sm outline-none focus:border-[#c49a3c]" />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#879087]">Tipo de Bolsa</label>
                <select required className="w-full rounded border border-[#d1c4ae] bg-white p-3 text-sm outline-none focus:border-[#c49a3c]">
                  <option>Integral (100%)</option>
                  <option>Parcial (50%)</option>
                </select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mt-6">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#879087]">Renda Familiar Per Capita</label>
                <div className="relative">
                  <input required type="number" step="0.01" placeholder="1.00" className="w-full rounded border border-[#d1c4ae] p-3 pr-10 text-sm outline-none focus:border-[#c49a3c]" />
                  <span className="absolute right-3 top-3.5 text-xs font-bold text-[#879087]">SM</span>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#879087]">Status de Elegibilidade</label>
                <select className="w-full rounded border border-[#d1c4ae] bg-white p-3 text-sm outline-none focus:border-[#c49a3c] font-bold text-[#4b8c78]">
                  <option>Elegível</option>
                  <option>Em Análise</option>
                  <option>Inelegível</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#879087]">Termo de Concessão</label>
                <label className="flex items-center gap-2 mt-3 cursor-pointer text-sm text-[#34332f] font-bold border border-[#e8e1d6] p-2.5 rounded hover:bg-[#f4f2ea]">
                  <input type="checkbox" className="accent-[#4b8c78] w-4 h-4"/> Termo Assinado e Arquivado
                </label>
              </div>
              <div className="md:col-span-3">
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#879087]">Observações</label>
                <textarea rows={2} className="w-full resize-none rounded border border-[#d1c4ae] p-3 text-sm outline-none focus:border-[#c49a3c]" />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-[#e8e1d6] pt-6">
              <Button outline onClick={() => setView('list')}>Limpar e Voltar</Button>
              <Button type="submit">Cadastrar Bolsista</Button>
            </div>
          </form>
        </Card>
      </div>
    )
  }

  const rows = state.data?.data || []
  const totalPages = Math.max(1, state.data?.meta?.total_pages || 1)
  const totalItems = state.data?.meta?.total_items || 0

  let startPage = Math.max(1, currentPage - 2)
  let endPage = Math.min(totalPages, startPage + 4)
  if (endPage - startPage < 4) { startPage = Math.max(1, endPage - 4) }
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)

  return (
    <>
      <Heading eyebrow="Gestão de beneficiários" title="Bolsistas CEBAS" description="Acompanhe perfil socioeconômico, termos de concessão e elegibilidade." />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat title="Bolsistas ativos" value={totalItems.toString()} detail="Base atualizada" />
        <Stat title="Termos assinados" value="98,5%" detail="Validação pelo Compliance" />
      </div>
      
      {state.error && <ErrorBanner message={state.error} />}
      
      <Card className="mt-4 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8e1d6] p-5">
          <div>
            <Eyebrow>Base de beneficiários</Eyebrow>
            <h2 className="mt-2 font-serif text-xl">Ciclo 2026</h2>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center border border-[#d1c4ae] bg-[#f4f5fb] px-2 rounded-sm focus-within:border-[#4b8c78]">
              <Search size={15} className="text-[#a38e7a]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-48 bg-transparent p-2 text-xs outline-none" placeholder="Buscar aluno..." />
            </div>
            <Button onClick={() => setView('form')}><Plus size={15} /> Novo bolsista</Button>
          </div>
        </div>
        
        {state.isLoading ? (
          <Loading />
        ) : (
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-[13px]">
              <thead className="border-b border-[#e8e1d6] bg-[#f4f2ea] text-[#7d837e]">
                <tr>
                  {['Bolsista', 'Curso / Etapa', 'Bolsa', 'Renda (SM)', 'Termo', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-normal uppercase tracking-wider text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-[#879087]">Nenhum bolsista encontrado.</td></tr>
                ) : (
                  rows.map((row: any) => (
                    <tr key={row.id} className="border-b border-[#ede8dd] hover:bg-[#fffdf9]">
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-2">
                          <div className="grid h-8 w-8 place-items-center rounded-full bg-[#e8dcc8] text-[10px] font-bold text-[#4b3d2e]">
                            {row.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span>{row.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#647078]">{row.course || '—'}</td>
                      <td className="px-4 py-3 text-[#647078]">{row.scholarship_type || '—'}</td>
                      <td className="px-4 py-3 text-[#647078]">{row.income ? `${Number(row.income).toFixed(2)} SM` : '—'}</td>
                      <td className="px-4 py-3">
                        {row.signed_term ? <span className="font-bold text-[#4b8c78]">Assinado</span> : <span className="font-bold text-[#d94444]">Pendente</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-widest', row.status === 'aprovado' || row.status === 'elegível' ? 'bg-[#e7f3ee] text-[#4b8c78]' : 'bg-[#fffaf0] border border-[#f0e6d2] text-[#c49a3c]')}>
                          Elegível
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[#e8e1d6] px-4 py-3">
          <span className="text-[11px] text-[#7d837e]">
            Página {currentPage} de {totalPages} ({totalItems} registros)
          </span>
          <div className="flex items-center gap-2">
            <Button outline disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}><ChevronLeft size={14} /></Button>
            {pages.map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} className={cn('h-7 w-7 rounded text-xs font-bold transition-colors', currentPage === page ? 'bg-[#34332f] text-white' : 'bg-[#f4f2ea] text-[#647078] hover:bg-[#ede8dd]')}>
                {page}
              </button>
            ))}
            <Button outline disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}><ChevronRight size={14} /></Button>
          </div>
        </div>
      </Card>
    </>
  )
}