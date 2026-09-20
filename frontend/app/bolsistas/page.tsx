'use client'

import { useState } from 'react'
import Students from '@/components/views/Students'

export default function BolsistasPage() {
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  return (
    <>
      <Students onToast={(msg: string) => setToastMsg(msg)} />
      
      {toastMsg && (
        <div className="fixed bottom-4 right-4 bg-[#4b8c78] text-white px-5 py-3 rounded-lg shadow-lg z-50 font-bold text-sm flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          {toastMsg}
          <button onClick={() => setToastMsg(null)} className="opacity-70 hover:opacity-100 text-lg">
            &times;
          </button>
        </div>
      )}
    </>
  )
}