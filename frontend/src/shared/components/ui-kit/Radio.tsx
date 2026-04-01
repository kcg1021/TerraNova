import type { InputHTMLAttributes } from 'react'

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** 라벨 텍스트 */
  label?: string
  /** 크기 */
  size?: 'sm' | 'md'
  /** accent 색상 */
  accentColor?: 'primary' | 'emerald'
}

const SIZE_STYLES = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
}

const ACCENT_STYLES = {
  primary: 'accent-[var(--color-primary)]',
  emerald: 'accent-emerald-500',
}

export default function Radio({
  label,
  size = 'md',
  accentColor = 'primary',
  className = '',
  disabled,
  id,
  ...props
}: RadioProps) {
  const inputId = id ?? (label ? `radio-${label}-${props.value}` : undefined)

  const input = (
    <input
      type="radio"
      id={inputId}
      disabled={disabled}
      className={`${SIZE_STYLES[size]} border-slate-300 dark:border-slate-600 ${ACCENT_STYLES[accentColor]} ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      } ${className}`}
      {...props}
    />
  )

  if (!label) return input

  return (
    <label
      htmlFor={inputId}
      className={`inline-flex items-center gap-2 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      {input}
      <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
    </label>
  )
}
