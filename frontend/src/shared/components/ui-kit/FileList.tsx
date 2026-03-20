import { useState } from 'react'
import type { Attachment } from '@/shared/types/attachment.ts'
import { formatFileSize, isImageFile, getFileIcon } from '@/shared/utils/file.ts'
import Icon from './Icon'

interface FileListProps {
  attachments: Attachment[]
}

const FILE_ICON_COLORS: Record<ReturnType<typeof getFileIcon>, string> = {
  image: 'text-emerald-500',
  pdf: 'text-red-500',
  document: 'text-blue-500',
  spreadsheet: 'text-green-500',
  file: 'text-gray-400',
}

function FileIcon({ type }: { type: ReturnType<typeof getFileIcon> }) {
  const color = FILE_ICON_COLORS[type]

  if (type === 'image') {
    return <Icon name="image" className={`w-5 h-5 ${color}`} />
  }

  return <Icon name="document" className={`w-5 h-5 ${color}`} />
}

export default function FileList({ attachments }: FileListProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  if (attachments.length === 0) return null

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
          <Icon name="paperclip" className="w-4 h-4" />
          첨부파일 ({attachments.length})
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {attachments.map(file => {
            const iconType = getFileIcon(file.mimeType)
            const isImage = isImageFile(file.mimeType)

            return (
              <div
                key={file.id}
                className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {/* 썸네일 or 아이콘 */}
                {isImage && file.thumbnailUrl ? (
                  <button
                    onClick={() => setPreviewUrl(file.previewUrl ?? file.thumbnailUrl ?? file.url)}
                    className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img src={file.thumbnailUrl} alt={file.fileName} className="w-full h-full object-cover" />
                  </button>
                ) : (
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    <FileIcon type={iconType} />
                  </div>
                )}

                {/* 파일 정보 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                    {file.fileName}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {formatFileSize(file.fileSize)}
                  </p>
                </div>

                {/* 미리보기 / 다운로드 */}
                <div className="flex items-center gap-1">
                  {isImage && (
                    <button
                      onClick={() => setPreviewUrl(file.previewUrl ?? file.thumbnailUrl ?? file.url)}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      title="미리보기"
                    >
                      <Icon name="eye" className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={async (e) => {
                      e.stopPropagation()
                      try {
                        const res = await fetch(file.url)
                        const blob = await res.blob()
                        const blobUrl = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = blobUrl
                        a.download = file.fileName
                        a.click()
                        URL.revokeObjectURL(blobUrl)
                      } catch {
                        window.open(file.url, '_blank')
                      }
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="다운로드"
                  >
                    <Icon name="download" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 이미지 미리보기 모달 */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <button
            onClick={() => setPreviewUrl(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
          >
            <Icon name="close" className="w-6 h-6" />
          </button>
          <img
            src={previewUrl}
            alt="미리보기"
            className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}

export type { FileListProps }
