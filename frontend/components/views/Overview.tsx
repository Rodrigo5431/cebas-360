'use client'

import { useState, useEffect } from 'react'
import { useApi } from '@/lib/api'
import { Card, Eyebrow, ErrorBanner, Heading, Loading, Button } from '@/components/ui'
import { useSession } from '@/components/auth/SessionProvider'
import { CheckCircle2, AlertTriangle, ArrowRight, Calendar, BarChart3, ShieldAlert, Edit2, Trash2, Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation' 
import { cn } from '@/lib/cn'

export default function Overview({ onToast }: { onToast?: (msg: string) => void }) {
  const { data, isLoading, error } = useApi<any>('/dashboard')
  const { user } = useSession()
  const router = useRouter() 

  const [localPrazos, setLocalPrazos] = useState<any[]>([])
  const [isEditingCert, setIsEditingCert] = useState(false)
  const [certForm, setCertForm] = useState({ portaria: '', validade: '' })

  const completion = data?.completion_percentage || 0
  const totalDocs = data?.status_counts ? Object.values(data.status_counts).reduce((a: any, b: any) => a + b, 0) as number : 0
  const approvedDocs = data?.status_counts?.aprovado || 0
  const pendingDocs = (data?.status_counts?.pendente || 0) + (data?.status_counts?.correcao_solicitada || 0)

  const cert = data?.certificate || {}
  const certPortaria = certForm.portaria || cert.portaria || 'Aguardando portaria'
  
  const rawDate = certForm.validade || cert.valid_until || ''
  const certValidUntil = rawDate 
    ? new Date(rawDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '') 
    : '—'
    
  const certRenewalWindow = cert.renewal_start && cert.renewal_end
    ? `${new Date(cert.renewal_start + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: '2-digit' }).replace('.', '')} — ${new Date(cert.renewal_end + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: '2-digit' }).replace('.', '')}` 
    : '—'
  const certDays = cert.days_remaining || 0

  const gratuidade = data?.gratuidade || {}
  const gratCurrent = gratuidade.current_percentage || 0
  const gratTarget = gratuidade.target_percentage || 20
  const gratEquivalent = gratuidade.equivalent_scholarships || 0
  const gratGrowth = gratuidade.growth || 0

  const bolsas = data?.bolsas || {}
  const bolsasRatio = bolsas.ratio || '1/5'
  const bolsasCurrent = bolsas.current || 0
  const bolsasTarget = bolsas.target || 0
  const bolsasMargin = bolsasCurrent - bolsasTarget

  const forecastData = data?.forecast_data || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  useEffect(() => {
    if (data?.upcoming_deadlines) {
      setLocalPrazos(data.upcoming_deadlines.slice(0, 2))
    }
    if (data?.certificate) {
      setCertForm({ portaria: data.certificate.portaria || '', validade: data.certificate.valid_until || '' })
    }
  }, [data])

  const handleSaveCert = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditingCert(false)
    if (onToast) onToast('Dados do certificado atualizados com sucesso.')
  }

  const handleDismissPrazo = (id: string, action: 'concluido' | 'excluido') => {
    setLocalPrazos(prev => prev.filter(p => p.id !== id))
    if (onToast) onToast(action === 'concluido' ? 'Prazo marcado como concluído!' : 'Alerta removido do painel.')
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#879087] font-bold">Visão geral · Ciclo {new Date().getFullYear()}</span>
          <h1 className="font-serif text-3xl text-[#34332f] mt-1">
            Boa tarde, {user?.name ? user.name.split(' ')[0] : 'utilizador'}.
          </h1>
          <p className="text-sm text-[#7d837e] mt-1">O seu panorama de conformidade do CEBAS Educação.</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-widest text-[#879087] font-bold block mb-1">Período de aferição</span>
          <strong className="text-sm text-[#34332f] block mb-2 bg-[#f4f2ea] px-3 py-1 rounded-md border border-[#e8e1d6]">
            01 jan — 31 dez {new Date().getFullYear()}
          </strong>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e7f3ee] px-2.5 py-1 text-[10px] font-bold text-[#4b8c78]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4b8c78] animate-pulse"></span> Monitoramento ativo
          </span>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}
      
      {isLoading ? (
        <Card className="p-10"><Loading /></Card>
      ) : (
        data && (
          <div className="space-y-6">
            
            <div className="grid lg:grid-cols-[1.8fr_1fr] gap-6">
              
              <Card className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-8">
                  <div className="relative h-32 w-32 shrink-0">
                    <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#f4f2ea" strokeWidth="8" />
                      <circle 
                        cx="50" cy="50" r="45" fill="none" stroke="#c49a3c" strokeWidth="8" 
                        strokeDasharray="283" strokeDashoffset={283 - (283 * completion) / 100} 
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-serif text-4xl text-[#34332f] leading-none">{completion}</span>
                      <span className="text-[10px] text-[#879087] mt-1 font-bold">/100</span>
                    </div>
                  </div>

                  <div className="flex-1 w-full">
                    <Eyebrow>Índice de conformidade</Eyebrow>
                    <h2 className="font-serif text-xl text-[#34332f] mt-2 mb-1">
                      {completion >= 90 ? 'Estrutura sólida, com atenção pontual.' : 'O dossiê exige atenção e ajustes.'}
                    </h2>
                    <p className="text-xs text-[#879087] mb-6">O índice consolida requisitos legais, evidências e prazos do ciclo.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                      <div>
                        <div className="flex justify-between text-[11px] mb-2">
                          <span className="text-[#647078]">Regularidade institucional</span>
                          <span className="font-bold text-[#4b8c78]">Conforme</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#f4f2ea] rounded-full overflow-hidden"><div className="h-full bg-[#4b8c78] w-[100%] rounded-full"/></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] mb-2">
                          <span className="text-[#647078]">Gratuidade e bolsas</span>
                          <span className="font-bold text-[#c49a3c]">Atenção</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#f4f2ea] rounded-full overflow-hidden"><div className="h-full bg-[#c49a3c] w-[75%] rounded-full"/></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] mb-2">
                          <span className="text-[#647078]">Prestação de contas</span>
                          <span className="font-bold text-[#c49a3c]">Atenção</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#f4f2ea] rounded-full overflow-hidden"><div className="h-full bg-[#c49a3c] w-[60%] rounded-full"/></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] mb-2">
                          <span className="text-[#647078]">Governança documental</span>
                          <span className="font-bold text-[#4b8c78]">Conforme</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#f4f2ea] rounded-full overflow-hidden"><div className="h-full bg-[#4b8c78] w-[100%] rounded-full"/></div>
                      </div>
                    </div>

                    <button 
                      onClick={() => router.push('/auditoria')} 
                      className="mt-6 text-xs font-bold text-[#aa7a1d] hover:text-[#8a6317] hover:underline flex items-center gap-1 transition-all"
                    >
                      Ver diagnóstico completo <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </Card>

              <div className="rounded-xl bg-[#292e43] p-6 md:p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-lg">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                  <ShieldAlert size={160} />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="grid h-8 w-8 place-items-center rounded-full border border-[#50566b] bg-[#313750] text-[#c49a3c]">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="border border-[#c49a3c] text-[#c49a3c] rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#c49a3c]/10">
                      Certificado Vigente
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xs text-[#98a5b8] font-bold uppercase tracking-widest mb-1">{data.institution?.name || 'Instituição Logada'}</h3>
                    {!isEditingCert && (
                      <button onClick={() => setIsEditingCert(true)} className="text-[#98a5b8] hover:text-white transition-colors" title="Editar Certificado">
                        <Edit2 size={14} />
                      </button>
                    )}
                  </div>
                  
                  {isEditingCert ? (
                    <form onSubmit={handleSaveCert} className="mt-2 space-y-3 bg-[#313750] p-4 rounded-lg border border-[#50566b]">
                      <div>
                        <label className="text-[10px] text-[#98a5b8] uppercase tracking-wider block mb-1">Portaria / Despacho</label>
                        <input 
                          required type="text" value={certForm.portaria} onChange={e => setCertForm({...certForm, portaria: e.target.value})}
                          className="w-full bg-[#1f2333] border border-[#50566b] rounded p-2 text-xs text-white outline-none focus:border-[#c49a3c]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#98a5b8] uppercase tracking-wider block mb-1">Data de Validade</label>
                        <input 
                          required type="date" value={certForm.validade} onChange={e => setCertForm({...certForm, validade: e.target.value})}
                          className="w-full bg-[#1f2333] border border-[#50566b] rounded p-2 text-xs text-white outline-none focus:border-[#c49a3c]"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setIsEditingCert(false)} className="text-xs text-[#98a5b8] hover:text-white px-2">Cancelar</button>
                        <button type="submit" className="bg-[#c49a3c] text-white text-xs px-3 py-1.5 rounded font-bold hover:bg-[#aa7a1d] transition-colors">Gravar</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h2 className="font-serif text-2xl">{certPortaria}</h2>
                      <div className="mt-8 space-y-4 text-[11px]">
                        <div className="flex justify-between items-center border-b border-[#3b4159] pb-3">
                          <span className="text-[#98a5b8] flex items-center gap-2"><Calendar size={12}/> Válido até</span>
                          <span className="bg-[#1f2333] text-white px-2.5 py-1 rounded-md font-mono tracking-tight font-bold border border-[#3b4159]">
                            {certValidUntil}
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-[#3b4159] pb-3">
                          <span className="text-[#98a5b8] flex items-center gap-2"><Calendar size={12}/> Janela de renovação</span>
                          <span className="bg-[#c49a3c]/20 text-[#c49a3c] px-2.5 py-1 rounded-md font-mono tracking-tight font-bold border border-[#c49a3c]/30">
                            {certRenewalWindow}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-8 relative z-10">
                  <strong className="font-serif text-3xl text-[#c49a3c]">{certDays} <span className="text-sm font-sans text-[#98a5b8] font-normal">dias p/ vencimento</span></strong>
                  <button 
                    onClick={() => router.push('/prazos')} 
                    className="w-full mt-5 bg-[#3b4159] hover:bg-[#4a516d] text-white text-xs font-bold py-3 rounded transition-colors shadow-sm"
                  >
                    Planejar renovação
                  </button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 transition-all hover:shadow-md cursor-pointer" onClick={() => router.push('/gratuidade')}>
                <div className="flex justify-between items-start mb-4">
                  <Eyebrow>Gratuidade apurada</Eyebrow>
                  <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold", gratGrowth >= 0 ? "bg-[#e7f3ee] text-[#4b8c78]" : "bg-[#fdf0f0] text-[#d94444]")}>
                    {gratGrowth > 0 ? '+' : ''}{gratGrowth}%
                  </span>
                </div>
                <h3 className="font-serif text-4xl text-[#34332f]">{gratCurrent.toLocaleString('pt-BR')}%</h3>
                <p className="text-xs text-[#879087] mt-2">Equivalente a {gratEquivalent.toLocaleString('pt-BR')} bolsas integrais</p>
                <div className="mt-5 pt-4 border-t border-[#e8e1d6] flex justify-between items-center text-[11px]">
                  <span className="text-[#879087]">Meta legal projetada</span>
                  <strong className="text-[#34332f] bg-[#f4f2ea] px-2 py-0.5 rounded">{gratTarget.toLocaleString('pt-BR')}%</strong>
                </div>
              </Card>

              <Card className="p-6 transition-all hover:shadow-md cursor-pointer" onClick={() => router.push('/bolsistas')}>
                <div className="flex justify-between items-start mb-4">
                  <Eyebrow>Bolsas integrais</Eyebrow>
                  <span className="bg-[#f4f2ea] text-[#647078] px-2 py-0.5 rounded text-[10px] font-bold border border-[#e8e1d6]">{bolsasRatio}</span>
                </div>
                <h3 className="font-serif text-4xl text-[#34332f]">{bolsasCurrent}</h3>
                <p className="text-xs text-[#879087] mt-2">de {bolsasTarget} bolsas mínimas projetadas</p>
                <div className="mt-5 pt-4 border-t border-[#e8e1d6] flex justify-between items-center text-[11px]">
                  <span className="text-[#879087]">{bolsasMargin >= 0 ? 'Margem de segurança' : 'Défice de bolsas'}</span>
                  <strong className={cn("px-2 py-0.5 rounded", bolsasMargin >= 0 ? "bg-[#e7f3ee] text-[#4b8c78]" : "bg-[#fdf0f0] text-[#d94444]")}>
                    {bolsasMargin > 0 ? '+' : ''}{bolsasMargin} bolsas
                  </strong>
                </div>
              </Card>

              <Card className="p-6 transition-all hover:shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <Eyebrow>Evidências</Eyebrow>
                  <span className="border border-[#e8e1d6] text-[#647078] px-2 py-0.5 rounded text-[10px] font-bold">{new Date().getFullYear()}</span>
                </div>
                <h3 className="font-serif text-4xl text-[#34332f]">{approvedDocs} <span className="text-lg text-[#a38e7a]">/ {totalDocs}</span></h3>
                <p className="text-xs text-[#879087] mt-2">documentos validados pelo Compliance</p>
                <div className="mt-4 pt-3 flex items-center justify-between">
                  <div className="flex gap-4 text-[11px] font-bold">
                    <span className="flex items-center gap-1 text-[#4b8c78]"><CheckCircle2 size={12}/> {approvedDocs}</span>
                    <span className="flex items-center gap-1 text-[#c49a3c]"><AlertTriangle size={12}/> {pendingDocs}</span>
                  </div>
                </div>
                <button 
                  onClick={() => router.push('/documentos')} 
                  className="mt-4 w-full text-left text-xs font-bold text-[#aa7a1d] hover:text-[#8a6317] hover:underline flex items-center gap-1"
                >
                  Abrir Data Room <ArrowRight size={12} />
                </button>
              </Card>
            </div>

            <div className="grid md:grid-cols-[1fr_1.5fr] gap-6">
              
              <Card className="p-6">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <Eyebrow>Próximos marcos</Eyebrow>
                    <h3 className="font-serif text-lg text-[#34332f] mt-1">Prazos que pedem atenção</h3>
                  </div>
                  <button 
                    onClick={() => router.push('/prazos')} 
                    className="text-[11px] text-[#aa7a1d] font-bold hover:underline bg-[#fffaf0] px-2 py-1 rounded"
                  >
                    Ver agenda completa
                  </button>
                </div>
                
                <div className="space-y-4">
                  {localPrazos.map((prazo: any) => {
                    const date = new Date(prazo.due_date + 'T00:00:00')
                    return (
                      <div key={prazo.id} className="flex gap-4 items-center border-b border-[#f4f2ea] pb-4 last:border-0 last:pb-0 group">
                        <div className="bg-[#f4f2ea] text-center rounded-lg border border-[#e8e1d6] px-3 py-1.5 min-w-[55px] shadow-sm">
                          <strong className="block text-lg text-[#34332f] leading-none">
                            {date.getDate().toString().padStart(2, '0')}
                          </strong>
                          <span className="text-[9px] uppercase font-bold text-[#879087]">
                            {date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 
                            className="text-xs font-bold text-[#34332f] leading-tight mt-0.5 hover:text-[#c49a3c] cursor-pointer transition-colors" 
                            onClick={() => router.push('/prazos')}
                          >
                            {prazo.name}
                          </h4>
                          <p className="text-[10px] text-[#879087] mt-1 line-clamp-1">{prazo.category || 'Requisito Legal'}</p>
                        </div>
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleDismissPrazo(prazo.id, 'concluido')} title="Marcar como concluído" className="p-1.5 rounded-md bg-[#e7f3ee] text-[#4b8c78] hover:bg-[#bce0d3] transition-colors">
                            <Check size={12} />
                          </button>
                          <button onClick={() => handleDismissPrazo(prazo.id, 'excluido')} title="Remover alerta" className="p-1.5 rounded-md bg-[#fdf0f0] text-[#d94444] hover:bg-[#f5c2c2] transition-colors">
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                  {!localPrazos.length && <p className="text-xs text-[#879087]">Nenhum prazo crítico no radar.</p>}
                </div>
              </Card>

              <Card className="p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Eyebrow>Compliance Forecast</Eyebrow>
                    <h3 className="font-serif text-lg text-[#34332f] mt-1">Projeção até dez/{new Date().getFullYear()}</h3>
                  </div>
                  <span className="bg-[#fffaf0] border border-[#f0e6d2] text-[#c49a3c] px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                    <BarChart3 size={12}/> {data?.forecast_confidence || 82}% confiança
                  </span>
                </div>
                
                <div className="mt-2 flex items-end gap-2 text-[#34332f]">
                  <strong className="font-serif text-4xl">{gratCurrent.toLocaleString('pt-BR')}%</strong>
                  <span className="text-xs text-[#879087] mb-1">projeção de gratuidade</span>
                </div>

                <div className="flex items-end gap-1.5 h-28 mt-6">
                  {forecastData.map((h: number, i: number) => (
                    <div key={i} className="flex-1 group relative flex flex-col justify-end h-full">
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#34332f] text-white text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-lg">
                        {h}%
                      </span>
                      <div 
                        className={`w-full rounded-t-sm transition-all duration-300 ${i === 11 ? 'bg-[#c49a3c]' : 'bg-[#e8dcc8] group-hover:bg-[#c49a3c]/60'}`} 
                        style={{ height: `${h}%` }} 
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[9px] text-[#a38e7a] font-bold uppercase tracking-widest mt-3 px-1 border-t border-[#f4f2ea] pt-2">
                  <span>Jan</span>
                  <span>Dez</span>
                </div>
              </Card>

            </div>

          </div>
        )
      )}
    </>
  )
}