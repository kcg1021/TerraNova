import type { ReactNode } from 'react'

export interface AlertProps {
  type?: 'error' | 'info' | 'success' | 'warning'
  title?: string
  children: ReactNode
  className?: string
}

// 아이콘 컴포넌트들
const icons = {
  error: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  ),
  success: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
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
    icon: 'text-[var(--color-primary)]',
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
        {icons[type]}
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
