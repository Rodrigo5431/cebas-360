'use client'

import { useState } from 'react'
import Students from '@/components/views/Students'
import { InteractiveModal } from '@/components/ui'

export default function BolsistasPage() {
  const [, setToast] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  return <><Students open={() => setModalOpen(true)} onToast={setToast} />{modalOpen && <InteractiveModal title="Novo bolsista" close={() => setModalOpen(false)} onSaved={setToast} />}</>
}
