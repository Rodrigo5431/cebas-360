import { AlertTriangle } from 'lucide-react'

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mb-4 flex items-center gap-3 rounded-lg border border-[#e7bcb8] bg-[#fff1ef] p-4 text-sm text-[#a6534a]"
    >
      <AlertTriangle size={18} />
      {message}
    </div>
  )
}
