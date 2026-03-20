import Icon from './Icon'
import type { IconName } from './Icon'

export interface EmptyStateProps {
  icon?: IconName
  message: string
  className?: string
}

export default function EmptyState({ icon = 'user', message, className = '' }: EmptyStateProps) {
  return (
    <div className={`h-full flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl ${className}`}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
          <Icon name={icon} className="w-6 h-6 text-slate-300 dark:text-slate-600" />
        </div>
        <p className="text-sm text-slate-400 dark:text-slate-500">{message}</p>
      </div>
    </div>
  )
}
