import type { ReactNode } from 'react'

export interface PanelHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export default function PanelHeader({ title, subtitle, action }: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between shrink-0">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        {subtitle && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  )
}
