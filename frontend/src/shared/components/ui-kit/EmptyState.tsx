import Icon from './Icon'
import type { IconName } from '@/shared/constants/icons'

interface EmptyStateProps {
  icon?: IconName
  message: string
  className?: string
}

export default function EmptyState({ icon = 'user', message, className = '' }: EmptyStateProps) {
  return (
    <div className={`h-full flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-xl ${className}`}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
          <Icon name={icon} className="w-6 h-6 text-gray-300 dark:text-gray-600" />
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500">{message}</p>
      </div>
    </div>
  )
}

export type { EmptyStateProps }
