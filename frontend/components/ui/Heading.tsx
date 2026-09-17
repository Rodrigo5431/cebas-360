import { Eyebrow } from './Eyebrow'

export function Heading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-2 font-serif text-[31px] text-[#34332f]">{title}</h1>
        <p className="mt-1 text-[13px] text-[#7d837e]">{description}</p>
      </div>
      {action}
    </div>
  )
}
