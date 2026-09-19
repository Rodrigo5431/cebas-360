import { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface EyebrowProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
  className?: string
}

export function Eyebrow({ children, className, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        'text-[10px] font-bold uppercase tracking-[0.18em] text-[#b18422]',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}