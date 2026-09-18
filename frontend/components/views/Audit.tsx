'use client'

import { useMemo, useState } from 'react'
import { request, useApi } from '@/lib/api'
import { Card, Eyebrow, ErrorBanner, Heading, Loading, Button } from '@/components/ui'
import { CheckSquare, Square, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/cn'

export default function Audit({ onToast }: { onToast: (message: string) => void }) {
  // Consumimos a rota de documentos para montar o checklist real e dinâmico
  const { data, isLoading, error } = useApi<any>('/documents')
  const docs = Array.isArray(data) ? data : data?.data || []

  const [localChecks, setLocalChecks] = useState<Record<string, boolean>>({})

  const isChecked = (doc: any) => {
    if (localChecks[doc.id] !== undefined) return localChecks[doc.id]
    return doc.status === 'aprovado'
  }

  const toggleCheck = (id: string) => {
    setLocalChecks(prev => ({ ...prev, [id]: !prev[id] }))
    onToast('Status de simulação alterado.')
  }

  const groups = useMemo(() => {
    return docs.reduce((acc: any, doc: any) => {
      const cat = doc.category_name || 'Geral'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(doc)
      return acc
    }, {})
  }, [docs])

  const totalDocs = docs.length
  const approvedDocs = docs.filter((d: any) => isChecked(d)).length
  const readiness = totalDocs ? Math.round((approvedDocs / totalDocs) * 100) : 0

  const priorities = docs.filter((d: any) => !isChecked(d)).slice(0, 3)

  return (
    <>
      <Heading
        eyebrow="Audit readiness"
        title="Simulação de auditoria"
        description="Teste o dossiê, identifique lacunas e gere um plano de ação preventivo."
      />
      {error && <ErrorBanner message={error} />}
      
      <div className="flex items-center gap-6 rounded-xl bg-[#292e43] p-6 text-white mb-6">
        <div>
          <Eyebrow>Prontidão geral</Eyebrow>
          <strong className="font-serif text-4xl text-[#61b9ad]">{readiness}/100</strong>
        </div>
        <div className="flex-1 border-l border-[#50566b] pl-6 flex justify-between items-center">
          <div>
            <h2 className="font-serif text-xl">
              {readiness >= 90 ? 'O dossiê está controlado.' : 'O dossiê exige atenção.'}
            </h2>
            <p className="text-xs text-[#98a5b8] mt-1">
              Foram identificadas {priorities.length} oportunidades de melhoria.
            </p>
          </div>
          <Button outline className="border-[#50566b] text-white hover:bg-[#3b4159]">
            Gerar relatório de gaps
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card className="p-6"><Loading /></Card>
      ) : (
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          
          <div className="space-y-6">
            {Object.entries(groups).map(([category, items]: [string, any]) => {
              const groupTotal = items.length
              const groupApproved = items.filter((item: any) => isChecked(item)).length
              const groupPercent = Math.round((groupApproved / groupTotal) * 100)

              return (
                <div key={category} className="bg-white rounded-xl border border-[#e8e1d6] p-6">
                  <div className="flex justify-between items-end mb-4">
                    <h3 className="font-bold text-[#34332f] text-sm uppercase tracking-wider">{category}</h3>
                    <span className="font-serif text-xl font-bold text-[#4b3d2e]">{groupPercent}%</span>
                  </div>
                  
                  <div className="h-1 w-full bg-[#f4f2ea] rounded-full mb-6 overflow-hidden">
                    <div className="h-full bg-[#c49a3c] transition-all duration-500" style={{ width: `${groupPercent}%` }} />
                  </div>

                  <div className="space-y-4">
                    {items.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between group">
                        <button 
                          onClick={() => toggleCheck(item.id)}
                          className="flex items-center gap-3 text-left focus:outline-none"
                        >
                          {isChecked(item) ? (
                            <CheckSquare className="text-[#c49a3c]" size={20} />
                          ) : (
                            <Square className="text-[#d1c4ae]" size={20} />
                          )}
                          <span className={cn("text-sm", isChecked(item) ? "text-[#34332f]" : "text-[#7d837e]")}>
                            {item.name}
                          </span>
                        </button>
                        <a href="#" className="text-[10px] text-[#aa7a1d] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          Acessar evidência
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="space-y-4">
            <Card className="p-6">
              <Eyebrow>Próximas ações</Eyebrow>
              <h3 className="font-serif text-lg text-[#34332f] mt-2 mb-6">Prioridades sugeridas</h3>
              
              <div className="space-y-5">
                {priorities.map((item: any, idx: number) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#f4f2ea] text-[10px] font-bold text-[#aa7a1d]">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#34332f]">Resolver: {item.name}</p>
                      <p className="text-[10px] text-[#879087] mt-1 line-clamp-1">Resp: Compliance Officer</p>
                    </div>
                  </div>
                ))}
                {priorities.length === 0 && (
                  <p className="text-xs text-[#879087]">Nenhuma pendência crítica encontrada.</p>
                )}
              </div>

              <div className="mt-8 pt-5 border-t border-[#e8e1d6] flex gap-3 items-center bg-[#fcfbfa] p-3 rounded-lg">
                <CheckCircle2 className="text-[#c49a3c]" size={24} />
                <div>
                  <b className="text-sm text-[#34332f]">{approvedDocs} evidências prontas</b>
                  <p className="text-[10px] text-[#879087]">{readiness}% do dossiê</p>
                </div>
              </div>
            </Card>
          </div>

        </div>
      )}
    </>
  )
}