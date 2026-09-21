'use client'

import { useState } from 'react'
import { X, FileText, UserPlus, BellRing } from 'lucide-react'
import { request } from '@/lib/api'
import { Button } from './ActionButton'
import { Eyebrow } from './Eyebrow'

export function InteractiveModal({ title, close, onSaved }: { title: string; close: () => void; onSaved: (message: string) => void }) {
  const isStudent = title === 'Novo bolsista'
  const isEvidence = title === 'Nova evidência'
  const endpoint = isStudent ? '/bolsistas' : isEvidence ? '/documents' : '/alertas'
  
  const [isSaving, setIsSaving] = useState(false)
  
  // Valores por defeito para garantir que o formulário de evidência tem sempre dados
  const [form, setForm] = useState<Record<string, string>>({
    category: 'Institucional',
    status: 'pendente'
  })

  // Campos mais limpos e focados na necessidade de cada área
  const fields = isStudent
    ? ['name', 'cpf', 'course', 'scholarship', 'income', 'term', 'notes']
    : isEvidence
      ? ['name', 'category', 'status', 'notes'] // Simplificado: sem ficheiro, apenas metadados
      : ['title', 'area', 'owner', 'deadline', 'priority', 'description']

  const labels: Record<string, string> = {
    name: isEvidence ? 'Nome da evidência (Ex: Balanço Patrimonial)' : 'Nome Completo', 
    category: 'Categoria Exigida', 
    status: 'Status Inicial',
    cpf: 'CPF', course: 'Curso / etapa', scholarship: 'Tipo de bolsa', income: 'Renda familiar per capita', term: 'Termo de concessão', notes: 'Observações',
    title: 'Ação / Providência', area: 'Área', owner: 'Responsável', deadline: 'Prazo Limite', priority: 'Prioridade', description: 'Descrição e critério de conclusão',
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setIsSaving(true)
    try {
      await request(endpoint, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form) 
      })
      onSaved('Registro criado com sucesso na base de dados.')
      close()
      
      // Pequeno atraso para o servidor processar e depois recarrega a tabela
      setTimeout(() => window.location.reload(), 600)
    } catch (error) {
      onSaved(error instanceof Error ? error.message : 'Falha ao salvar registro.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#17253699] p-4 animate-in fade-in duration-200">
      <form onSubmit={submit} className="relative w-full max-w-2xl rounded-xl bg-[#fffdf9] p-5 shadow-2xl sm:p-7">
        
        <div className="flex justify-between border-b border-[#e8e1d6] pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded bg-[#f4f2ea] p-2 text-[#c49a3c]">
              {isEvidence ? <FileText size={20} /> : isStudent ? <UserPlus size={20} /> : <BellRing size={20} />}
            </div>
            <div>
              <Eyebrow>Formulário operacional</Eyebrow>
              <h2 className="mt-1 font-serif text-2xl text-[#34332f]">{title}</h2>
            </div>
          </div>
          <button aria-label="Fechar formulário" type="button" onClick={close} className="text-[#879087] hover:text-[#34332f] transition-colors"><X /></button>
        </div>

        <div className="grid gap-5 py-6 sm:grid-cols-2">
          {fields.map((field) => (
            <label key={field} className={field === 'notes' || field === 'description' || field === 'name' ? 'text-xs font-bold sm:col-span-2' : 'text-xs font-bold'}>
              <span className="uppercase tracking-wider text-[#879087] mb-1.5 block">{labels[field]}</span>
              
              {field === 'category' && isEvidence ? (
                <select required value={form[field] || 'Institucional'} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className="mt-1 w-full rounded-md border border-[#d9d0c0] bg-white p-3 text-sm outline-none focus:border-[#c29121] font-normal text-[#34332f]">
                  <option value="Institucional">Institucional</option>
                  <option value="Contábil e Financeiro">Contábil e Financeiro</option>
                  <option value="Gratuidade e Bolsistas">Gratuidade e Bolsistas</option>
                </select>
              ) : field === 'status' && isEvidence ? (
                <select required value={form[field] || 'pendente'} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className="mt-1 w-full rounded-md border border-[#d9d0c0] bg-white p-3 text-sm outline-none focus:border-[#c29121] font-normal text-[#34332f]">
                  <option value="pendente">Pendente (Aguardando Ficheiro)</option>
                  <option value="em_revisao">Em Revisão</option>
                  <option value="aprovado">Aprovado (Audit-ready)</option>
                </select>
              ) : field === 'notes' || field === 'description' ? (
                <textarea rows={3} value={form[field] || ''} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className="mt-1 w-full resize-none rounded-md border border-[#d9d0c0] bg-white p-3 text-sm outline-none focus:border-[#c29121] font-normal text-[#34332f]" />
              ) : (
                <input required={field === 'name' || field === 'title'} value={form[field] || ''} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className="mt-1 w-full rounded-md border border-[#d9d0c0] bg-white p-3 text-sm outline-none focus:border-[#c29121] font-normal text-[#34332f]" />
              )}
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-3 border-t border-[#e8e1d6] pt-5">
          <Button outline type="button" onClick={close}>Cancelar</Button>
          <Button type="submit" disabled={isSaving}>{isSaving ? 'A gravar...' : 'Salvar registro'}</Button>
        </div>
      </form>
    </div>
  )
}

export default InteractiveModal