import { useState, useRef } from 'react'
import Icon from './Icon'
import { useClickOutside } from '@/shared/hooks/useClickOutside'

export interface SelectOption {
  value: string | number
  label: string
}

export interface SelectProps {
  label?: string
  options: SelectOption[]
  value?: string | number
  defaultValue?: string | number
  onChange?: (value: string) => void
  placeholder?: string
  size?: 'xs' | 'sm' | 'md'
  accentColor?: 'primary' | 'amber' | 'emerald'
  error?: string
  className?: string
}

const accentMap = {
  primary: {
    focus: 'border-[var(--color-primary)] dark:border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30',
    selected: 'bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/20 text-[var(--color-primary)] dark:text-[var(--color-primary)] font-medium',
  },
  amber: {
    focus: 'border-amber-500 dark:border-amber-400 ring-2 ring-amber-500/30',
    selected: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 font-medium',
  },
  emerald: {
    focus: 'border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/30 dark:ring-emerald-400/20',
    selected: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-medium',
  },
}

const sizeClasses = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-2.5 text-sm',
  md: 'px-3 py-3 text-sm',
}

export default function Select({
  label,
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = '선택하세요',
  size = 'md',
  accentColor = 'primary',
  error,
  className = '',
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue)
  const ref = useRef<HTMLDivElement>(null)

  useClickOutside(ref, () => setOpen(false))

  const currentValue = controlledValue ?? internalValue
  const selectedOption = options.find(o => String(o.value) === String(currentValue))
  const accent = accentMap[accentColor]

  const handleSelect = (optValue: string | number) => {
    setInternalValue(optValue)
    onChange?.(String(optValue))
    setOpen(false)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center justify-between ${sizeClasses[size]} border rounded-lg transition-all cursor-pointer ${
            open
              ? `${accent.focus} bg-white dark:bg-slate-800`
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
          } ${error ? 'border-red-500 ring-2 ring-red-500/30' : ''}`}
        >
          <span className={selectedOption ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}>
            {selectedOption?.label ?? placeholder}
          </span>
          <Icon name="chevronDown" className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/30 max-h-64 overflow-y-auto scrollbar-thin py-1">
            {options.map(opt => {
              const isSelected = String(opt.value) === String(currentValue)
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full px-3 py-2 text-sm text-left transition-colors cursor-pointer ${
                    isSelected
                      ? accent.selected
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
