export interface LoadingStateProps {
  message?: string
  className?: string
}

export default function LoadingState({ message = '불러오는 중...', className = '' }: LoadingStateProps) {
  return (
    <div className={`flex-1 flex items-center justify-center ${className}`}>
      <div className="text-sm text-slate-400 dark:text-slate-500">{message}</div>
    </div>
  )
}
