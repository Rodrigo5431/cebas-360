'use client'

import { useState } from 'react'
import Audit from '@/components/views/Audit'

export default function AuditoriaPage() {
  const [, setToast] = useState<string | null>(null)
  return <Audit onToast={setToast} />
}
