import { type ReactNode } from 'react'
import Icon from './Icon'
import Input from './Input'
import Pagination from './Pagination'

export interface ListDetailLayoutProps {
  /** 좌측 목록 아이템 렌더링 */
  listItems: ReactNode
  /** 우측 상세 영역 */
  children: ReactNode
  /** 좌측 패널 너비 (tailwind class) */
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
}

export default function ListDetailLayout({
  listItems,
  children,
  listWidth = 'w-72',
  search,
  pagination,
  emptyMessage = '항목이 없습니다',
  itemCount,
}: ListDetailLayoutProps) {
  return (
    <div className="flex gap-4 flex-1 min-h-0">
      {/* 좌측: 목록 */}
      <div className={`${listWidth} shrink-0 flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden`}>
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
            />
          </div>
        )}
      </div>

      {/* 우측: 상세 */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  )
}
