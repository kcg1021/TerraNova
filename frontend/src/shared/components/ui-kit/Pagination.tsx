import Icon from './Icon'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  /** 표시할 최대 페이지 번호 버튼 수 (말줄임 제외, 기본 5) */
  maxVisible?: number
  /** 활성 페이지 색상 (기본: --color-primary) */
  accentColor?: 'primary' | 'emerald'
}

const ACCENT_STYLES = {
  primary: 'bg-[var(--color-primary)] text-white shadow-sm',
  emerald: 'bg-emerald-500 text-white shadow-sm',
}

function getVisiblePages(current: number, total: number, maxVisible: number): (number | '...')[] {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  // 1단계: 필수 페이지 확보 (첫, 끝, 현재, 현재±1)
  const required = new Set<number>()
  required.add(1)
  required.add(total)
  required.add(current)
  if (current > 1) required.add(current - 1)
  if (current < total) required.add(current + 1)

  // 2단계: 남은 슬롯을 현재 페이지 기준 바깥으로 확장
  let left = current - 2
  let right = current + 2
  while (required.size < maxVisible) {
    const added = required.size
    if (left >= 1) required.add(left--)
    if (right <= total) required.add(right++)
    if (required.size === added) break
  }

  // 3단계: 정렬 후 빈 구간에 말줄임 삽입
  const sorted = Array.from(required).sort((a, b) => a - b)
  const result: (number | '...')[] = []

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('...')
    }
    result.push(sorted[i])
  }

  return result
}

export default function Pagination({ currentPage, totalPages, onPageChange, maxVisible = 5, accentColor = 'primary' }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getVisiblePages(currentPage, totalPages, maxVisible)
  const activeStyle = ACCENT_STYLES[accentColor]

  return (
    <div className="flex items-center justify-center gap-1.5">
      {/* 이전 */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <Icon name="chevronLeft" className="w-4 h-4" />
      </button>

      {/* 페이지 번호 */}
      {pages.map((page, idx) =>
        page === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-8 h-8 flex items-center justify-center text-sm text-slate-300 dark:text-slate-600 select-none"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              currentPage === page
                ? activeStyle
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* 다음 */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <Icon name="chevronRight" className="w-4 h-4" />
      </button>
    </div>
  )
}
