'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { request, useApi } from '@/lib/api'
import { Card, Eyebrow, ErrorBanner, Heading, Loading, Button } from '@/components/ui'
import { CheckSquare, Square, CheckCircle2, FileText, ShieldAlert, Building2, Calendar } from 'lucide-react'
import { cn } from '@/lib/cn'

export default function Audit({ go, onToast }: { go?: (s: string) => void; onToast?: (message: string) => void }) {
  const router = useRouter()
  const { data, isLoading, error } = useApi<any>('/documents')
  const docs = Array.isArray(data) ? data : data?.data || []

  const [localChecks, setLocalChecks] = useState<Record<string, boolean>>({})
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('@cebas360:audit_simulation')
    if (saved) setLocalChecks(JSON.parse(saved))
    setIsLoaded(true)
  }, [])

  const isChecked = (doc: any) => {
    if (localChecks[doc.name] !== undefined) return localChecks[doc.name]
    return doc.status === 'aprovado'
  }

  const toggleCheck = async (doc: any) => {
    const current = isChecked(doc)
    const updated = { ...localChecks, [doc.name]: !current }
    
    setLocalChecks(updated)
    localStorage.setItem('@cebas360:audit_simulation', JSON.stringify(updated))
    if (onToast) onToast('Status de simulação alterado.')

    try {
      await request('/auditoria/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_name: doc.name })
      })
    } catch (e) {
      console.warn("Log de auditoria offline.")
    }
  }

  const handleNavigation = (e: React.MouseEvent | undefined, destination: string) => {
    if (e) e.stopPropagation()
    
    if (typeof go === 'function') {
      go(destination)
    } else {
      const routeMap: Record<string, string> = {
        'Documentos': '/documentos',
        'Prazos e alertas': '/prazos',
        'Bolsistas': '/bolsistas'
      }
      router.push(routeMap[destination] || '/')
    }
  }

  const groups = useMemo(() => {
    return docs.reduce((acc: any, doc: any) => {
      const cat = doc.category_name || 'Documentos Gerais'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(doc)
      return acc
    }, {})
  }, [docs])

  const totalDocs = docs.length
  const approvedDocs = docs.filter((d: any) => isChecked(d)).length
  const readiness = totalDocs ? Math.round((approvedDocs / totalDocs) * 100) : 0
  const pendingCount = totalDocs - approvedDocs

  const exportGapReport = () => {
    const pendingDocs = docs.filter((d: any) => !isChecked(d))
    
    let report = `====================================================\n`
    report += `        RELATÓRIO DE GAPS - CEBAS 360\n`
    report += `====================================================\n\n`
    report += `PRONTIDÃO GERAL: ${readiness}/100\n`
    report += `DATA DA SIMULAÇÃO: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}\n\n`
    report += `PENDÊNCIAS E OPORTUNIDADES DE MELHORIA (${pendingCount}):\n`
    
    if (pendingDocs.length === 0) {
       report += `- Nenhuma pendência encontrada. O dossiê formativo está completo.\n`
    } else {
       pendingDocs.forEach((doc: any, index: number) => {
         report += `${index + 1}. [${doc.category_name || 'Geral'}] ${doc.name}\n`
       })
    }
    
    report += `\n====================================================\n`
    report += `Gerado automaticamente pela Plataforma CEBAS 360\n`
    
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `Relatorio_Gaps_CEBAS_${new Date().getFullYear()}.txt`
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    if(onToast) onToast('Relatório de Gaps gerado e exportado com sucesso!')
  }

  if (!isLoaded) return null

  return (
    <div className="animate-in fade-in duration-300">
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
        <Heading
          eyebrow="AUDIT READINESS"
          title="Simulação de auditoria"
          description="Teste o dossiê, identifique lacunas e gere um plano de ação preventivo."
        />
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 rounded border border-[#e8e1d6] bg-[#fcfbfa] px-3 py-1.5 focus-within:border-[#c49a3c]">
            <Building2 size={14} className="text-[#a38e7a]" />
            <select className="bg-transparent text-xs font-bold text-[#34332f] outline-none cursor-pointer">
              <option>Instituto Educacional Horizonte</option>
              <option>Associação Luterana Bom Jesus</option>
              <option>Fundação São Paulo</option>
            </select>
          </div>
          <div className="flex items-center gap-2 rounded border border-[#e8e1d6] bg-[#fcfbfa] px-3 py-1.5 focus-within:border-[#4b8c78]">
            <Calendar size={14} className="text-[#a38e7a]" />
            <select className="bg-transparent text-xs font-bold text-[#4b8c78] outline-none cursor-pointer">
              <option>Ciclo {new Date().getFullYear()}</option>
              <option>Ciclo {new Date().getFullYear() - 1} (Concluído)</option>
            </select>
          </div>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {isLoading ? (
        <Card className="p-10"><Loading /></Card>
      ) : (
        <div className="grid lg:grid-cols-[1fr_2fr] gap-6 mt-2">
          <div className="space-y-6">
            <Card className="p-8 bg-[#292e43] text-white border-none relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <ShieldAlert size={120} />
              </div>
              <div className="relative z-10">
                <Eyebrow className="text-[#98a5b8] mb-4">PRONTIDÃO GERAL</Eyebrow>
                <div className="flex items-end gap-2 mb-4">
                  <span className="font-serif text-6xl leading-none text-[#61b9ad]">{readiness}</span>
                  <span className="text-xl text-[#98a5b8] mb-1 font-bold">/100</span>
                </div>
                <h3 className="text-lg font-serif mb-2">
                  {readiness >= 90 ? 'O dossiê está controlado.' : 'O dossiê exige atenção e ajustes.'}
                </h3>
                <p className="text-xs text-[#98a5b8] leading-relaxed">
                  {pendingCount === 0 
                    ? 'Nenhuma pendência crítica identificada no ciclo atual.' 
                    : `Foram identificadas ${pendingCount} oportunidades de melhoria ou pendências na documentação.`}
                </p>
                
                <Button 
                  onClick={exportGapReport} 
                  className="w-full mt-6 bg-[#3b4159] hover:bg-[#4a516d] border-none text-xs flex justify-center"
                >
                  Gerar relatório de gaps
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#879087] mb-5">Progresso por Dimensão</h3>
              <div className="space-y-5">
                {Object.entries(groups).map(([category, items]: [string, any]) => {
                  const groupTotal = items.length
                  const groupApproved = items.filter((item: any) => isChecked(item)).length
                  const groupPercent = Math.round((groupApproved / groupTotal) * 100)

                  return (
                    <div key={category}>
                      <div className="flex justify-between text-[11px] mb-2 font-bold">
                        <span className="text-[#34332f] truncate pr-2">{category}</span>
                        <span className={groupPercent === 100 ? "text-[#4b8c78]" : "text-[#c49a3c]"}>{groupPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#f4f2ea] rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-500", groupPercent === 100 ? "bg-[#4b8c78]" : "bg-[#c49a3c]")} 
                          style={{ width: `${groupPercent}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Eyebrow>PRÓXIMAS AÇÕES</Eyebrow>
            <h2 className="font-serif text-2xl text-[#34332f] -mt-4 mb-2">Prioridades sugeridas</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(groups).map(([category, items]: [string, any]) => (
                <Card key={category} className="p-6 bg-[#fdfbf7] flex flex-col">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#879087] mb-4">{category}</h3>
                  <div className="space-y-2 flex-1">
                    {items.map((doc: any) => (
                      <div key={doc.id} className="flex items-start justify-between gap-3 p-2 hover:bg-white rounded transition-colors group">
                        <button onClick={() => toggleCheck(doc)} className="flex items-start gap-3 text-left flex-1">
                          {isChecked(doc) 
                            ? <CheckSquare size={16} className="text-[#4b8c78] shrink-0 mt-0.5" /> 
                            : <Square size={16} className="text-[#c49a3c] shrink-0 mt-0.5" />
                          }
                          <span className={cn("text-xs transition-colors", isChecked(doc) ? "text-[#879087] line-through" : "text-[#34332f] font-bold")}>
                            {doc.name}
                          </span>
                        </button>
                        
                        <button 
                          onClick={(e) => handleNavigation(e, 'Documentos')} 
                          className="text-[10px] flex items-center gap-1 font-bold text-[#aa7a1d] hover:underline bg-[#fffaf0] border border-[#f0e6d2] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                        >
                          <FileText size={10}/> Evidência
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-4 text-[11px] text-[#879087] bg-[#f4f2ea] p-3 rounded">
              <CheckCircle2 size={14} className="text-[#4b8c78]"/>
              <span>
                <strong>{approvedDocs} evidências prontas:</strong> O dossiê cumpre com os requisitos formativos marcados. Aceda ao Data Room para anexar os documentos oficiais pendentes.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}