import type { BoardPost } from '../types/index.ts'
import { formatDate } from '@/shared/utils/format.ts'
import Modal from '@/shared/components/Modal.tsx'
import { Button, IconBadge, Icons, FileList } from '@/shared/components/ui-kit'

interface NoticeDetailModalProps {
  isOpen: boolean
  onClose: () => void
  post: BoardPost | null
  onViewList?: () => void
}

export default function NoticeDetailModal({ isOpen, onClose, post, onViewList }: NoticeDetailModalProps) {
  if (!post) return null

  // 콘텐츠를 줄바꿈 기준으로 단락 처리
  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.trim() === '') {
        return <br key={index} />
      }
      // 제목 스타일 (■ 로 시작하는 라인)
      if (line.startsWith('■')) {
        return (
          <p key={index} className="font-semibold text-slate-800 dark:text-white mt-4 mb-2">
            {line}
          </p>
        )
      }
      // 번호 목록 (1. 2. 3. 등)
      if (/^\d+\./.test(line.trim())) {
        return (
          <p key={index} className="pl-4 text-slate-600 dark:text-slate-300">
            {line}
          </p>
        )
      }
      // 일반 텍스트
      return (
        <p key={index} className="text-slate-600 dark:text-slate-300">
          {line}
        </p>
      )
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={post.title}
      icon={<IconBadge icon={Icons.megaphone} color="blue" size="md" />}
    >
      <div className="space-y-5">
        {/* 메타 정보 */}
        <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
          {/* 작성자 */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
              <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {post.author}
            </span>
          </div>

          <span className="text-slate-300 dark:text-slate-600">|</span>

          {/* 날짜 */}
          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            {formatDate(post.createdAt)}
          </div>

          <span className="text-slate-300 dark:text-slate-600">|</span>

          {/* 조회수 */}
          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            조회 {post.views.toLocaleString()}
          </div>

          {/* N 배지 */}
          {post.isNew && (
            <span className="ml-auto px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded">
              N
            </span>
          )}
        </div>

        {/* 본문 내용 */}
        <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
          <div className="text-sm leading-relaxed space-y-1">
            {post.content ? renderContent(post.content) : (
              <p className="text-slate-500 dark:text-slate-400 italic">
                내용이 없습니다.
              </p>
            )}
          </div>
        </div>

        {/* 첨부파일 */}
        {post.attachments && post.attachments.length > 0 && (
          <FileList attachments={post.attachments} />
        )}

        {/* 버튼 그룹 */}
        <div className="flex gap-3 pt-2">
          {onViewList && (
            <Button
              variant="secondary"
              onClick={() => {
                onClose()
                onViewList()
              }}
              className="flex-1"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              }
            >
              목록보기
            </Button>
          )}
          <Button onClick={onClose} className="flex-1">
            확인
          </Button>
        </div>
      </div>
    </Modal>
  )
}
