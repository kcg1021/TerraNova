import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  color?: 'blue' | 'amber' | 'gray'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  loadingText?: string
  fullWidth?: boolean
  icon?: ReactNode
}

// 로딩 스피너 컴포넌트
function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  color = 'blue',
  size = 'md',
  loading = false,
  loadingText,
  fullWidth = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-5 text-sm',
    lg: 'py-3.5 px-6 text-sm',
  }

  const colorClasses = {
    blue: {
      bg: 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]',
      shadow: 'shadow-blue-500/15 hover:shadow-blue-500/25',
    },
    amber: {
      bg: 'bg-amber-500 hover:bg-amber-600',
      shadow: 'shadow-amber-500/15 hover:shadow-amber-500/25',
    },
    gray: {
      bg: 'bg-slate-700 hover:bg-slate-600',
      shadow: 'shadow-slate-500/15 hover:shadow-slate-500/25',
    },
  }

  const variantClasses = {
    primary: `
      font-semibold text-white
      ${colorClasses[color].bg}
      disabled:bg-slate-400
      shadow-md ${colorClasses[color].shadow} disabled:shadow-none
    `,
    secondary: `
      font-medium text-slate-600 dark:text-slate-400
      bg-slate-100 dark:bg-slate-800
      hover:bg-slate-200 dark:hover:bg-slate-700
      hover:text-slate-900 dark:hover:text-white
    `,
    ghost: `
      font-medium text-slate-600 dark:text-slate-400
      hover:bg-slate-100 dark:hover:bg-slate-800
      hover:text-slate-900 dark:hover:text-white
    `,
  }

  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        rounded-xl transition-all duration-200 cursor-pointer
        disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Spinner className="w-4 h-4" />
          {loadingText || children}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
