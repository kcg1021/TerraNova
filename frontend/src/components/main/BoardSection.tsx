import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import type { Board, BoardPost } from '../../types/board'
import Toast from '../common/Toast'

interface BoardSectionProps {
  boards: Board[]
  posts: BoardPost[]
  maxPosts?: number
}

export default function BoardSection({ boards, posts, maxPosts }: BoardSectionProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(boards[0]?.id ?? 'notice')
  const [expanded, setExpanded] = useState(false)
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
    <svg className="inline-block ml-1.5 w-3.5 h-3.5 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )

  const showLock = (post: BoardPost) => !user && !post.isPublic

  return (
    <>
      <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
        {/* 탭 바 */}
        <div className="flex items-center border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 overflow-x-auto flex-shrink-0">
          {boards.map(board => {
            const isActive = activeTab === board.id
            const count = posts.filter(p => p.boardId === board.id).length
            return (
              <button
                key={board.id}
                onClick={() => handleTabChange(board.id)}
                className={`relative flex-shrink-0 px-5 py-3.5 text-sm font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-900'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  {board.name}
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-normal ${
                    isActive
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400'
                      : 'bg-gray-200/70 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                  }`}>
                    {count}
                  </span>
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-500 dark:bg-emerald-400 rounded-t-full" />
                )}
              </button>
            )
          })}
        </div>

        {/* 게시물 목록 */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {activePosts.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <svg className="w-10 h-10 mx-auto text-gray-200 dark:text-gray-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p className="text-sm text-gray-400 dark:text-gray-500">등록된 게시물이 없습니다.</p>
              </div>
            </div>
          ) : (
            <>
              {/* PC: 테이블 */}
              <table className="w-full hidden sm:table">
                <thead className="sticky top-0 z-10 bg-white dark:bg-gray-900">
                  <tr className="border-b border-gray-100 dark:border-gray-800 text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    <th className="px-5 py-2.5 text-left font-medium w-16">번호</th>
                    <th className="px-5 py-2.5 text-left font-medium">제목</th>
                    <th className="px-5 py-2.5 text-left font-medium w-24">작성자</th>
                    <th className="px-5 py-2.5 text-left font-medium w-28">작성일</th>
                    <th className="px-5 py-2.5 text-right font-medium w-20">조회</th>
                  </tr>
                </thead>
                <tbody>
                  {activePosts.map(post => (
                    <tr
                      key={post.id}
                      onClick={() => handlePostClick(post)}
                      className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/70 dark:hover:bg-gray-800/30 transition-colors duration-100 cursor-pointer group"
                    >
                      <td className="px-5 py-3 text-xs text-gray-400 dark:text-gray-500">
                        {post.id}
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm text-gray-800 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {post.title}
                        </span>
                        {post.isNew && (
                          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/50 rounded">
                            N
                          </span>
                        )}
                        {post.hasAttachment && (
                          <svg className="inline-block ml-1.5 w-3.5 h-3.5 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                          </svg>
                        )}
                        {showLock(post) && <LockIcon />}
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-500 dark:text-gray-400">
                        {post.author}
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-400 dark:text-gray-500">
                        {post.createdAt}
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-400 dark:text-gray-500 text-right">
                        {post.views.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 모바일: 카드 리스트 */}
              <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-800">
                {activePosts.map(post => (
                  <div
                    key={post.id}
                    onClick={() => handlePostClick(post)}
                    className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-sm text-gray-800 dark:text-gray-200 leading-snug flex-1">
                        {post.title}
                        {post.isNew && (
                          <span className="ml-1.5 inline-flex items-center px-1 py-0.5 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/50 rounded">
                            N
                          </span>
                        )}
                        {post.hasAttachment && (
                          <svg className="inline-block ml-1 w-3 h-3 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                          </svg>
                        )}
                        {showLock(post) && <LockIcon />}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                      <span>{post.author}</span>
                      <span>{post.createdAt}</span>
                      <span>조회 {post.views}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 더보기 / 접기 */}
        {canExpand && (
          <div className="flex-shrink-0 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setExpanded(prev => !prev)}
              className="w-full py-2.5 text-xs text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              {expanded ? (
                <>
                  접기
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                  </svg>
                </>
              ) : (
                <>
                  더보기 ({allActivePosts.length - maxPosts!}건)
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
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
