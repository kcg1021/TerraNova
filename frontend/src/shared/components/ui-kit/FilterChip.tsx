import type { ReactNode } from 'react'

export interface FilterChipProps {
  active?: boolean
  onClick?: () => void
  dot?: string
  children: ReactNode
}

export default function FilterChip({ active = false, onClick, dot, children }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
        active
          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      {children}
    </button>
  )
}
