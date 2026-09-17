import { cn } from '@/lib/cn'

export function Button({
  children,
  onClick,
  outline = false,
  disabled = false,
  type = 'button',
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  outline?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-xs font-bold transition hover:brightness-95 disabled:cursor-wait disabled:opacity-60',
        outline ? 'border border-[#d9d0c0] bg-white text-[#647078]' : 'bg-[#c29121] text-white shadow-sm',
        className
      )}
    >
      {children}
    </button>
  )
}