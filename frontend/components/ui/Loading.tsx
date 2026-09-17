export function Loading({ text = 'Carregando dados...' }: { text?: string }) {
  return (
    <div className="flex min-h-32 items-center justify-center gap-3 text-sm text-[#7d837e]">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#d8c18a] border-t-[#b17e18]" />
      {text}
    </div>
  )
}
