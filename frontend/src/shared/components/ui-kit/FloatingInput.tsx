import { forwardRef, useState, type InputHTMLAttributes } from 'react'

export interface FloatingInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string
  error?: string
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(({
  label,
  error,
  className = '',
  onFocus,
  onBlur,
  value,
  placeholder,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)
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
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-400 dark:text-gray-500'
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
          text-gray-900 dark:text-white
          placeholder-gray-300 dark:placeholder-gray-600
          focus:outline-none transition-colors
          ${error
            ? 'border-red-300 dark:border-red-500'
            : isFocused
              ? 'border-gray-900 dark:border-white'
              : 'border-gray-200 dark:border-gray-700'
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
})

FloatingInput.displayName = 'FloatingInput'

export default FloatingInput
