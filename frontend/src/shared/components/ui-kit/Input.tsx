import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  icon?: ReactNode
  error?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled'
  accentColor?: 'primary' | 'amber' | 'emerald'
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  icon,
  error,
  size = 'md',
  variant = 'filled',
  accentColor = 'primary',
  className = '',
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'py-2 text-sm',
    md: 'py-3 text-sm',
    lg: 'py-3.5 text-sm',
  }

  const accentClasses = {
    primary: 'focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]',
    amber: 'focus:ring-amber-500/50 focus:border-amber-500',
    emerald: 'focus:ring-emerald-500/50 focus:border-emerald-500',
  }

  const baseClasses = variant === 'filled'
    ? 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700'
    : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700'

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 [&>svg]:w-5 [&>svg]:h-5">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 ${sizeClasses[size]}
            ${baseClasses}
            rounded-xl text-slate-900 dark:text-white
            placeholder-slate-400 dark:placeholder-slate-500
            focus:outline-none focus:ring-2 ${accentClasses[accentColor]}
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
