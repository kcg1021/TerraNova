import type { ReactNode } from 'react'
import type { BoardPost } from '../types/index.ts'
import { Icon, Badge } from '@/shared/components/ui-kit'

interface PostCardProps {
  post: BoardPost
  onClick: () => void
  className?: string
  /** 제목 뒤에 추가할 요소 (예: 잠금 아이콘) */
  extra?: ReactNode
}

export default function PostCard({ post, onClick, className = '', extra }: PostCardProps) {
  return (
    <div
      onClick={onClick}
      className={`group p-4 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-[var(--color-primary)]/40 dark:hover:border-[var(--color-primary)]/40 hover:shadow-md hover:shadow-[var(--color-primary)]/5 cursor-pointer transition-all duration-200 ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-[var(--color-primary)] dark:group-hover:text-sky-400 transition-colors">
            {post.title}
            {post.isNew && <Badge color="new" className="ml-2 inline-block">N</Badge>}
            {post.attachments && post.attachments.length > 0 && (
              <Icon name="paperclip" className="inline-block ml-1.5 w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
            )}
            {extra}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {post.author} · {post.createdAt}
          </p>
        </div>
        <Icon name="chevronRight" className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-[var(--color-primary)] dark:group-hover:text-sky-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5" />
      </div>
    </div>
  )
}
