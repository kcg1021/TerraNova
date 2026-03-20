import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/contexts/AuthContext.tsx'
import type { Board, BoardPost } from '../types/index.ts'
import Toast from '@/shared/components/Toast.tsx'
import { Icon } from '@/shared/components/ui-kit'

interface BoardSectionProps {
  boards: Board[]
  posts: BoardPost[]
  maxPosts?: number
  initialBoardId?: string | null
}

export default function BoardSection({ boards, posts, maxPosts, initialBoardId }: BoardSectionProps) {
  const navigate = useNavigate()
  const { user } = useAuth()

  // initialBoardId가 유효한 게시판인지 확인
  const validInitialBoard = initialBoardId && boards.some(b => b.id === initialBoardId)
    ? initialBoardId
    : boards[0]?.id ?? 'notice'

  const [activeTab, setActiveTab] = useState(validInitialBoard)
  const [expanded, setExpanded] = useState(false)

  // URL 파라미터로 게시판이 지정된 경우 탭 변경
  useEffect(() => {
    if (initialBoardId && boards.some(b => b.id === initialBoardId)) {
      setActiveTab(initialBoardId)
      setExpanded(false)
    }
  }, [initialBoardId, boards])
  const [showToast, setShowToast] = useState(false)

  const allActivePosts = posts
    .filter(p => p.boardId === activeTab)
    .sort((a, b) => b.id - a.id)

  const canExpand = maxPosts != null && allActivePosts.length > maxPosts
  const activePosts = (maxPosts != null && !expanded) ? allActivePosts.slice(0, maxPosts) : allActivePosts

  const handleTabChange = (boardId: string) => {
    setActiveTab(boardId)
    setExpanded(false)
  }

  const handlePostClick = (post: BoardPost) => {
    if (user || post.isPublic) {
      navigate(`/board/${post.boardId}/${post.id}`)
    } else {
      setShowToast(true)
    }
  }

  const handleToastClose = useCallback(() => setShowToast(false), [])

  // 비로그인 상태에서 비공개 게시글 잠금 아이콘
  const LockIcon = () => (
    <Icon name="lock" className="inline-block ml-1.5 w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
  )

  const showLock = (post: BoardPost) => !user && !post.isPublic

  const activeBoard = boards.find(b => b.id === activeTab)

  return (
    <>
      <div className="flex flex-col h-full">
        {/* 헤더: 게시판 이름 + 탭 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {activeBoard?.name || '게시판'}
          </h2>
          {boards.length > 1 && (
            <div className="flex items-center gap-1">
              {boards.map(board => {
                const isActive = activeTab === board.id
                return (
                  <button
                    key={board.id}
                    onClick={() => handleTabChange(board.id)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? 'text-[var(--color-primary)] dark:text-sky-400 bg-[var(--color-primary)]/10 dark:bg-sky-400/10'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    {board.name}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* 게시물 카드 리스트 */}
        <div className="flex-1 space-y-3 overflow-y-auto">
          {activePosts.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Icon name="documentEmpty" className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-700 mb-3" strokeWidth={1} />
                <p className="text-sm text-gray-400 dark:text-gray-500">등록된 게시물이 없습니다.</p>
              </div>
            </div>
          ) : (
            activePosts.map(post => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post)}
                className="group p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-[var(--color-primary)]/40 dark:hover:border-[var(--color-primary)]/40 hover:shadow-md hover:shadow-[var(--color-primary)]/5 cursor-pointer transition-all duration-200"
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
                        <Icon name="paperclip" className="inline-block ml-1.5 w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
                      )}
                      {showLock(post) && <LockIcon />}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {post.author} · {post.createdAt}
                    </p>
                  </div>
                  <Icon name="chevronRight" className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-[var(--color-primary)] dark:group-hover:text-sky-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* 더보기 / 접기 */}
        {canExpand && (
          <div className="mt-4">
            <button
              onClick={() => setExpanded(prev => !prev)}
              className="w-full py-2.5 text-xs text-gray-400 dark:text-gray-500 hover:text-[var(--color-primary)] dark:hover:text-sky-400 transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              {expanded ? (
                <>
                  접기
                  <Icon name="chevronUp" className="w-3 h-3" />
                </>
              ) : (
                <>
                  더보기 ({allActivePosts.length - maxPosts!}건)
                  <Icon name="chevronDown" className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 로그인 필요 토스트 */}
      {showToast && (
        <Toast
          message="로그인 후 열람할 수 있는 게시글입니다."
          onClose={handleToastClose}
        />
      )}
    </>
  )
}
