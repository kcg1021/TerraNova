import type { ReactNode } from 'react'
import { ICON_PATHS, type IconName, type IconDef } from '@/shared/constants/icons.ts'

export interface IconBadgeProps {
  icon: ReactNode
  color?: 'blue' | 'amber' | 'emerald' | 'red' | 'slate'
  size?: 'sm' | 'md' | 'lg'
  badge?: ReactNode
  badgeColor?: 'blue' | 'amber' | 'emerald' | 'red' | 'white'
  animate?: boolean
  className?: string
}

const colorClasses = {
  blue: {
    bg: 'bg-[var(--color-primary)]',
    shadow: 'shadow-blue-500/20',
  },
  amber: {
    bg: 'bg-amber-500',
    shadow: 'shadow-amber-500/20',
  },
  emerald: {
    bg: 'bg-emerald-500',
    shadow: 'shadow-emerald-500/20',
  },
  red: {
    bg: 'bg-red-500',
    shadow: 'shadow-red-500/20',
  },
  slate: {
    bg: 'bg-slate-600',
    shadow: 'shadow-slate-500/20',
  },
}

const badgeColorClasses = {
  blue: 'bg-[var(--color-primary)] text-white',
  amber: 'bg-amber-500 text-white',
  emerald: 'bg-emerald-500 text-white',
  red: 'bg-red-500 text-white',
  white: 'bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300',
}

const sizeClasses = {
  sm: {
    container: 'w-12 h-12 rounded-xl',
    icon: 'w-6 h-6',
    badge: 'w-6 h-6 -right-0.5 -bottom-0.5',
    badgeIcon: 'w-3 h-3',
  },
  md: {
    container: 'w-16 h-16 rounded-2xl',
    icon: 'w-8 h-8',
    badge: 'w-7 h-7 -right-1 -bottom-1',
    badgeIcon: 'w-3.5 h-3.5',
  },
  lg: {
    container: 'w-20 h-20 rounded-2xl',
    icon: 'w-10 h-10',
    badge: 'w-8 h-8 -right-1 -bottom-1',
    badgeIcon: 'w-4 h-4',
  },
}

export default function IconBadge({
  icon,
  color = 'blue',
  size = 'lg',
  badge,
  badgeColor = 'white',
  animate = false,
  className = '',
}: IconBadgeProps) {
  const colorClass = colorClasses[color]
  const sizeClass = sizeClasses[size]

  return (
    <div className={`relative ${className}`}>
      {/* 메인 아이콘 배경 */}
      <div
        className={`
          ${sizeClass.container}
          ${colorClass.bg}
          flex items-center justify-center
          shadow-md ${colorClass.shadow}
          ${animate ? 'success-icon-animate' : ''}
        `}
      >
        <span className={`${sizeClass.icon} text-white flex items-center justify-center`}>
          {icon}
        </span>
      </div>

      {/* 배지 (선택적) */}
      {badge && (
        <div
          className={`
            absolute ${sizeClass.badge}
            rounded-full shadow-md
            flex items-center justify-center
            ${badgeColorClasses[badgeColor]}
          `}
        >
          <span className={`${sizeClass.badgeIcon} flex items-center justify-center`}>
            {badge}
          </span>
        </div>
      )}
    </div>
  )
}

// 카탈로그 기반 아이콘 생성 헬퍼
function iconFromCatalog(name: IconName): ReactNode {
  const icon: IconDef = ICON_PATHS[name]
  const sw = icon.strokeWidth ?? 2
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={sw} className="w-full h-full">
      {icon.d.map((d, i) => (
        <path key={i} strokeLinecap="round" strokeLinejoin="round" d={d} />
      ))}
    </svg>
  )
}

// 미리 정의된 아이콘들 (IconBadge에서 사용)
export const Icons = {
  user: iconFromCatalog('user'),
  lock: iconFromCatalog('lock'),
  email: iconFromCatalog('email'),
  check: iconFromCatalog('check'),
  search: iconFromCatalog('search'),
  key: iconFromCatalog('key'),
  megaphone: iconFromCatalog('megaphone'),
  list: iconFromCatalog('list'),
}
