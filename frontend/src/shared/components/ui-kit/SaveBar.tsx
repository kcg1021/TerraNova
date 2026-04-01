import Button from './Button'

export interface SaveBarProps {
  isDirty: boolean
  onSave: () => void
  onReset?: () => void
  message?: string
  saveLabel?: string
  resetLabel?: string
}

export default function SaveBar({ isDirty, onSave, onReset, message = '변경사항이 있습니다', saveLabel = '저장', resetLabel = '초기화' }: SaveBarProps) {
  if (!isDirty) return null

  return (
    <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 shrink-0 flex items-center justify-between">
      <p className="text-xs text-slate-500 dark:text-slate-400">{message}</p>
      <div className="flex items-center gap-2">
        {onReset && <Button size="sm" variant="secondary" onClick={onReset}>{resetLabel}</Button>}
        <Button size="sm" onClick={onSave}>{saveLabel}</Button>
      </div>
    </div>
  )
}
