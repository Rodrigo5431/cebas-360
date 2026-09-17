'use client'

import { ShieldCheck } from 'lucide-react'
import { useApi } from '@/lib/api'
import { Card, Eyebrow, ErrorBanner, Heading, Loading } from '@/components/ui'
import type { Dashboard, Section } from '@/types'
import { useSession } from '@/components/auth/SessionProvider'

export default function Overview({ go }: { go: (s: Section) => void }) {
  const { data, isLoading, error } = useApi<Dashboard>('/dashboard')
  const { user } = useSession()

  return (
    <>
      <Heading
        eyebrow="Visão geral · Ciclo 2026"
        title={`Boa tarde, ${user?.name || 'usuário'}.`}
        description="Seu panorama de conformidade do CEBAS Educação."
        action={<span className="rounded-full bg-[#e7f3ee] px-3 py-2 text-[10px] text-[#4b8c78]">● Monitoramento ativo</span>}
      />
      {error && <ErrorBanner message={error} />}
      {isLoading ? (
        <Card>
          <Loading />
        </Card>
      ) : (
        data && (
          <>
            <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <Eyebrow>Índice de conformidade</Eyebrow>
                    <h2 className="mt-3 font-serif text-xl">{data.headline || 'Panorama de conformidade'}</h2>
                    <p className="mt-1 text-xs text-[#879087]">{data.description || 'Dados atualizados pela API.'}</p>
                  </div>
                  <ShieldCheck className="text-[#be8c26]" size={24} />
                </div>
                <div className="mt-6 flex items-center gap-8">
                  <div className="grid h-32 w-32 place-items-center rounded-full border-[8px] border-[#c18d20] text-center">
                    <strong className="font-serif text-4xl">{data.compliance_percent ?? data.score ?? 0}</strong>
                    <small className="block text-[10px]">/100</small>
                  </div>
                  <div className="flex-1 space-y-3 text-xs">
                    {(data.metrics || []).map((metric) => (
                      <div key={metric.label}>
                        {metric.label}
                        <b className="float-right text-[#4b8c78]">{metric.status || metric.value}</b>
                        <div className="mt-1 h-1 rounded bg-[#c49126]" style={{ width: `${metric.percent ?? 100}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => go('Auditoria')} className="mt-5 text-xs font-bold text-[#aa7a1d]">
                  Ver diagnóstico completo →
                </button>
              </Card>
              <div className="rounded-xl bg-[#292e43] p-6 text-white">
                <Eyebrow>Certificado vigente</Eyebrow>
                <h2 className="mt-3 font-serif text-xl">{data.certificate?.name || 'CEBAS Educação'}</h2>
                <p className="mt-4 text-xs text-[#bfc5d2]">{data.certificate?.number || 'Dados do certificado'}</p>
                <strong className="mt-7 block font-serif text-3xl text-[#c79931]">{data.certificate?.days_remaining || 301}</strong>
                <small className="text-[10px] text-[#98a5b8]">dias para o vencimento</small>
              </div>
            </div>
          </>
        )
      )}
    </>
  )
}
