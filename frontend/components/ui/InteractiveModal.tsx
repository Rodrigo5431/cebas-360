'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { request } from '@/lib/api'
import { Button } from './ActionButton'
import { Eyebrow } from './Eyebrow'

export function InteractiveModal({ title, close, onSaved }: { title: string; close: () => void; onSaved: (message: string) => void }) {
  const isStudent = title === 'Novo bolsista'
  const isEvidence = title === 'Nova evidência'
  const endpoint = isStudent ? '/bolsistas' : isEvidence ? '/documents' : '/alertas'
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})
  const fields = isStudent
    ? ['name', 'cpf', 'course', 'scholarship', 'income', 'term', 'notes']
    : isEvidence
      ? ['name', 'category', 'version', 'owner', 'validity', 'status', 'notes']
      : ['title', 'area', 'owner', 'deadline', 'priority', 'description']
  const labels: Record<string, string> = {
    name: 'Nome / documento', cpf: 'CPF', course: 'Curso / etapa', scholarship: 'Tipo de bolsa', income: 'Renda familiar per capita', term: 'Termo de concessão', notes: 'Observações', category: 'Categoria', version: 'Versão', owner: 'Responsável', validity: 'Validade', status: 'Status', title: 'Ação', area: 'Área', deadline: 'Prazo', priority: 'Prioridade', description: 'Descrição e critério de conclusão',
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setIsSaving(true)
    try {
      await request(endpoint, { method: 'POST', body: JSON.stringify(form) })
      onSaved('Registro salvo com sucesso.')
      close()
    } catch (error) {
      onSaved(error instanceof Error ? error.message : 'Falha ao salvar registro.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#17253699] p-4">
      <form onSubmit={submit} className="w-full max-w-2xl rounded-xl bg-[#fffdf9] p-5 shadow-2xl sm:p-7">
        <div className="flex justify-between border-b border-[#e8e1d6] pb-4">
          <div><Eyebrow>Formulário operacional</Eyebrow><h2 className="mt-2 font-serif text-2xl">{title}</h2></div>
          <button aria-label="Fechar formulário" type="button" onClick={close}><X /></button>
        </div>
        <div className="grid gap-4 py-5 sm:grid-cols-2">
          {fields.map((field) => (
            <label key={field} className={field === 'notes' || field === 'description' ? 'text-xs font-bold sm:col-span-2' : 'text-xs font-bold'}>
              {labels[field]}
              {field === 'notes' || field === 'description' ? (
                <textarea rows={4} value={form[field] || ''} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="mt-2 w-full rounded-md border border-[#d9d0c0] bg-white p-3 text-sm outline-none focus:border-[#c29121]" />
              ) : (
                <input required={field === 'name' || field === 'title'} value={form[field] || ''} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="mt-2 w-full rounded-md border border-[#d9d0c0] bg-white p-3 text-sm outline-none focus:border-[#c29121]" />
              )}
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2 border-t border-[#e8e1d6] pt-4">
          <Button outline onClick={close}>Cancelar</Button>
          <Button type="submit" disabled={isSaving}>{isSaving ? 'Salvando...' : 'Salvar registro'}</Button>
        </div>
      </form>
    </div>
  )
}

export default InteractiveModal
 
