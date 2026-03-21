import type { ReactNode } from 'react'

export interface BadgeProps {
  children: ReactNode
  color?: 'emerald' | 'red' | 'amber' | 'blue' | 'purple' | 'slate' | 'new'
  /** 텍스트 앞에 표시할 작은 아이콘 */
  icon?: ReactNode
  className?: string
}

const colorClasses = {
  emerald: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  slate: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  new: 'bg-red-500 text-white font-bold',
}

export default function Badge({ children, color = 'slate', icon, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-xs rounded ${colorClasses[color]} ${className}`}>
      {icon && <span className="[&>svg]:w-3 [&>svg]:h-3">{icon}</span>}
      {children}
    </span>
  )
}
