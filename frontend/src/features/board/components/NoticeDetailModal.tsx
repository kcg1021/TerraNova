import type { BoardPost } from '../types/index.ts'
import { formatDate } from '@/shared/utils/format.ts'
import Modal from '@/shared/components/Modal.tsx'
import { Button, IconBadge, Icons, FileList, Icon } from '@/shared/components/ui-kit'

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
              <Icon name="user" className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {post.author}
            </span>
          </div>

          <span className="text-slate-300 dark:text-slate-600">|</span>

          {/* 날짜 */}
          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <Icon name="calendar" className="w-4 h-4" />
            {formatDate(post.createdAt)}
          </div>

          <span className="text-slate-300 dark:text-slate-600">|</span>

          {/* 조회수 */}
          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <Icon name="eye" className="w-4 h-4" />
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
