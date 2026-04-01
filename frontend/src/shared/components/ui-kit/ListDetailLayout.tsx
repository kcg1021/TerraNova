import { type ReactNode } from 'react'
import Icon from './Icon'
import Input from './Input'
import Pagination from './Pagination'

export interface ListDetailLayoutProps {
  /** 좌측 목록 아이템 렌더링 */
  listItems: ReactNode
  /** 우측 상세 영역 */
  children: ReactNode
  /** 좌측 패널 너비 (tailwind class, 데스크탑 전용) */
  listWidth?: string
  /** 검색 설정 */
  search?: {
    value: string
    onChange: (value: string) => void
    placeholder?: string
  }
  /** 페이지네이션 설정 */
  pagination?: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
  }
  /** 목록이 비었을 때 표시할 메시지 */
  emptyMessage?: string
  /** 목록 아이템 개수 (빈 목록 판단용) */
  itemCount: number
  /** 모바일에서 상세 보기 활성화 여부 (항목 선택됨) */
  hasSelection?: boolean
  /** 모바일에서 목록으로 돌아가기 */
  onBack?: () => void
  /** 페이지네이션 accent 색상 */
  accentColor?: 'primary' | 'emerald'
}

export default function ListDetailLayout({
  listItems,
  children,
  listWidth = 'md:w-60',
  search,
  pagination,
  emptyMessage = '항목이 없습니다',
  itemCount,
  hasSelection = false,
  onBack,
  accentColor = 'primary',
}: ListDetailLayoutProps) {
  return (
    <div className="flex gap-4 flex-1 min-h-0">
      {/* 좌측: 목록 — 모바일에서는 전체 너비, 데스크탑에서는 고정 너비 */}
      <div className={`flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden flex-1 md:flex-none ${listWidth} md:shrink-0 ${
        hasSelection ? 'hidden md:flex' : 'flex'
      }`}>
        {search && (
          <div className="p-3 border-b border-slate-100 dark:border-slate-800">
            <Input
              icon={<Icon name="search" className="w-4 h-4" />}
              value={search.value}
              onChange={e => search.onChange(e.target.value)}
              placeholder={search.placeholder ?? '검색...'}
              accentColor="emerald"
              size="sm"
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {listItems}
          {itemCount === 0 && (
            <div className="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500">{emptyMessage}</div>
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="p-3 border-t border-slate-100 dark:border-slate-800">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.onPageChange}
              accentColor={accentColor}
            />
          </div>
        )}
      </div>

      {/* 우측: 상세 */}
      <div className={`flex-1 min-w-0 flex-col ${
        hasSelection ? 'flex' : 'hidden md:flex'
      }`}>
        {/* 모바일 뒤로가기 */}
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden flex items-center gap-1.5 mb-3 px-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <Icon name="chevronLeft" className="w-4 h-4" />
            목록으로
          </button>
        )}
        {children}
      </div>
    </div>
  )
}
