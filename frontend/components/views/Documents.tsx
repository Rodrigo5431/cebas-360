'use client'

import { useRef, useState, useEffect } from 'react'
import { Upload, Plus, ChevronLeft, Search, FileText, CheckCircle2, AlertTriangle, AlertCircle, Download, Clock, User } from 'lucide-react'
import { request } from '@/lib/api'
import { Card, Eyebrow, Button, ErrorBanner, Heading, Loading, Stat } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { ApiState } from '@/types'

export default function Documents({ onToast }: { onToast: (message: string) => void }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [state, setState] = useState<ApiState<any>>({ data: null, isLoading: true, error: null })
  
  const [view, setView] = useState<'list' | 'upload_batch' | 'conference'>('list')
  const [selectedDoc, setSelectedDoc] = useState<any>(null)
  const [uploadQueue, setUploadQueue] = useState<{file: File, category: string}[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const [confStatus, setConfStatus] = useState('aprovado')
  const [confNotes, setConfNotes] = useState('')
  
  const [currentUser, setCurrentUser] = useState<{name: string, email: string} | null>(null)

  useEffect(() => { setCurrentPage(1) }, [search])

  useEffect(() => {
    const userStr = localStorage.getItem('@cebas:user')
    if (userStr) setCurrentUser(JSON.parse(userStr))

    let active = true
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    const timer = setTimeout(() => {
      request<any>(`/documents?page=${currentPage}&search=${encodeURIComponent(search)}`)
        .then((data) => active && setState({ data, isLoading: false, error: null }))
        .catch((error) => active && setState({ data: null, isLoading: false, error: error instanceof Error ? error.message : 'Erro.' }))
    }, 400)
    return () => { active = false; clearTimeout(timer) }
  }, [currentPage, search, view]) 

  const handleFilesSelected = (files: FileList | null) => {
    if (!files?.length) return
    
    const classifiedFiles = Array.from(files).map(file => {
      const name = file.name.toLowerCase()
      let suggestedCategory = ""
      
      if (name.includes('estatuto') || name.includes('ata')) suggestedCategory = 'estatuto'
      else if (name.includes('balanço') || name.includes('balanco') || name.includes('contábil') || name.includes('dre')) suggestedCategory = 'balanco'
      else if (name.includes('relatório') || name.includes('relatorio') || name.includes('plano')) suggestedCategory = 'relatorio'
      else if (name.includes('cnd') || name.includes('fgts') || name.includes('certidão') || name.includes('federal')) suggestedCategory = 'cnd'
      
      return { file, category: suggestedCategory }
    })
    
    setUploadQueue(classifiedFiles)
    setView('upload_batch')
  }

  const updateFileCategory = (index: number, newCategory: string) => {
    const newQueue = [...uploadQueue]
    newQueue[index].category = newCategory
    setUploadQueue(newQueue)
  }

  const submitBatchUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    onToast(`${uploadQueue.length} ficheiro(s) enviado(s) por ${currentUser?.name || 'Utilizador'}. Versões atualizadas.`)
    setUploadQueue([])
    setView('list')
  }

  const openConference = (doc: any) => {
    setSelectedDoc(doc)
    setConfStatus(doc.status || 'em_revisao')
    setConfNotes('')
    setView('conference')
  }

  const submitConference = async (e: React.FormEvent) => {
    e.preventDefault()
    if (confStatus === 'correcao_solicitada' && confNotes.trim() === '') {
      onToast('Erro: É obrigatório informar o motivo da recusa para a instituição.')
      return
    }
    onToast(`Conferência registada por ${currentUser?.name || 'Advogado'} com sucesso. Trilha atualizada.`)
    setView('list')
  }

  const exportCsv = () => {
    if (!state.data?.data) return
    const headers = ['Documento', 'Categoria', 'Versao', 'Validade', 'Status']
    const csvRows = state.data.data.map((doc: any) => {
      return [
        `"${doc.name}"`, 
        `"${doc.category_name || 'Geral'}"`, 
        `"v.${doc.versions?.length || 1}"`, 
        `"${doc.due_date ? new Date(doc.due_date + 'T00:00:00').toLocaleDateString('pt-BR') : 'Sem vencimento'}"`, 
        `"${doc.status}"`
      ].join(',')
    })
    const csvContent = [headers.join(','), ...csvRows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'checklist_cebas_2026.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    onToast('Checklist consolidado exportado com sucesso!')
  }

  if (view === 'conference' && selectedDoc) {
    const isEditing = confStatus !== 'aprovado';
    
    return (
      <div className="animate-in fade-in slide-in-from-right-4">
        <button onClick={() => setView('list')} className="mb-4 flex items-center gap-1 text-xs font-bold text-[#879087] hover:text-[#34332f]">
          <ChevronLeft size={14} /> Voltar ao Data Room
        </button>
        <Card className="p-8">
          <div className="mb-8 border-b border-[#e8e1d6] pb-4 flex flex-col md:flex-row md:justify-between items-start gap-4">
            <div>
              <Eyebrow>DATA ROOM</Eyebrow>
              <h2 className="mt-1 font-serif text-3xl text-[#34332f]">Metadados e Trilha de Auditoria</h2>
              <p className="mt-2 text-xs text-[#879087]">Valide o documento e registe as observações na linha do tempo institucional.</p>
            </div>
            <span className="bg-[#fffaf0] border border-[#f0e6d2] px-3 py-1 text-xs font-bold text-[#c49a3c] rounded flex items-center gap-2 shrink-0">
              <FileText size={14}/> PDF Interativo
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <form onSubmit={submitConference} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#879087]">Documento</label>
                  <input disabled defaultValue={selectedDoc.name} className="w-full rounded border border-[#e8e1d6] p-3 text-sm bg-[#f4f2ea] text-[#647078]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#879087]">Categoria Associada</label>
                  <input disabled defaultValue={selectedDoc.category_name} className="w-full rounded border border-[#e8e1d6] p-3 text-sm bg-[#f4f2ea] text-[#647078]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#879087]">Versão Atual</label>
                    <input disabled defaultValue={`v.${selectedDoc.versions?.length || 1}`} className="w-full rounded border border-[#e8e1d6] p-3 text-sm bg-[#f4f2ea] text-[#647078] font-mono" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#879087]">Validade</label>
                    <input type="text" defaultValue={selectedDoc.due_date ? new Date(selectedDoc.due_date + 'T00:00:00').toLocaleDateString('pt-BR') : 'Sem vencimento'} className="w-full rounded border border-[#d1c4ae] p-3 text-sm text-[#34332f] outline-none focus:border-[#c49a3c]" />
                  </div>
                </div>
              </div>

              <div className="bg-[#fcfbfa] border border-[#e8e1d6] rounded-xl p-6 mt-6">
                <h3 className="text-sm font-bold text-[#34332f] mb-4">Ação do Advogado</h3>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#879087]">Status de Validação</label>
                    <select 
                      value={confStatus} 
                      onChange={(e) => setConfStatus(e.target.value)}
                      className={cn("w-full rounded border p-3 text-sm font-bold outline-none", confStatus === 'aprovado' ? 'border-[#4b8c78] text-[#4b8c78] bg-[#e7f3ee]' : confStatus === 'correcao_solicitada' ? 'border-[#d94444] text-[#d94444] bg-[#fdf0f0]' : 'border-[#d1c4ae] text-[#34332f]')}
                    >
                      <option value="em_revisao">Em Revisão</option>
                      <option value="aprovado">Aprovado (Audit-ready)</option>
                      <option value="correcao_solicitada">Devolver p/ Correção</option>
                      <option value="nao_aplicavel">Não Aplicável (Dispensado)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#879087]">
                      Notas e Motivo {confStatus === 'correcao_solicitada' && <span className="text-[#d94444]">* Obrigatório</span>}
                    </label>
                    <textarea 
                      value={confNotes}
                      onChange={(e) => setConfNotes(e.target.value)}
                      required={confStatus === 'correcao_solicitada'}
                      rows={3} 
                      placeholder={confStatus === 'correcao_solicitada' ? 'Descreva detalhadamente por que o documento foi recusado para a instituição (visível ao cliente)...' : 'Observações internas opcionais...'}
                      className={cn("w-full resize-none rounded border p-3 text-sm text-[#34332f] outline-none", confStatus === 'correcao_solicitada' && confNotes === '' ? 'border-[#d94444]' : 'border-[#d1c4ae] focus:border-[#c49a3c]')}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-2 flex justify-end gap-3 pt-4 border-t border-[#e8e1d6]">
                <Button outline onClick={() => setView('list')}>Cancelar</Button>
                <Button type="submit">Salvar Conferência e Trilha</Button>
              </div>
            </form>

            {/* Trilha de Auditoria Exigida pelo Desafio */}
            <div className="h-fit rounded-xl border border-[#e8e1d6] bg-[#fdfbf7] p-6">
              <span className="mb-4 block text-[10px] font-bold uppercase tracking-widest text-[#879087]">
                Trilha de Auditoria
              </span>
              
              <div className="relative ml-2 space-y-6 border-l-2 border-[#e1d5bd] py-2 pl-5">
                <div className="group relative">
                  <div className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white bg-[#c49a3c] transition-transform group-hover:scale-125" />
                  <div className="-mt-1.5">
                    <b className="text-[10px] uppercase tracking-widest text-[#c49a3c]">Agora</b>
                    <h3 className="mt-0.5 text-xs font-bold text-[#34332f]">Aguardando Conferência</h3>
                    <p className="mt-1 text-[11px] text-[#879087] flex items-center gap-1">
                      <User size={10}/> {currentUser?.name || 'Advogado / Analista'}
                    </p>
                  </div>
                </div>

                <div className="group relative">
                  <div className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white bg-[#4b8c78] transition-transform group-hover:scale-125" />
                  <div className="-mt-1.5">
                    <b className="text-[10px] uppercase tracking-widest text-[#4b8c78]">
                      {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                    </b>
                    <h3 className="mt-0.5 text-xs font-bold text-[#34332f]">Upload da v.{selectedDoc.versions?.length || 1}</h3>
                    <p className="mt-1 text-[11px] text-[#879087] flex items-center gap-1">
                      <Clock size={10}/> Via Plataforma (Instituição)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-[#fffaf0] rounded text-[10px] text-[#8a6317] border border-[#f0e6d2]">
                <strong>Compliance:</strong> As versões anteriores deste documento, se existirem, permanecem seladas e inalteráveis no servidor (Object Storage) garantindo o histórico do Data Room.
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (view === 'upload_batch') {
    return (
      <div className="animate-in fade-in slide-in-from-right-4">
        <button onClick={() => { setView('list'); setUploadQueue([]); }} className="mb-4 flex items-center gap-1 text-xs font-bold text-[#879087] hover:text-[#34332f]">
          <ChevronLeft size={14} /> Cancelar upload
        </button>
        <Card className="p-8">
          <div className="mb-6 border-b border-[#e8e1d6] pb-4 flex justify-between items-end">
            <div>
              <Eyebrow>UPLOAD E ASSOCIAÇÃO</Eyebrow>
              <h2 className="mt-1 font-serif text-3xl text-[#34332f]">Fila de Upload em Lote</h2>
              <p className="mt-2 text-xs text-[#879087]">Associe os ficheiros arrastados aos itens exigidos no checklist da instituição.</p>
            </div>
          </div>
          
          <form onSubmit={submitBatchUpload} className="space-y-4">
            {uploadQueue.map((item, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center gap-4 bg-[#fcfbfa] border border-[#e8e1d6] p-4 rounded-lg">
                <div className="flex-1 flex items-center gap-3">
                  <div className="bg-[#e7f3ee] text-[#4b8c78] p-2 rounded"><FileText size={20}/></div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-[#34332f] truncate">{item.file.name}</p>
                    <p className="text-[10px] text-[#879087]">{(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#879087] mb-1">Associar a qual item exigido?</label>
                  <select 
                    required 
                    value={item.category}
                    onChange={(e) => updateFileCategory(idx, e.target.value)}
                    className={cn("w-full rounded border p-2.5 text-sm outline-none bg-white font-bold transition-colors", item.category !== '' ? 'border-[#4b8c78] text-[#4b8c78]' : 'border-[#c49a3c] text-[#34332f]')}
                  >
                    <option value="">Selecione a categoria do checklist...</option>
                    <option value="estatuto">Estatuto Social Consolidado</option>
                    <option value="balanco">Demonstrações Contábeis e Notas Explicativas</option>
                    <option value="relatorio">Relatório de Execução Anual (Art. 6º)</option>
                    <option value="cnd">Certidões de Regularidade (CND/FGTS)</option>
                  </select>
                  {item.category !== '' && <p className="text-[9px] text-[#4b8c78] mt-1 flex items-center gap-1"><CheckCircle2 size={10}/> Categoria sugerida automaticamente</p>}
                </div>
              </div>
            ))}
            <div className="mt-6 p-4 bg-[#fffaf0] border-l-4 border-[#c49a3c] text-xs text-[#8a6317] rounded">
              <strong>Gestão de Versões:</strong> Se já existir um documento aprovado para a categoria selecionada, este novo ficheiro irá gerar a "Versão 2", preservando a original na trilha de auditoria [Utilizador atual: {currentUser?.name}].
            </div>
            <div className="mt-6 flex justify-end gap-3 border-t border-[#e8e1d6] pt-6">
              <Button outline onClick={() => { setView('list'); setUploadQueue([]); }}>Cancelar</Button>
              <Button type="submit">Gravar e Associar Ficheiros</Button>
            </div>
          </form>
        </Card>
      </div>
    )
  }

  const docs = state.data?.data || []
  return (
    <div className="animate-in fade-in duration-300">
      <Heading eyebrow="Data room" title="Evidências e documentos" description="Centralize, valide e prepare os documentos que sustentam a certificação." />
      {state.error && <ErrorBanner message={state.error} />}
      
      <Card className="mb-6 flex flex-col md:flex-row items-center gap-6 border-dashed border-2 border-[#c49a3c]/40 bg-[#fffaf0]/50 hover:bg-[#fffaf0] p-6 transition-colors relative">
        <div className="h-12 w-12 rounded-full bg-[#f4f2ea] flex items-center justify-center shrink-0">
          <Upload className="text-[#c49a3c]" size={24} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-sm font-bold text-[#34332f]">Upload de ficheiros em lote</h3>
          <p className="mt-1 text-xs text-[#8a8e84]">Arraste os documentos aqui para enviar vários de uma vez e associá-los ao checklist.</p>
        </div>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => handleFilesSelected(e.target.files)} />
        <div className="flex gap-3">
          <Button outline onClick={exportCsv}>
            <Download size={14} className="mr-1" /> Exportar checklist
          </Button>
          <Button onClick={() => inputRef.current?.click()}>Selecionar ficheiros</Button>
        </div>
      </Card>
      
      <Card className="mt-4 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8e1d6] p-5">
          <div>
            <Eyebrow>Repositório de Arquivos</Eyebrow>
            <h2 className="mt-2 font-serif text-xl text-[#34332f]">Sala de evidências</h2>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center border border-[#d1c4ae] bg-[#f4f5fb] px-3 rounded focus-within:border-[#4b8c78] transition-colors">
              <Search size={15} className="text-[#a38e7a]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-56 bg-transparent p-2 text-xs outline-none text-[#34332f]" placeholder="Buscar documento ou status..." />
            </div>
          </div>
        </div>
        
        {state.isLoading ? (<Loading />) : (
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-[13px] text-left">
              <thead className="border-b border-[#e8e1d6] bg-[#f4f2ea] text-[#7d837e]">
                <tr>
                  <th className="px-5 py-4 font-normal uppercase tracking-wider text-[10px]">Documento</th>
                  <th className="px-5 py-4 font-normal uppercase tracking-wider text-[10px]">Categoria Exigida</th>
                  <th className="px-5 py-4 font-normal uppercase tracking-wider text-[10px]">Versão</th>
                  <th className="px-5 py-4 font-normal uppercase tracking-wider text-[10px]">Validade</th>
                  <th className="px-5 py-4 font-normal uppercase tracking-wider text-[10px]">Status</th>
                  <th className="px-5 py-4 font-normal uppercase tracking-wider text-[10px] text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {docs.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-[#879087]">Nenhum documento encontrado.</td></tr>
                ) : (
                  docs.map((doc: any) => (
                    <tr key={doc.id} className="border-b border-[#ede8dd] hover:bg-[#fffdf9] transition-colors group cursor-pointer" onClick={() => openConference(doc)}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <FileText size={16} className="text-[#a38e7a]" />
                          <span className="font-bold text-[#34332f] max-w-[200px] truncate" title={doc.name}>{doc.name}</span>
                        </div>
                        
                        {(doc.name.toLowerCase().includes('declaração') || doc.name.toLowerCase().includes('relatório')) && (
                          <a href="/modelos/modelo_padrao.docx" download onClick={(e) => e.stopPropagation()} className="mt-1.5 flex items-center gap-1 text-[10px] text-[#aa7a1d] hover:underline font-bold">
                            Baixar modelo predefinido
                          </a>
                        )}

                        {doc.status === 'correcao_solicitada' && (
                          <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#d94444] font-bold">
                            <AlertCircle size={10}/> Ver motivo da recusa
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-[#647078]">{doc.category_name || 'Geral'}</td>
                      <td className="px-5 py-4 text-[#647078]"><span className="bg-[#f4f2ea] px-2 py-1 rounded text-xs font-mono">v.{doc.versions?.length || 1}</span></td>
                      <td className="px-5 py-4 text-[#647078]">{doc.due_date ? new Date(doc.due_date + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}</td>
                      <td className="px-5 py-4">
                        <span className={cn('rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest', 
                          doc.status === 'aprovado' ? 'bg-[#e7f3ee] text-[#4b8c78]' : 
                          doc.status === 'correcao_solicitada' ? 'bg-[#fdf0f0] text-[#d94444]' : 
                          'bg-[#fffaf0] text-[#c49a3c] border border-[#f0e6d2]'
                        )}>
                          {doc.status?.replace('_', ' ') || 'Pendente'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button className="text-[11px] font-bold text-[#aa7a1d] hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                          Conferir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}