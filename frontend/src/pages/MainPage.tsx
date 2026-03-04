import { useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSiteConfig } from '../contexts/SiteConfigContext'
import Sidebar from '../components/main/Sidebar'
import BoardSection from '../components/main/BoardSection'
import LoginForm from '../components/auth/LoginForm'
import NoticeDetailModal from '../components/notice/NoticeDetailModal'
import NoticeListModal from '../components/notice/NoticeListModal'
import { mockBoards, mockPosts, mockSystems } from '../mocks/mainPageData'
import type { BoardPost } from '../types/board'

export default function MainPage() {
  const { user } = useAuth()
  const { config } = useSiteConfig()

  // 모달 상태
  const [selectedPost, setSelectedPost] = useState<BoardPost | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showListModal, setShowListModal] = useState(false)

  const visibleBoards = useMemo(() => {
    const notice = mockBoards.filter(b => b.type === 'notice')
    if (!user) return notice

    const extra = mockBoards.filter(
      b => b.type === 'board' && config.displayBoards.includes(b.id)
    )
    return [...notice, ...extra]
  }, [user, config.displayBoards])

  const noticePreview = useMemo(() => {
    return mockPosts
      .filter(p => p.boardId === 'notice')
      .sort((a, b) => b.id - a.id)
      .slice(0, 6)
  }, [])

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
        {/* 좌측: 로그인 영역 */}
        <div className="w-full lg:w-[480px] flex-shrink-0 flex items-center justify-center p-6 lg:p-12 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
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

            {/* 푸터 */}
            <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-600">
              <p>문의: 000-0000-0000 (평일 09:30~18:30)</p>
            </div>
          </div>
        </div>

        {/* 우측: 공지사항 영역 */}
        <div className="hidden lg:flex flex-1 flex-col p-12">
          <div className="flex-1">
            {/* 공지사항 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                공지사항
              </h2>
              <button
                onClick={handleViewAllClick}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary)] cursor-pointer transition-colors flex items-center gap-1"
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
                  className="group p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-[var(--color-primary)]/40 dark:hover:border-[var(--color-primary)]/40 hover:shadow-md hover:shadow-[var(--color-primary)]/5 cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-[var(--color-primary)] transition-colors">
                        {post.title}
                        {post.isNew && (
                          <span className="ml-2 inline-block px-1.5 py-0.5 text-[10px] font-bold text-white bg-gradient-to-r from-red-500 to-rose-500 rounded">
                            NEW
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {post.author} · {post.createdAt}
                      </p>
                    </div>
                    <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
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
          posts={mockPosts}
          onSelectPost={handlePostClick}
        />
      </div>
    )
  }

  // 로그인 후: 사이드바 + 게시판
  return (
    <div className="flex flex-1 min-h-0">
      <Sidebar systems={mockSystems} />

      <div className="flex-1 min-w-0 p-4 md:p-6 pb-16 md:pb-6 flex flex-col">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            안녕하세요, {user.name}님
          </h2>
        </div>

        <div className="flex-1 min-h-0">
          <BoardSection boards={visibleBoards} posts={mockPosts} />
        </div>
      </div>
    </div>
  )
}
