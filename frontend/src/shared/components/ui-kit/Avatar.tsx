export interface AvatarProps {
  name: string
  size?: 'sm' | 'md'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
}

export default function Avatar({ name, size = 'sm', className = '' }: AvatarProps) {
  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-300 shrink-0 ${className}`}
    >
      {name.charAt(0)}
    </div>
  )
}
