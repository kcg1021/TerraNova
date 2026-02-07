import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { mockPosts, mockBoards } from '../mocks/mainPageData'

export default function PostDetailPage() {
  const { boardId, postId } = useParams<{ boardId: string; postId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const post = mockPosts.find(p => p.boardId === boardId && p.id === Number(postId))
  const board = mockBoards.find(b => b.id === boardId)

  // 게시글 없음
  if (!post || !board) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3rem)] md:h-[calc(100vh-3.5rem)]">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">게시글을 찾을 수 없습니다</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">삭제되었거나 존재하지 않는 게시글입니다.</p>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
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
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* 뒤로가기 */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-4 cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        목록으로
      </button>

      {/* 게시글 카드 */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {/* 헤더 */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 font-medium">
              {board.name}
            </span>
            {post.isPublic && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-500 dark:text-blue-400 font-medium">
                공개
              </span>
            )}
          </div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white leading-snug">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 dark:text-gray-500">
            <span>{post.author}</span>
            <span>{post.createdAt}</span>
            <span>조회 {post.views.toLocaleString()}</span>
            {post.hasAttachment && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                </svg>
                첨부파일
              </span>
            )}
          </div>
        </div>

        {/* 본문 */}
        <div className="px-6 py-6">
          <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {post.content ?? '본문 내용이 없습니다.'}
          </div>
        </div>
      </div>
    </div>
  )
}
