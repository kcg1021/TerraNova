import { ICON_PATHS, type IconName, type IconDef } from '@/shared/constants/icons'

export interface IconProps {
  name: IconName
  className?: string
  strokeWidth?: number
}

export default function Icon({ name, className = 'w-5 h-5', strokeWidth }: IconProps) {
  const icon: IconDef = ICON_PATHS[name]
  const sw = strokeWidth ?? icon.strokeWidth ?? 2

  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={sw}>
      {icon.d.map((d, i) => (
        <path key={i} strokeLinecap="round" strokeLinejoin="round" d={d} />
      ))}
    </svg>
  )
}
