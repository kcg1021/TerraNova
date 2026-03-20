export interface SaveBarProps {
  isDirty: boolean
  onSave: () => void
  message?: string
  saveLabel?: string
}

export default function SaveBar({ isDirty, onSave, message = '변경사항이 있습니다', saveLabel = '저장' }: SaveBarProps) {
  if (!isDirty) return null

  return (
    <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 shrink-0 flex items-center justify-between">
      <p className="text-xs text-amber-600 dark:text-amber-400">{message}</p>
      <button
        onClick={onSave}
        className="px-5 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer"
      >
        {saveLabel}
      </button>
    </div>
  )
}
