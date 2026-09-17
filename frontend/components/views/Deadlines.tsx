'use client'

import { useApi } from '@/lib/api'
import { Card, Eyebrow, Button, ErrorBanner, Heading, Loading } from '@/components/ui'
import { AlertCircle, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'

export default function Deadlines({ open, onToast }: { open: () => void; onToast: (message: string) => void }) {
  const { data, isLoading, error } = useApi<any>('/alertas')
  const deadlines = Array.isArray(data) ? data : data?.data || []

  // Calcula os dias restantes para o certificado vencer (simulado para a UI)
  const daysRemaining = 301
  const preparationPercent = 78

  return (
    <>
      <Heading
        eyebrow="Agenda regulatória"
        title="Prazos e alertas"
        description="Antecipe renovações, entregas anuais, diligências e vencimentos documentais."
      />
      {error && <ErrorBanner message={error} />}

      {/* Banner Principal */}
      <div className="bg-[#292e43] rounded-xl p-8 text-white mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Eyebrow>Renovação CEBAS Educação</Eyebrow>
          <h2 className="font-serif text-4xl mt-3">{daysRemaining} dias restantes</h2>
          <p className="text-xs text-[#98a5b8] mt-2 max-w-xl">
            A janela de 360 dias já está aberta. O requerimento tempestivo mantém a certificação válida até a decisão administrativa definitiva.
          </p>
        </div>
        <div className="text-center md:text-right shrink-0">
          <strong className="font-serif text-5xl text-[#61b9ad]">{preparationPercent}%</strong>
          <p className="text-[10px] text-[#98a5b8] uppercase tracking-wider mt-1">Dossiê preparado</p>
        </div>
      </div>

      <Card className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Eyebrow>Linha do tempo</Eyebrow>
            <h2 className="mt-2 font-serif text-2xl text-[#34332f]">Marcos do ciclo de renovação</h2>
          </div>
          <Button outline onClick={open}>
            Configurar alertas
          </Button>
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="relative border-l-2 border-[#e1d5bd] ml-3 pl-6 space-y-8 py-2">
            {deadlines.map((item: any, idx: number) => {
              const dateObj = new Date(item.data + 'T00:00:00')
              const isPast = dateObj < new Date()
              
              return (
                <div key={item.id} className="relative group">
                  {/* Ponto na linha do tempo */}
                  <div className={cn(
                    "absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-white",
                    isPast ? "bg-[#4b8c78]" : "bg-[#c49a3c]"
                  )} />
                  
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <b className={cn(
                        "text-[10px] uppercase tracking-widest",
                        isPast ? "text-[#4b8c78]" : "text-[#c49a3c]"
                      )}>
                        {dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </b>
                      <h3 className="mt-1 font-bold text-[#34332f] text-sm">{item.titulo}</h3>
                      <p className="mt-1 text-xs text-[#879087] max-w-2xl">{item.mensagem}</p>
                    </div>
                    
                    <button 
                      onClick={() => onToast(`Abrindo detalhes de: ${item.titulo}`)}
                      className="text-[11px] font-bold text-[#aa7a1d] hover:underline flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0"
                    >
                      Detalhes <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>
              )
            })}
            {!deadlines.length && <p className="text-sm text-[#7d837e]">Nenhum marco regulatório pendente.</p>}
          </div>
        )}
      </Card>

      {/* Cards de Ação Inferiores */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <Card className="p-5 flex gap-4 items-start bg-[#fffaf0] border-[#f0e6d2]">
          <AlertCircle className="text-[#c49a3c] shrink-0" size={20} />
          <div>
            <h3 className="font-bold text-sm text-[#34332f]">Escalonamento preventivo</h3>
            <p className="text-[11px] text-[#879087] mt-1">Se uma evidência crítica permanecer pendente em D-15, a Diretoria e o Compliance serão notificados.</p>
          </div>
        </Card>
        
        <Card className="p-5 flex gap-4 items-start">
          <ArrowUpRight className="text-[#4b8c78] shrink-0" size={20} />
          <div>
            <h3 className="font-bold text-sm text-[#34332f]">Notificações multicanal</h3>
            <p className="text-[11px] text-[#879087] mt-1">Alertas emitidos em D-180, D-90 e D-30 via e-mail, push e webhooks.</p>
          </div>
        </Card>
      </div>
    </>
  )
}