'use client'

import { useApi } from '@/lib/api'
import { Card, Eyebrow, Button, ErrorBanner, Heading, Loading } from '@/components/ui'
import type { Deadline } from '@/types'

export default function Deadlines({ open, onToast }: { open: () => void; onToast: (message: string) => void }) {
  const { data, isLoading, error } = useApi<{ data?: Deadline[] } | Deadline[]>('/alertas')
  const deadlines = Array.isArray(data) ? data : data?.data || []

  return (
    <>
      <Heading
        eyebrow="Agenda regulatória"
        title="Prazos e alertas"
        description="Antecipe renovações, entregas anuais, diligências e vencimentos documentais."
      />
      {error && <ErrorBanner message={error} />}
      <Card className="p-6">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <Eyebrow>Linha do tempo</Eyebrow>
                <h2 className="mt-2 font-serif text-xl">Marcos do ciclo de renovação</h2>
              </div>
              <Button outline onClick={open}>
                Configurar alertas
              </Button>
            </div>
            <div className="mt-5 space-y-1 border-l-2 border-[#e1d5bd] pl-6">
              {deadlines.map((item) => (
                <div className="relative border-b border-[#eee9df] py-4 text-xs" key={item.id}>
                  <b>{item.date || 'Prazo'}</b>
                  <h3 className="mt-1 font-bold">{item.title}</h3>
                  <p className="mt-1 text-[#879087]">{item.description || 'Detalhes retornados pela API.'}</p>
                </div>
              ))}
              {!deadlines.length && <p className="p-5 text-center text-sm text-[#7d837e]">Nenhum alerta retornado pela API.</p>}
            </div>
          </>
        )}
      </Card>
    </>
  )
}
