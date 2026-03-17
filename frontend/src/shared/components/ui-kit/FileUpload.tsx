import { useState, useRef, useCallback } from 'react'
import type { Attachment } from '@/shared/types/attachment.ts'
import { formatFileSize } from '@/shared/utils/file.ts'

interface FileUploadProps {
  value: Attachment[]
  onChange: (files: Attachment[]) => void
  maxFiles?: number
  maxSizeMB?: number
  accept?: string
}

export default function FileUpload({
  value,
  onChange,
  maxFiles = 5,
  maxSizeMB = 10,
  accept,
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const processFiles = useCallback((fileList: FileList) => {
    setError('')
    const newFiles: Attachment[] = []

    const remaining = maxFiles - value.length
    if (remaining <= 0) {
      setError(`최대 ${maxFiles}개까지 첨부할 수 있습니다.`)
      return
    }

    const filesToProcess = Array.from(fileList).slice(0, remaining)

    for (const file of filesToProcess) {
      if (file.size > maxSizeBytes) {
        setError(`${file.name}: 파일 크기가 ${maxSizeMB}MB를 초과합니다.`)
        continue
      }

      newFiles.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream',
        url: URL.createObjectURL(file),
        thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      })
    }

    if (newFiles.length > 0) {
      onChange([...value, ...newFiles])
    }
  }, [value, onChange, maxFiles, maxSizeBytes, maxSizeMB])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }, [processFiles])

  const handleRemove = (id: string) => {
    onChange(value.filter(f => f.id !== id))
  }

  return (
    <div className="space-y-3">
      {/* 드롭존 */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
          dragOver
            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-800/30'
        }`}
      >
        <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            파일을 드래그하거나 <span className="text-[var(--color-primary)] dark:text-sky-400 font-medium">클릭하여 선택</span>
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            최대 {maxFiles}개, 파일당 {maxSizeMB}MB
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={e => {
            if (e.target.files && e.target.files.length > 0) {
              processFiles(e.target.files)
              e.target.value = ''
            }
          }}
        />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {/* 첨부된 파일 목록 */}
      {value.length > 0 && (
        <div className="space-y-1.5">
          {value.map(file => (
            <div
              key={file.id}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
            >
              {/* 썸네일 or 아이콘 */}
              {file.thumbnailUrl ? (
                <img src={file.thumbnailUrl} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />
              ) : (
                <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{file.fileName}</p>
                <p className="text-xs text-slate-400">{formatFileSize(file.fileSize)}</p>
              </div>

              <button
                onClick={() => handleRemove(file.id)}
                className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                title="삭제"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export type { FileUploadProps }
