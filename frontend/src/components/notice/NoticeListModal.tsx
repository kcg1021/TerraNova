import { useState, useMemo } from 'react'
import type { BoardPost } from '../../types/board'
import { Input, Button, IconBadge, Icons } from '../ui-kit'

interface NoticeListModalProps {
  isOpen: boolean
  onClose: () => void
  posts: BoardPost[]
  onSelectPost: (post: BoardPost) => void
}

export default function NoticeListModal({ isOpen, onClose, posts, onSelectPost }: NoticeListModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // 공지사항만 필터링하고 정렬
  const noticePosts = useMemo(() => {
    return posts
      .filter(p => p.boardId === 'notice')
      .sort((a, b) => b.id - a.id)
  }, [posts])

  // 검색 필터링
  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) return noticePosts
    const term = searchTerm.toLowerCase()
    return noticePosts.filter(
      p => p.title.toLowerCase().includes(term) || p.author.toLowerCase().includes(term)
    )
  }, [noticePosts, searchTerm])

  // 페이지네이션
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredPosts.slice(start, start + itemsPerPage)
  }, [filteredPosts, currentPage])

  // 검색어 변경 시 첫 페이지로
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleClose = () => {
    setSearchTerm('')
    setCurrentPage(1)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* 모달 컨테이너 */}
      <div className="relative w-full max-w-2xl overflow-hidden modal-content">
        <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-slate-900/20 dark:shadow-black/40 border border-t-0 border-slate-200/50 dark:border-slate-700/50 overflow-hidden">

          {/* 상단 장식 바 */}
          <div className="h-1 bg-[var(--color-primary)]" />

          {/* 닫기 버튼 */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer group"
          >
            <svg
              className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* 헤더 */}
          <div className="px-8 pt-8 pb-4">
            <div className="flex justify-center mb-4">
              <IconBadge icon={Icons.list} color="blue" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white text-center">
              공지사항
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 text-center">
              총 {filteredPosts.length}건의 공지사항이 있습니다
            </p>
          </div>

          {/* 검색 바 */}
          <div className="px-8 pb-4">
            <Input
              type="text"
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
              placeholder="제목 또는 작성자로 검색..."
              icon={Icons.search}
              size="md"
            />
          </div>

          {/* 공지사항 목록 */}
          <div className="px-8 pb-4">
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
              {paginatedPosts.length > 0 ? (
                paginatedPosts.map((post, index) => (
                  <div
                    key={post.id}
                    onClick={() => onSelectPost(post)}
                    className="group p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[var(--color-primary)]/30 rounded-xl cursor-pointer transition-all duration-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      {/* 번호 */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {post.id}
                        </span>
                      </div>

                      {/* 내용 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-medium text-slate-800 dark:text-white truncate group-hover:text-[var(--color-primary)] dark:group-hover:text-sky-400 transition-colors">
                            {post.title}
                          </h3>
                          {post.isNew && (
                            <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-500 rounded">
                              NEW
                            </span>
                          )}
                          {post.hasAttachment && (
                            <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                            </svg>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <span>{post.author}</span>
                          <span className="text-slate-300 dark:text-slate-600">|</span>
                          <span>{post.createdAt}</span>
                          <span className="text-slate-300 dark:text-slate-600">|</span>
                          <span>조회 {post.views.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* 화살표 */}
                      <svg className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-[var(--color-primary)] dark:group-hover:text-sky-400 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <svg className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    검색 결과가 없습니다
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="px-8 pb-4">
              <div className="flex items-center justify-center gap-1">
                {/* 이전 */}
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>

                {/* 페이지 번호 */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      currentPage === page
                        ? 'bg-[var(--color-primary)] text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* 다음 */}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* 하단 버튼 */}
          <div className="px-8 pb-8">
            <Button onClick={handleClose} fullWidth>
              닫기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
