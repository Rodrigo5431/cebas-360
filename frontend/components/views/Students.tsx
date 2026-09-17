'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react'
import { request, useApi } from '@/lib/api'
import { Card, Eyebrow, Button, ErrorBanner, Heading, Loading, Stat } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { ApiState, Student } from '@/types'

export default function Students({ open, onToast }: { open: () => void; onToast: (message: string) => void }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [reload, setReload] = useState(0)
  const [state, setState] = useState<ApiState<{ data: Student[]; meta?: { total_pages: number } }>>({
    data: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    let active = true
    setState({ data: null, isLoading: true, error: null })

    request<{ data: Student[]; meta?: { total_pages: number } }>(`/bolsistas?page=${currentPage}`)
      .then((data) => active && setState({ data, isLoading: false, error: null }))
      .catch((error) =>
        active &&
        setState({
          data: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Erro ao carregar bolsistas.',
        })
      )

    return () => {
      active = false
    }
  }, [currentPage, reload])

  const rows = state.data?.data || []
  const totalPages = Math.max(1, state.data?.meta?.total_pages || 1)

  return (
    <>
      <Heading
        eyebrow="Gestão de beneficiários"
        title="Bolsistas CEBAS"
        description="Acompanhe perfil socioeconômico, termos de concessão e elegibilidade."
      />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat title="Bolsistas ativos" value="—" detail="Dados da API" />
        <Stat title="Termos assinados" value="—" detail="Dados da API" warn />
        <Stat title="Perfil validado" value="—" detail="Dados da API" />
        <Stat title="LGPD" value="—" detail="Acesso restrito e rastreado" />
      </div>
      {state.error && <ErrorBanner message={state.error} />}
      <Card className="mt-4 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8e1d6] p-5">
          <div>
            <Eyebrow>Base de beneficiários</Eyebrow>
            <h2 className="mt-2 font-serif text-xl">Ciclo 2026</h2>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center border border-[#d1c4ae] bg-[#f4f5fb] px-2">
              <Search size={15} />
              <input className="w-36 bg-transparent p-2 text-xs outline-none" placeholder="Buscar..." />
            </div>
            <Button onClick={open}>
              <Plus size={15} /> Novo bolsista
            </Button>
          </div>
        </div>
        {state.isLoading ? (
          <Loading />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="border-b border-[#e8e1d6] bg-[#f4f2ea] text-[#7d837e]">
                <tr>
                  {['Bolsista', 'Curso / etapa', 'Bolsa', 'Renda per capita', 'Termo', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-[#ede8dd] hover:bg-[#fffdf9]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-[#e8dcc8] text-[10px] font-bold text-[#4b3d2e]">
                          {row.initials || row.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span>{row.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{row.course || '—'}</td>
                    <td className="px-4 py-3">{row.scholarship || '—'}</td>
                    <td className="px-4 py-3">{row.income || '—'}</td>
                    <td className="px-4 py-3">{row.term || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={cn('rounded-md px-2 py-1 text-[10px] font-bold', row.status === 'Enegível' ? 'bg-[#d4f0e8] text-[#268365]' : 'bg-[#eee4d3] text-[#a38e7a]')}>
                        {row.status || 'Enegível'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-[#e8e1d6] px-4 py-3">
          <span className="text-[11px] text-[#7d837e]">Exibindo 1 até {rows.length} registros</span>
          <div className="flex items-center gap-2">
            <Button outline disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
              <ChevronLeft size={14} />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'h-7 w-7 rounded text-xs font-bold',
                    currentPage === page ? 'bg-[#34332f] text-white' : 'bg-[#f4f2ea] text-[#647078] hover:bg-[#ede8dd]'
                  )}
                >
                  {page}
                </button>
              )
            })}
            <Button outline disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </Card>
    </>
  )
}
