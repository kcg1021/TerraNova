import type { ReactNode } from 'react'

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

// 미리 정의된 아이콘들
export const Icons = {
  user: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  lock: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  email: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ),
  check: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
  search: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
  key: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
  ),
  megaphone: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
    </svg>
  ),
  list: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  ),
}
