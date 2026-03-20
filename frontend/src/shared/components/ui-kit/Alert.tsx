import type { ReactNode } from 'react'
import Icon from './Icon'
import type { IconName } from '@/shared/constants/icons'

export interface AlertProps {
  type?: 'error' | 'info' | 'success' | 'warning'
  title?: string
  children: ReactNode
  className?: string
}

// 타입별 아이콘 이름 매핑
const iconNames: Record<string, IconName> = {
  error: 'warningCircle',
  info: 'infoCircle',
  success: 'checkCircle',
  warning: 'warningTriangle',
}

const typeClasses = {
  error: {
    container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50',
    icon: 'text-red-500',
    title: 'text-red-700 dark:text-red-400',
    text: 'text-red-600 dark:text-red-400',
  },
  info: {
    container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50',
    icon: 'text-[var(--color-primary)] dark:text-sky-400',
    title: 'text-blue-700 dark:text-blue-400',
    text: 'text-slate-600 dark:text-slate-300',
  },
  success: {
    container: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50',
    icon: 'text-emerald-500',
    title: 'text-emerald-700 dark:text-emerald-400',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  warning: {
    container: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50',
    icon: 'text-amber-500',
    title: 'text-amber-700 dark:text-amber-400',
    text: 'text-amber-600 dark:text-amber-400',
  },
}

export default function Alert({ type = 'error', title, children, className = '' }: AlertProps) {
  const classes = typeClasses[type]

  return (
    <div className={`flex items-start gap-3 p-3 border rounded-xl ${classes.container} ${className}`}>
      <span className={`flex-shrink-0 mt-0.5 ${classes.icon}`}>
        <Icon name={iconNames[type]} className="w-5 h-5" />
      </span>
      <div className="flex-1 min-w-0">
        {title && (
          <p className={`font-medium text-sm mb-1 ${classes.title}`}>
            {title}
          </p>
        )}
        <div className={`text-sm ${title ? 'text-slate-500 dark:text-slate-400' : classes.text}`}>
          {children}
        </div>
      </div>
    </div>
  )
}
