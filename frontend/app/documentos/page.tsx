'use client'

import { useState } from 'react'
import Documents from '@/components/views/Documents'
import { InteractiveModal } from '@/components/ui'

export default function DocumentosPage() {
  const [, setToast] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  return <><Documents open={() => setModalOpen(true)} onToast={setToast} />{modalOpen && <InteractiveModal title="Nova evidência" close={() => setModalOpen(false)} onSaved={setToast} />}</>
}
