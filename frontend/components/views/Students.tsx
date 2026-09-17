'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { request } from '@/lib/api'
import { Card, Eyebrow, Button, ErrorBanner, Heading, Loading, Stat } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { ApiState } from '@/types'

export default function Students({ open, onToast }: { open: () => void; onToast: (message: string) => void }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [state, setState] = useState<ApiState<any>>({ data: null, isLoading: true, error: null })

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  useEffect(() => {
    let active = true
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    const timer = setTimeout(() => {
      request<any>(`/bolsistas?page=${currentPage}&search=${encodeURIComponent(search)}`)
        .then((data) => active && setState({ data, isLoading: false, error: null }))
        .catch((error) => active && setState({ data: null, isLoading: false, error: error instanceof Error ? error.message : 'Erro ao carregar.' }))
    }, 400)

    return () => { active = false; clearTimeout(timer) }
  }, [currentPage, search])

  const rows = state.data?.data || []
  const totalPages = Math.max(1, state.data?.meta?.total_pages || 1)
  const totalItems = state.data?.meta?.total_items || 0

  let startPage = Math.max(1, currentPage - 2)
  let endPage = Math.min(totalPages, startPage + 4)
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4)
  }
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)

  return (
    <>
      <Heading eyebrow="Gestão de beneficiários" title="Bolsistas CEBAS" description="Acompanhe perfil socioeconômico, termos de concessão e elegibilidade." />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat title="Bolsistas cadastrados" value={totalItems.toString()} detail="Dados do Supabase" />
        <Stat title="Páginas totais" value={totalPages.toString()} detail="Paginação dinâmica" />
      </div>
      
      {state.error && <ErrorBanner message={state.error} />}
      
      <Card className="mt-4 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8e1d6] p-5">
          <div>
            <Eyebrow>Base de beneficiários</Eyebrow>
            <h2 className="mt-2 font-serif text-xl">Ciclo 2026</h2>
          </div>
          <div className="flex items-center border border-[#d1c4ae] bg-[#f4f5fb] px-2 rounded-sm focus-within:border-[#4b8c78]">
            <Search size={15} className="text-[#a38e7a]" />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-48 bg-transparent p-2 text-xs outline-none" 
              placeholder="Buscar por nome, curso, status..." 
            />
          </div>
        </div>
        
        {state.isLoading ? (
          <Loading />
        ) : (
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-[13px]">
              <thead className="border-b border-[#e8e1d6] bg-[#f4f2ea] text-[#7d837e]">
                <tr>
                  {['Bolsista', 'Curso', 'Bolsa', 'Renda (R$)', 'Termo', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-normal">{h}</th>
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
                      <td className="px-4 py-3">{row.course || '—'}</td>
                      <td className="px-4 py-3">{row.scholarship_type || '—'}</td>
                      <td className="px-4 py-3">{row.income ? `R$ ${Number(row.income).toFixed(2)}` : '—'}</td>
                      <td className="px-4 py-3">
                        {row.signed_term ? <span className="font-bold text-[#268365]">Assinado</span> : <span className="font-bold text-[#a38e7a]">Pendente</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('rounded-md px-2 py-1 text-[10px] font-bold uppercase', row.status === 'aprovado' ? 'bg-[#d4f0e8] text-[#268365]' : 'bg-[#eee4d3] text-[#a38e7a]')}>
                          {row.status?.replace('_', ' ') || 'Pendente'}
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
            <Button outline disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
              <ChevronLeft size={14} />
            </Button>
            {pages.map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} className={cn('h-7 w-7 rounded text-xs font-bold transition-colors', currentPage === page ? 'bg-[#34332f] text-white' : 'bg-[#f4f2ea] text-[#647078] hover:bg-[#ede8dd]')}>
                {page}
              </button>
            ))}
            <Button outline disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </Card>
    </>
  )
}