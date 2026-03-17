import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/shared/contexts/AuthContext.tsx'
import { useSiteConfig } from '@/shared/contexts/SiteConfigContext.tsx'
import { useBoards, usePosts, useSystems } from '../api/queries.ts'
import Sidebar from '../components/Sidebar.tsx'
import BoardSection from '../components/BoardSection.tsx'
import LoginForm from '@/features/auth/components/LoginForm.tsx'
import NoticeDetailModal from '../components/NoticeDetailModal.tsx'
import NoticeListModal from '../components/NoticeListModal.tsx'
import type { BoardPost } from '../types/index.ts'

export default function MainPage() {
  const { user, login } = useAuth()
  const { config } = useSiteConfig()
  const [searchParams] = useSearchParams()
  const initialBoardId = searchParams.get('board')

  const { data: boards = [] } = useBoards()
  const { data: posts = [] } = usePosts()
  const { data: systems = [] } = useSystems()

  // 모달 상태
  const [selectedPost, setSelectedPost] = useState<BoardPost | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showListModal, setShowListModal] = useState(false)

  const visibleBoards = useMemo(() => {
    const notice = boards.filter(b => b.type === 'notice')
    if (!user) return notice

    const extra = boards.filter(
      b => b.type === 'board' && config.displayBoards.includes(b.id)
    )
    return [...notice, ...extra]
  }, [user, config.displayBoards, boards])

  const noticePreview = useMemo(() => {
    return posts
      .filter(p => p.boardId === 'notice')
      .sort((a, b) => b.id - a.id)
      .slice(0, 6)
  }, [posts])

  // 공지사항 클릭 핸들러
  const handlePostClick = (post: BoardPost) => {
    setSelectedPost(post)
    setShowListModal(false)
    setShowDetailModal(true)
  }

  // 전체보기 클릭 핸들러
  const handleViewAllClick = () => {
    setShowDetailModal(false)
    setShowListModal(true)
  }

  // 목록보기 핸들러 (상세에서 목록으로)
  const handleViewListFromDetail = () => {
    setShowDetailModal(false)
    setShowListModal(true)
  }

  // 비로그인: SaaS 스타일 로그인 페이지 + 공지사항
  if (!user) {
    return (
      <div className="flex-1 flex bg-gray-50 dark:bg-gray-950">
        {/* 좌측: 공지사항 영역 */}
        <div className="hidden lg:flex flex-1 flex-col p-12 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
          <div className="flex-1">
            {/* 공지사항 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                공지사항
              </h2>
              <button
                onClick={handleViewAllClick}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-sky-400 cursor-pointer transition-colors flex items-center gap-1"
              >
                전체보기
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* 공지사항 리스트 */}
            <div className="space-y-3">
              {noticePreview.map(post => (
                <div
                  key={post.id}
                  onClick={() => handlePostClick(post)}
                  className="group p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-[var(--color-primary)]/40 dark:hover:border-[var(--color-primary)]/40 hover:shadow-md hover:shadow-[var(--color-primary)]/5 cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-[var(--color-primary)] dark:group-hover:text-sky-400 transition-colors">
                        {post.title}
                        {post.isNew && (
                          <span className="ml-2 inline-block px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded">
                            N
                          </span>
                        )}
                        {post.attachments && post.attachments.length > 0 && (
                          <svg className="inline-block ml-1.5 w-3.5 h-3.5 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                          </svg>
                        )}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {post.author} · {post.createdAt}
                      </p>
                    </div>
                    <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-[var(--color-primary)] dark:group-hover:text-sky-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 우측: 로그인 영역 */}
        <div className="w-full lg:w-[480px] flex-shrink-0 flex items-center justify-center p-6 lg:p-12 bg-white dark:bg-gray-900">
          <div className="w-full max-w-sm">
            {/* 타이틀 */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                로그인
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                계정에 로그인하여 서비스를 이용하세요
              </p>
            </div>

            {/* 로그인 폼 */}
            <LoginForm />

            {/* 빠른 로그인 */}
            <div className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <button onClick={() => login('super', 'super1234')} className="hover:text-[var(--color-primary)] cursor-pointer transition-colors">Super</button>
              <span>·</span>
              <button onClick={() => login('admin', 'admin1234')} className="hover:text-[var(--color-primary)] cursor-pointer transition-colors">Admin</button>
              <span>·</span>
              <button onClick={() => login('user', 'user1234')} className="hover:text-[var(--color-primary)] cursor-pointer transition-colors">User</button>
            </div>

            {/* 푸터 */}
            <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-600">
              <p>문의: 000-0000-0000 (평일 09:30~18:30)</p>
            </div>
          </div>
        </div>

        {/* 모달들 */}
        <NoticeDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          post={selectedPost}
          onViewList={handleViewListFromDetail}
        />

        <NoticeListModal
          isOpen={showListModal}
          onClose={() => setShowListModal(false)}
          posts={posts}
          onSelectPost={handlePostClick}
        />
      </div>
    )
  }

  // 로그인 후: 대시보드 레이아웃
  return (
    <div className="flex-1 flex bg-gray-50 dark:bg-gray-950">
      <Sidebar systems={systems} />

      <div className="flex-1 min-w-0 pb-16 md:pb-0 overflow-y-auto flex flex-col p-6 lg:p-12">
        {/* 게시판 섹션 */}
        <div className="flex-1 min-h-0">
          <BoardSection boards={visibleBoards} posts={posts} initialBoardId={initialBoardId} />
        </div>
      </div>
    </div>
  )
}
