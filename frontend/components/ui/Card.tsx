import { cn } from '@/lib/cn'

interface CardProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '', onClick, ...props }: CardProps) {
  return (
    <section
      onClick={onClick}
      className={cn('rounded-xl border border-[#e5dfd2] bg-[#fffdf9] shadow-[0_2px_8px_rgba(42,35,24,.05)]', className)}
      {...props}
    >
      {children}
    </section>
  )
}