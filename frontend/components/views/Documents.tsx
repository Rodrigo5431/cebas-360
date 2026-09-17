'use client'

import { useRef } from 'react'
import { Download, Upload } from 'lucide-react'
import { request, useApi } from '@/lib/api'
import { Card, Eyebrow, Button, ErrorBanner, Heading, Loading, Stat } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { Document } from '@/types'

export default function Documents({ open, onToast }: { open: () => void; onToast: (message: string) => void }) {
  const { data, isLoading, error } = useApi<{ data?: Document[] } | Document[]>('/documents')
  const docs = Array.isArray(data) ? data : data?.data || []
  const inputRef = useRef<HTMLInputElement>(null)

  async function classify(files: FileList | null) {
    if (!files?.length) return
    try {
      await request('/documents/classify', {
        method: 'POST',
        body: JSON.stringify({ filenames: Array.from(files).map((file) => file.name) }),
      })
      onToast('Arquivos classificados com sucesso.')
    } catch (e) {
      onToast(e instanceof Error ? e.message : 'Falha ao classificar arquivos.')
    }
  }

  async function exportCsv() {
    try {
      const response = await fetch('/documents/export')
      if (!response.ok) throw new Error('Falha ao exportar checklist.')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'checklist-documentos.csv'
      link.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      onToast(e instanceof Error ? e.message : 'Falha ao exportar checklist.')
    }
  }

  return (
    <>
      <Heading
        eyebrow="Data room"
        title="Evidências e documentos"
        description="Centralize, valide e prepare os documentos que sustentam a certificação."
        action={
          <Button onClick={open}>
            <Plus size={16} /> Nova evidência
          </Button>
        }
      />
      {error && <ErrorBanner message={error} />}
      <Card className="mb-4 flex flex-wrap items-center gap-4 border-dashed border-[#c49a3c] bg-[#fffaf0] p-5">
        <Upload className="text-[#b38322]" />
        <div className="flex-1">
          <b className="text-sm">Upload de arquivos em lote</b>
          <p className="mt-1 text-xs text-[#8a8e84]">Arraste documentos aqui ou selecione do computador. PDF, XLSX ou DOCX até 25 MB.</p>
        </div>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={(event) => classify(event.target.files)} />
        <Button outline onClick={() => inputRef.current?.click()}>
          Selecionar arquivos
        </Button>
        <Button outline onClick={exportCsv}>
          Exportar checklist
        </Button>
      </Card>
      <div className="grid gap-4 md:grid-cols-4">
        <Stat title="Evidências mapeadas" value={docs.length.toString()} detail={`${docs.length} aprovadas`} />
        <Stat title="Audit ready" value="90,4%" detail="Meta interna 95%" />
        <Stat title="Vencimento em 30 dias" value={docs.filter((d) => d.status === 'Pendente').length.toString()} detail="CNJ renovar a ata de auditoria" />
        <Stat title="Integridade" value="100%" detail="Hashi e versão registrados" />
      </div>
      <Card className="mt-4 overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#e8e1d6] p-5">
          <div>
            <Eyebrow>Repositório 2026</Eyebrow>
            <h2 className="mt-2 font-serif text-xl">Sala de evidências</h2>
          </div>
          <Button>
            <Plus size={16} /> Nova evidência
          </Button>
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="border-b border-[#e8e1d6] bg-[#f4f2ea] text-[#7d837e]">
                <tr>
                  {['Documento', 'Categoria', 'Versão', 'Responsável', 'Validade', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {docs.slice(0, 6).map((doc) => (
                  <tr key={doc.id} className="border-b border-[#ede8dd] hover:bg-[#fffdf9]">
                    <td className="px-4 py-3 font-bold text-[#34332f]">{doc.name}</td>
                    <td className="px-4 py-3">{doc.category || '—'}</td>
                    <td className="px-4 py-3">{doc.version || '—'}</td>
                    <td className="px-4 py-3">{doc.owner || '—'}</td>
                    <td className="px-4 py-3">{doc.validity || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={cn('rounded-md px-2 py-1 text-[10px] font-bold', doc.status === 'Audit-ready' ? 'bg-[#d4f0e8] text-[#268365]' : 'bg-[#eee4d3] text-[#a38e7a]')}>
                        {doc.status || 'Audit-ready'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-[#e8e1d6] bg-[#292e43] p-3 text-center text-xs text-white">
          Trilha auditável: cada meta versão preservada desde início da digitalização, com rastreabilidade total e acesso restrito.
        </div>
      </Card>
    </>
  )
}

import { Plus } from 'lucide-react'
