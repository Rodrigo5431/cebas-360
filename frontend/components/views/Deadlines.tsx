'use client'

import { useState, useEffect } from 'react'
import { useApi } from '@/lib/api'
import { Card, Eyebrow, Button, ErrorBanner, Heading, Loading } from '@/components/ui'
import { ArrowUpRight, Calendar, ChevronLeft, Edit2, Trash2, Plus, CheckSquare, Square, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/cn'

interface TaskItem {
  id: string
  label: string
  done: boolean
}

const defaultTasks: TaskItem[] = [
  { id: '1', label: 'Levantamento e triagem de documentos preliminares', done: true },
  { id: '2', label: 'Validação pelo setor jurídico e contábil', done: false },
  { id: '3', label: 'Coleta de assinaturas e termos de concessão', done: false },
  { id: '4', label: 'Inserção da evidência no repositório auditável', done: false },
]

export default function Deadlines({ onToast }: { onToast: (message: string) => void }) {
  const { data, isLoading, error } = useApi<any>('/alertas')
  
  const [view, setView] = useState<'list' | 'details' | 'form'>('list')
  const [localDeadlines, setLocalDeadlines] = useState<any[]>([])
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const [tasksState, setTasksState] = useState<Record<string, TaskItem[]>>({})
  const [channelsState, setChannelsState] = useState<Record<string, { email: boolean; push: boolean; webhook: boolean }>>({})

  useEffect(() => {
    if (data) {
      setLocalDeadlines(Array.isArray(data) ? data : data.data || [])
    }
  }, [data])

  useEffect(() => {
    const savedTasks = localStorage.getItem('@cebas360:tasks')
    const savedChannels = localStorage.getItem('@cebas360:channels')

    if (savedTasks) setTasksState(JSON.parse(savedTasks))
    if (savedChannels) setChannelsState(JSON.parse(savedChannels))
  }, [])

  const daysRemaining = 301
  const preparationPercent = 78

  const handleViewDetails = (item: any) => {
    setSelectedItem(item)
    if (!tasksState[item.id]) {
      setTasksState((prev) => ({ ...prev, [item.id]: defaultTasks }))
    }
    if (!channelsState[item.id]) {
      setChannelsState((prev) => ({ ...prev, [item.id]: { email: true, push: true, webhook: false } }))
    }
    setView('details')
  }

  const toggleTask = (taskId: string) => {
    if (!selectedItem) return
    const currentTasks = tasksState[selectedItem.id] || defaultTasks
    const updated = currentTasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
    
    const newState = { ...tasksState, [selectedItem.id]: updated }
    setTasksState(newState)
    localStorage.setItem('@cebas360:tasks', JSON.stringify(newState))
    
    onToast('Item do checklist atualizado.')
  }

  const toggleChannel = (channel: 'email' | 'push' | 'webhook') => {
    if (!selectedItem) return
    const current = channelsState[selectedItem.id] || { email: true, push: true, webhook: false }
    const updated = { ...current, [channel]: !current[channel] }
    
    const newState = { ...channelsState, [selectedItem.id]: updated }
    setChannelsState(newState)
    localStorage.setItem('@cebas360:channels', JSON.stringify(newState))
    
    onToast('Canal de alerta atualizado.')
  }

  const handleDelete = () => {
    setLocalDeadlines((prev) => prev.filter((d) => d.id !== selectedItem.id))
    onToast('Prazo removido com sucesso.')
    setView('list')
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    onToast(selectedItem ? 'Providência atualizada com sucesso!' : 'Novo alerta configurado com sucesso!')
    setView('list')
  }

  if (view === 'details' && selectedItem) {
    const dateObj = new Date(selectedItem.data + 'T00:00:00')
    const currentTasks = tasksState[selectedItem.id] || defaultTasks
    const currentChannels = channelsState[selectedItem.id] || { email: true, push: true, webhook: false }
    const completedTasks = currentTasks.filter((t) => t.done).length
    const progressPercent = Math.round((completedTasks / currentTasks.length) * 100)

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <button
          onClick={() => setView('list')}
          className="mb-4 flex items-center gap-1 text-xs font-bold text-[#879087] transition-colors hover:text-[#34332f]"
        >
          <ChevronLeft size={14} /> Voltar para a agenda
        </button>

        <Card className="p-8">
          <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#e8e1d6] pb-6 sm:flex-row sm:items-start">
            <div>
              <Eyebrow>Detalhes da Providência</Eyebrow>
              <h2 className="mt-2 font-serif text-3xl text-[#34332f]">{selectedItem.titulo}</h2>
              <span
                className={cn(
                  'mt-3 inline-block rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest',
                  selectedItem.tipo === 'error'
                    ? 'bg-[#fdf0f0] text-[#d94444]'
                    : 'border border-[#f0e6d2] bg-[#fffaf0] text-[#c49a3c]'
                )}
              >
                Prioridade {selectedItem.tipo === 'error' ? 'Alta' : 'Normal'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button outline onClick={() => setView('form')}>
                <Edit2 size={14} /> Editar
              </Button>
              <button
                onClick={handleDelete}
                className="rounded border border-[#f5c2c2] p-2 text-[#d94444] transition-colors hover:bg-[#fdf0f0]"
                title="Excluir prazo"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-6">
              <div>
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#879087]">
                  Descrição e Critério de Conclusão
                </span>
                <p className="text-sm leading-relaxed text-[#34332f]">{selectedItem.mensagem}</p>
              </div>

              <div className="rounded-xl border border-[#e8e1d6] bg-[#fdfbf7] p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#34332f]">
                    Checklist de Execução do Prazo
                  </span>
                  <span className="font-serif text-sm font-bold text-[#c49a3c]">
                    {completedTasks}/{currentTasks.length} concluídas ({progressPercent}%)
                  </span>
                </div>

                <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-[#ede5d8]">
                  <div
                    className="h-full bg-[#4b8c78] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="space-y-2.5">
                  {currentTasks.map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className="flex w-full items-center gap-3 rounded-lg border border-transparent p-2 text-left transition hover:border-[#e8e1d6] hover:bg-white"
                    >
                      {task.done ? (
                        <CheckSquare size={18} className="shrink-0 text-[#4b8c78]" />
                      ) : (
                        <Square size={18} className="shrink-0 text-[#a38e7a]" />
                      )}
                      <span
                        className={cn(
                          'text-xs transition-colors',
                          task.done ? 'text-[#879087] line-through' : 'font-medium text-[#34332f]'
                        )}
                      >
                        {task.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-[#647078]">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[#879087]">Responsável</span>
                  <p className="mt-1 font-medium text-[#34332f]">Compliance Officer / Jurídico</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[#879087]">
                    Marco Legal Relacionado
                  </span>
                  <p className="mt-1 font-medium text-[#34332f]">LC nº 187/2021, Art. 24</p>
                </div>
              </div>
            </div>

            <div className="h-fit rounded-xl border border-[#e8e1d6] bg-[#fcfbfa] p-6">
              <span className="mb-4 block text-[10px] font-bold uppercase tracking-widest text-[#879087]">
                Configuração de Alertas
              </span>

              <div className="mb-5 flex items-center justify-between border-b border-[#e8e1d6] pb-4">
                <span className="flex items-center gap-2 text-sm text-[#647078]">
                  <Calendar size={16} /> Data Limite
                </span>
                <strong className="bg-[#f4f2ea] px-3 py-1 font-mono text-base font-bold text-[#34332f]">
                  {dateObj.toLocaleDateString('pt-BR')}
                </strong>
              </div>

              <div className="space-y-3 text-sm text-[#34332f]">
                <button
                  type="button"
                  onClick={() => toggleChannel('email')}
                  className="flex w-full items-center gap-3 text-left transition hover:opacity-80"
                >
                  {currentChannels.email ? (
                    <CheckSquare size={16} className="text-[#4b8c78]" />
                  ) : (
                    <Square size={16} className="text-[#d1c4ae]" />
                  )}
                  <span>Notificação via E-mail</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleChannel('push')}
                  className="flex w-full items-center gap-3 text-left transition hover:opacity-80"
                >
                  {currentChannels.push ? (
                    <CheckSquare size={16} className="text-[#4b8c78]" />
                  ) : (
                    <Square size={16} className="text-[#d1c4ae]" />
                  )}
                  <span>Push no Sistema</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleChannel('webhook')}
                  className="flex w-full items-center gap-3 text-left transition hover:opacity-80"
                >
                  {currentChannels.webhook ? (
                    <CheckSquare size={16} className="text-[#4b8c78]" />
                  ) : (
                    <Square size={16} className="text-[#d1c4ae]" />
                  )}
                  <span>Disparo via Webhook</span>
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (view === 'form') {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <button
          onClick={() => setView('list')}
          className="mb-4 flex items-center gap-1 text-xs font-bold text-[#879087] transition-colors hover:text-[#34332f]"
        >
          <ChevronLeft size={14} /> Cancelar e voltar
        </button>

        <Card className="p-8">
          <div className="mb-8 border-b border-[#e8e1d6] pb-4">
            <Eyebrow>Plano de ação e alertas</Eyebrow>
            <h2 className="mt-1 font-serif text-3xl text-[#34332f]">
              {selectedItem ? 'Editar Providência' : 'Nova Providência Preventiva'}
            </h2>
            <p className="mt-2 text-xs text-[#879087]">
              Registre a providência, o responsável e os marcos de acompanhamento.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#879087]">
                  Ação / Título
                </label>
                <input
                  required
                  defaultValue={selectedItem?.titulo}
                  type="text"
                  className="w-full rounded border border-[#d1c4ae] p-3 text-sm text-[#34332f] outline-none ring-[#c49a3c] focus:border-[#c49a3c] focus:ring-1"
                  placeholder="Ex: Fechar prévia de bolsas 2026.2"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#879087]">Área</label>
                <select className="w-full rounded border border-[#d1c4ae] bg-white p-3 text-sm text-[#34332f] outline-none focus:border-[#c49a3c]">
                  <option>Gratuidade</option>
                  <option>Institucional</option>
                  <option>Contábil e Financeiro</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#879087]">
                  Responsável
                </label>
                <input
                  type="text"
                  defaultValue="Compliance Officer"
                  className="w-full rounded border border-[#d1c4ae] p-3 text-sm text-[#34332f] outline-none focus:border-[#c49a3c]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#879087]">
                  Prioridade
                </label>
                <select
                  defaultValue={selectedItem?.tipo === 'error' ? 'Alta' : 'Média'}
                  className="w-full rounded border border-[#d1c4ae] bg-white p-3 text-sm text-[#34332f] outline-none focus:border-[#c49a3c]"
                >
                  <option>Alta (Crítico)</option>
                  <option>Média (Atenção)</option>
                  <option>Baixa (Rotina)</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#879087]">
                  Marco Regulatório Relacionado
                </label>
                <input
                  type="text"
                  className="w-full rounded border border-[#d1c4ae] p-3 text-sm text-[#34332f] outline-none focus:border-[#c49a3c]"
                  placeholder="Ex: Art. 14, LC 187/21"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#879087]">
                  Descrição e Critério de Conclusão
                </label>
                <textarea
                  required
                  defaultValue={selectedItem?.mensagem}
                  rows={3}
                  className="w-full resize-none rounded border border-[#d1c4ae] p-3 text-sm text-[#34332f] outline-none focus:border-[#c49a3c]"
                  placeholder="Descreva os detalhes da providência..."
                />
              </div>
            </div>

            <div className="grid items-start gap-6 border-t border-[#e8e1d6] pt-6 md:grid-cols-[1fr_2fr]">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#879087]">
                  Prazo Fatal
                </label>
                <input
                  required
                  defaultValue={selectedItem?.data}
                  type="date"
                  className="w-full rounded border border-[#d1c4ae] p-3 text-sm text-[#34332f] outline-none focus:border-[#c49a3c]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#879087]">
                  Canais de Alerta
                </label>
                <div className="mt-3 flex gap-6">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-[#34332f]">
                    <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#c49a3c]" /> E-mail
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-[#34332f]">
                    <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#c49a3c]" /> Push Notification
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-[#34332f]">
                    <input type="checkbox" className="h-4 w-4 accent-[#c49a3c]" /> Webhook ERP
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-2 flex justify-end gap-3 border-t border-[#e8e1d6] pt-6">
              <Button outline onClick={() => setView('list')}>
                Cancelar
              </Button>
              <Button type="submit">Confirmar Providência</Button>
            </div>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-300">
      <Heading
        eyebrow="Agenda regulatória"
        title="Prazos e alertas"
        description="Antecipe renovações, entregas anuais, diligências e vencimentos documentais."
      />
      {error && <ErrorBanner message={error} />}

      <div className="mb-6 flex flex-col justify-between gap-6 rounded-xl bg-[#292e43] p-8 text-white md:flex-row md:items-center">
        <div>
          <Eyebrow>Renovação CEBAS Educação</Eyebrow>
          <h2 className="mt-3 font-serif text-4xl">{daysRemaining} dias restantes</h2>
          <p className="mt-2 max-w-xl text-xs text-[#98a5b8]">
            A janela de 360 dias já está aberta. O requerimento tempestivo mantém a certificação válida até a decisão
            administrativa definitiva.
          </p>
        </div>
        <div className="shrink-0 text-center md:text-right">
          <strong className="font-serif text-5xl text-[#61b9ad]">{preparationPercent}%</strong>
          <p className="mt-1 text-[10px] uppercase tracking-wider text-[#98a5b8]">Dossiê preparado</p>
        </div>
      </div>

      <Card className="p-8">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#e8e1d6] pb-6 sm:flex-row sm:items-center">
          <div>
            <Eyebrow>Linha do tempo</Eyebrow>
            <h2 className="mt-2 font-serif text-2xl text-[#34332f]">Marcos do ciclo de renovação</h2>
          </div>
          <Button onClick={() => { setSelectedItem(null); setView('form'); }}>
            <Plus size={16} /> Novo Alerta
          </Button>
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="relative ml-3 space-y-8 border-l-2 border-[#e1d5bd] py-2 pl-6">
            {localDeadlines.map((item: any) => {
              const dateObj = new Date(item.data + 'T00:00:00')
              const isPast = dateObj < new Date()

              return (
                <div key={item.id} className="group relative">
                  <div
                    className={cn(
                      'absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-white transition-transform group-hover:scale-125',
                      isPast ? 'bg-[#4b8c78]' : 'bg-[#c49a3c]'
                    )}
                  />

                  <div className="-mt-3 flex flex-col justify-between gap-4 rounded-lg p-3 transition-colors hover:bg-[#fcfbfa] sm:flex-row sm:items-start">
                    <div>
                      <b className={cn('text-[10px] uppercase tracking-widest', isPast ? 'text-[#4b8c78]' : 'text-[#c49a3c]')}>
                        {dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </b>
                      <h3 className="mt-1 text-sm font-bold text-[#34332f]">{item.titulo}</h3>
                      <p className="mt-1 line-clamp-2 max-w-2xl text-xs text-[#879087]">{item.mensagem}</p>
                    </div>

                    <button
                      onClick={() => handleViewDetails(item)}
                      className="flex shrink-0 items-center gap-1 rounded border border-[#f0e6d2] bg-[#fffaf0] px-3 py-1.5 text-[11px] font-bold text-[#aa7a1d] transition-all hover:text-[#34332f]"
                    >
                      Ver detalhes <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>
              )
            })}
            {!localDeadlines.length && <p className="text-sm text-[#7d837e]">Nenhum marco regulatório pendente.</p>}
          </div>
        )}
      </Card>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card className="flex items-start gap-4 border-[#f0e6d2] bg-[#fffaf0] p-5">
          <AlertCircle className="shrink-0 text-[#c49a3c]" size={20} />
          <div>
            <h3 className="text-sm font-bold text-[#34332f]">Escalonamento preventivo</h3>
            <p className="mt-1 text-[11px] text-[#879087]">
              Se uma evidência crítica permanecer pendente em D-15, a Diretoria e o Compliance serão notificados.
            </p>
          </div>
        </Card>

        <Card className="flex items-start gap-4 p-5">
          <CheckCircle2 className="shrink-0 text-[#4b8c78]" size={20} />
          <div>
            <h3 className="text-sm font-bold text-[#34332f]">Notificações multicanal</h3>
            <p className="mt-1 text-[11px] text-[#879087]">
              Alertas emitidos em D-180, D-90 e D-30 via e-mail, push e webhooks.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}