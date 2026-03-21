import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  icon?: ReactNode
  error?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'floating'
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
  onFocus,
  onBlur,
  value,
  placeholder,
  ...props
}, ref) => {
  // floating variant 전용 상태
  const [isFocused, setIsFocused] = useState(false)

  if (variant === 'floating') {
    const hasValue = !!value

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    return (
      <div className="relative">
        <label
          className={`
            absolute left-0 transition-all duration-200 pointer-events-none
            ${isFocused || hasValue ? '-top-6 text-xs' : 'top-3 text-sm'}
            ${error
              ? 'text-red-500 dark:text-red-400'
              : isFocused
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-400 dark:text-slate-500'
            }
          `}
        >
          {label}
        </label>
        <input
          ref={ref}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFocused ? placeholder : ''}
          className={`
            w-full py-3 bg-transparent border-b-2 text-sm
            text-slate-900 dark:text-white
            placeholder-slate-300 dark:placeholder-slate-600
            focus:outline-none transition-colors
            ${error
              ? 'border-red-300 dark:border-red-500'
              : isFocused
                ? 'border-slate-900 dark:border-white'
                : 'border-slate-200 dark:border-slate-700'
            }
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="absolute -bottom-5 left-0 text-xs text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    )
  }

  // default / filled variant
  const sizeClasses = {
    sm: 'py-2.5 text-sm',
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
    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'

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
          value={value}
          placeholder={placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`
            w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 ${sizeClasses[size]}
            ${baseClasses}
            rounded-lg text-slate-900 dark:text-white
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
