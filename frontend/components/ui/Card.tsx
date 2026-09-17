import { cn } from '@/lib/cn'

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-xl border border-[#e5dfd2] bg-[#fffdf9] shadow-[0_2px_8px_rgba(42,35,24,.05)]', className)}>
      {children}
    </section>
  )
}
