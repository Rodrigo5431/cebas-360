import { cn } from '@/lib/cn'
import { Card } from './Card'
import { Eyebrow } from './Eyebrow'

export function Stat({
  title,
  value,
  detail,
  warn = false,
}: {
  title: string
  value: string
  detail: string
  warn?: boolean
}) {
  return (
    <Card className={cn('p-5', warn && 'border-l-[3px] border-l-[#c18b27]')}>
      <Eyebrow>{title}</Eyebrow>
      <div className="mt-3 font-serif text-[28px] text-[#34332f]">{value}</div>
      <div className={cn('mt-2 text-[11px] text-[#859087]', warn && 'text-[#ae7e25]')}>
        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#5aa28c]" />
        {detail}
      </div>
    </Card>
  )
}
