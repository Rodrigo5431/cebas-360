'use client'

import { useEffect, useMemo, useState } from 'react'
import { request, useApi } from '@/lib/api'
import { Card, Eyebrow, ErrorBanner, Heading, Loading } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { ApiState, AuditItem } from '@/types'

export default function Audit({ onToast }: { onToast: (message: string) => void }) {
  const { data, isLoading, error } = useApi<{ data?: AuditItem[] } | AuditItem[]>('/auditoria')
  const [items, setItems] = useState<AuditItem[]>([])

  useEffect(() => {
    setItems(Array.isArray(data) ? data : data?.data || [])
  }, [data])

  const groups = useMemo(
    () =>
      Object.entries(
        items.reduce<Record<string, AuditItem[]>>((result, item) => {
          const group = item.group || 'Checklist'
          ;(result[group] ||= []).push(item)
          return result
        }, {})
      ),
    [items]
  )

  const readiness = items.length ? Math.round((items.filter((item) => item.is_checked).length / items.length) * 100) : 0

  async function toggle(item: AuditItem) {
    const next = !item.is_checked
    setItems((current) => current.map((row) => (row.id === item.id ? { ...row, is_checked: next } : row)))
    try {
      await request(`/auditoria/${item.id}/toggle`, {
        method: 'POST',
        body: JSON.stringify({ is_checked: next }),
      })
    } catch (e) {
      setItems((current) => current.map((row) => (row.id === item.id ? { ...row, is_checked: item.is_checked } : row)))
      onToast(e instanceof Error ? e.message : 'Falha ao atualizar auditoria.')
    }
  }

  return (
    <>
      <Heading
        eyebrow="Audit readiness"
        title="Simulação de auditoria"
        description="Teste o dossiê, identifique lacunas e gere um plano de ação preventivo."
      />
      {error && <ErrorBanner message={error} />}
      <div className="flex items-center gap-6 rounded-xl bg-[#292e43] p-6 text-white">
        <div>
          <Eyebrow>Prontidão geral</Eyebrow>
          <strong className="font-serif text-3xl text-[#61b9ad]">{readiness}/100</strong>
        </div>
        <div className="flex-1 border-l border-[#50566b] pl-6">
          <h2 className="font-serif text-xl">O dossiê está {readiness >= 80 ? 'controlado' : 'em revisão'}.</h2>
        </div>
      </div>
      {isLoading ? (
        <Card className="mt-4">
          <Loading />
        </Card>
      ) : (
        <div className="mt-4 space-y-4">
          {groups.map(([group, groupItems]) => (
            <Card className="p-5" key={group}>
              <div className="flex justify-between">
                <h2 className="font-serif text-lg">{group}</h2>
                <b className="text-xl">{Math.round((groupItems.filter((item) => item.is_checked).length / groupItems.length) * 100)}%</b>
              </div>
              <div className="mt-4 space-y-2 border-t border-[#e8e1d6] pt-4">
                {groupItems.map((item) => (
                  <label key={item.id} className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={item.is_checked}
                      onChange={() => toggle(item)}
                      className="h-4 w-4 accent-[#4b8c78]"
                    />
                    <span>{item.title}</span>
                  </label>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
