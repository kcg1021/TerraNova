import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '@/shared/contexts/AuthContext.tsx'
import { usePost, useBoards } from '../api/queries.ts'
import { FileList } from '@/shared/components/ui-kit'

export default function PostDetailPage() {
  const { boardId, postId } = useParams<{ boardId: string; postId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: post, isPending: postLoading } = usePost(boardId, postId ? Number(postId) : undefined)
  const { data: boards = [] } = useBoards()
  const board = boards.find(b => b.id === boardId)

  if (postLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3rem)] md:h-[calc(100vh-3.5rem)]">
        <div className="text-sm text-gray-400 dark:text-gray-500">불러오는 중...</div>
      </div>
    )
  }

  // 게시글 없음
  if (!post || !board) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3rem)] md:h-[calc(100vh-3.5rem)]">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">게시글을 찾을 수 없습니다</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">삭제되었거나 존재하지 않는 게시글입니다.</p>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-[var(--color-primary)] dark:text-sky-400 hover:underline cursor-pointer"
          >
            메인으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  // 비로그인 + 비공개 게시글 → 로그인 페이지로 리다이렉트
  if (!user && !post.isPublic) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex-1 flex justify-center bg-gray-50 dark:bg-gray-950">
      {/* 고정 너비 컨테이너: 모바일 전체, 태블릿 640px, 데스크탑 720px */}
      <div className="w-full sm:w-[640px] lg:w-[720px] p-4 sm:p-6 lg:py-10">
        {/* 뒤로가기 */}
        <button
          onClick={() => navigate(`/?board=${boardId}`)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-sky-400 transition-colors mb-4 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          목록으로
        </button>

        {/* 게시글 카드 */}
        <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
          {/* 헤더 */}
          <header className="px-5 sm:px-6 py-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-primary)]/10 dark:bg-sky-400/10 text-[var(--color-primary)] dark:text-sky-400 font-medium">
                {board.name}
              </span>
              {post.isPublic && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                  공개
                </span>
              )}
            </div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white leading-snug">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-400 dark:text-gray-500">
              <span>{post.author}</span>
              <span>{post.createdAt}</span>
              <span>조회 {post.views.toLocaleString()}</span>
              {post.attachments && post.attachments.length > 0 && (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                  </svg>
                  첨부파일 {post.attachments.length}개
                </span>
              )}
            </div>
          </header>

          {/* 본문 */}
          <div className="px-5 sm:px-6 py-6 min-h-[200px]">
            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {post.content ?? '본문 내용이 없습니다.'}
            </div>
          </div>

          {/* 첨부파일 */}
          {post.attachments && post.attachments.length > 0 && (
            <div className="px-5 sm:px-6 pb-6">
              <FileList attachments={post.attachments} />
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
