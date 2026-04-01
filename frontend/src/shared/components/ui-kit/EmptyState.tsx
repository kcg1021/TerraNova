import Icon from './Icon'
import type { IconName } from './Icon'

export interface EmptyStateProps {
  icon?: IconName
  message: string
  className?: string
  /** loading 상태일 경우 스피너를 표시 */
  loading?: boolean
}

export default function EmptyState({ icon = 'user', message, className = '', loading = false }: EmptyStateProps) {
  return (
    <div className={`h-full flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl ${className}`}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
          {loading ? (
            <svg className="w-6 h-6 text-slate-400 dark:text-slate-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <Icon name={icon} className="w-6 h-6 text-slate-400 dark:text-slate-500" />
          )}
        </div>
        <p className="text-sm text-slate-400 dark:text-slate-500">{message}</p>
      </div>
    </div>
  )
}
