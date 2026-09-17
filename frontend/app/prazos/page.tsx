'use client'

import { useState } from 'react'
import Deadlines from '@/components/views/Deadlines'
import { InteractiveModal } from '@/components/ui'

export default function PrazosPage() {
  const [, setToast] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  return <><Deadlines open={() => setModalOpen(true)} onToast={setToast} />{modalOpen && <InteractiveModal title="Configurar alerta" close={() => setModalOpen(false)} onSaved={setToast} />}</>
}
