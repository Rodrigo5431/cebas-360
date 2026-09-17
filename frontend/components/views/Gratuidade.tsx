'use client'

import Students from './Students' // Assumindo que estão na mesma pasta

export default function Gratuidade() {
  // Funções vazias apenas para satisfazer as props do componente Students
  const handleOpen = () => {
    console.log("Abrir modal de novo bolsista")
  }

  const handleToast = (message: string) => {
    console.log("Notificação:", message)
  }

  return (
    <Students open={handleOpen} onToast={handleToast} />
  )
}