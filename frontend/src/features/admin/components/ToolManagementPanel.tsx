import { useState } from 'react'
import { Icon } from '@/shared/components/ui-kit'
import { useTools } from '../api/queries'

const CATEGORY_LABELS: Record<string, string> = {
  measure: '측정',
  search: '검색',
  analysis: '분석',
  print: '출력',
  edit: '편집',
  etc: '기타',
}

const CATEGORY_ACCENT: Record<string, { dot: string; border: string; bg: string; text: string }> = {
  measure: { dot: 'bg-blue-500', border: 'border-l-blue-500', bg: 'bg-blue-500/5 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
  search: { dot: 'bg-amber-500', border: 'border-l-amber-500', bg: 'bg-amber-500/5 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
  analysis: { dot: 'bg-purple-500', border: 'border-l-purple-500', bg: 'bg-purple-500/5 dark:bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400' },
  print: { dot: 'bg-slate-400', border: 'border-l-slate-400', bg: 'bg-slate-500/5 dark:bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400' },
  edit: { dot: 'bg-emerald-500', border: 'border-l-emerald-500', bg: 'bg-emerald-500/5 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
  etc: { dot: 'bg-gray-400', border: 'border-l-gray-400', bg: 'bg-gray-500/5 dark:bg-gray-500/10', text: 'text-gray-500 dark:text-gray-400' },
}

type CategoryKey = string

export default function ToolManagementPanel() {
  const { data: tools = [] } = useTools()
  const [activeFilter, setActiveFilter] = useState<CategoryKey | 'all'>('all')

  const grouped = tools.reduce<Record<string, typeof tools>>((acc, tool) => {
    const cat = tool.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(tool)
    return acc
  }, {})

  const categories = Object.keys(grouped)
  const filteredTools = activeFilter === 'all' ? tools : tools.filter(t => t.category === activeFilter)

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">도구 관리</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            공통 도구 풀을 관리합니다 · {tools.length}개
          </p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer">
          + 도구 추가
        </button>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto scrollbar-thin pb-0.5">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          전체 {tools.length}
        </button>
        {categories.map(cat => {
          const accent = CATEGORY_ACCENT[cat]
          const count = grouped[cat].length
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === cat
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${accent?.dot ?? 'bg-gray-400'}`} />
              {CATEGORY_LABELS[cat] ?? cat} {count}
            </button>
          )
        })}
      </div>

      {/* 도구 그리드 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
          {filteredTools.map(tool => {
            const accent = CATEGORY_ACCENT[tool.category] ?? CATEGORY_ACCENT.etc
            return (
              <div
                key={tool.id}
                className={`group relative border-l-[3px] ${accent.border} bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-lg rounded-l-none px-4 py-3 hover:shadow-md hover:shadow-gray-200/50 dark:hover:shadow-black/20 transition-all`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{tool.name}</span>
                      <span className={`text-xs ${accent.text}`}>
                        {CATEGORY_LABELS[tool.category]}
                      </span>
                    </div>
                    {tool.description && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">{tool.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors" title="수정">
                      <Icon name="pencil" className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer transition-colors" title="삭제">
                      <Icon name="trash" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="flex items-center justify-center py-16 text-sm text-gray-400 dark:text-gray-500">
            이 카테고리에 등록된 도구가 없습니다
          </div>
        )}
      </div>
    </div>
  )
}
