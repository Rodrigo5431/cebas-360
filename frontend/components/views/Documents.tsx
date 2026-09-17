'use client'

import { useRef, useState, useEffect } from 'react'
import { Download, Upload, Plus, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { request } from '@/lib/api'
import { Card, Eyebrow, Button, ErrorBanner, Heading, Loading, Stat } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { ApiState } from '@/types'

export default function Documents({ open, onToast }: { open: () => void; onToast: (message: string) => void }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [state, setState] = useState<ApiState<any>>({ data: null, isLoading: true, error: null })
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  useEffect(() => {
    let active = true
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    const timer = setTimeout(() => {
      request<any>(`/documents?page=${currentPage}&search=${encodeURIComponent(search)}`)
        .then((data) => active && setState({ data, isLoading: false, error: null }))
        .catch((error) => active && setState({ data: null, isLoading: false, error: error instanceof Error ? error.message : 'Erro ao carregar.' }))
    }, 400)

    return () => { active = false; clearTimeout(timer) }
  }, [currentPage, search])

  async function exportCsv() {
    onToast("Aguarde, gerando exportação...")
  }

  const docs = state.data?.data || []
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
      <Heading eyebrow="Data room" title="Evidências e documentos" description="Centralize, valide e prepare os documentos que sustentam a certificação." />
      {state.error && <ErrorBanner message={state.error} />}
      <Card className="mb-4 flex flex-wrap items-center gap-4 border-dashed border-[#c49a3c] bg-[#fffaf0] p-5">
        <Upload className="text-[#b38322]" />
        <div className="flex-1">
          <b className="text-sm">Upload de arquivos em lote</b>
          <p className="mt-1 text-xs text-[#8a8e84]">Arraste documentos aqui ou selecione do computador. PDF, XLSX ou DOCX até 25 MB.</p>
        </div>
        <Button outline onClick={exportCsv}>Exportar checklist</Button>
      </Card>
      
      <Card className="mt-4 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8e1d6] p-5">
          <div>
            <Eyebrow>Repositório de Arquivos</Eyebrow>
            <h2 className="mt-2 font-serif text-xl">Sala de evidências</h2>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center border border-[#d1c4ae] bg-[#f4f5fb] px-2 rounded-sm focus-within:border-[#4b8c78]">
              <Search size={15} className="text-[#a38e7a]" />
              <input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-48 bg-transparent p-2 text-xs outline-none" 
                placeholder="Buscar documento ou categoria..." 
              />
            </div>
            <Button onClick={open}><Plus size={16} /> Nova evidência</Button>
          </div>
        </div>
        {state.isLoading ? (
          <Loading />
        ) : (
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-[13px]">
              <thead className="border-b border-[#e8e1d6] bg-[#f4f2ea] text-[#7d837e]">
                <tr>
                  {['Documento', 'Categoria', 'Versão', 'Prazo', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {docs.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-[#879087]">Nenhum documento encontrado.</td></tr>
                ) : (
                  docs.map((doc: any) => (
                    <tr key={doc.id} className="border-b border-[#ede8dd] hover:bg-[#fffdf9]">
                      <td className="px-4 py-3 font-bold text-[#34332f] max-w-xs truncate" title={doc.name}>{doc.name}</td>
                      <td className="px-4 py-3">{doc.category_name || '—'}</td>
                      <td className="px-4 py-3">{doc.versions?.length > 0 ? `v.${doc.versions[0].version_number}` : 'v.1'}</td>
                      <td className="px-4 py-3">{doc.due_date ? new Date(doc.due_date + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}</td>
                      <td className="px-4 py-3">
                        <span className={cn('rounded-md px-2 py-1 text-[10px] font-bold uppercase', doc.status === 'aprovado' ? 'bg-[#d4f0e8] text-[#268365]' : 'bg-[#eee4d3] text-[#a38e7a]')}>
                          {doc.status?.replace('_', ' ') || 'Pendente'}
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