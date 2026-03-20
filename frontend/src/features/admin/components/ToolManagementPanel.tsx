import { useTools } from '../api/queries'

const CATEGORY_LABELS: Record<string, string> = {
  measure: '측정',
  search: '검색',
  analysis: '분석',
  print: '출력',
  edit: '편집',
  etc: '기타',
}

const CATEGORY_COLORS: Record<string, string> = {
  measure: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  search: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  analysis: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  print: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  edit: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  etc: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
}

export default function ToolManagementPanel() {
  const { data: tools = [] } = useTools()

  const grouped = tools.reduce<Record<string, typeof tools>>((acc, tool) => {
    const cat = tool.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(tool)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">도구 관리</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">공통 도구 풀을 관리합니다. 각 시스템에서 선택하여 사용합니다.</p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer">
          + 도구 추가
        </button>
      </div>

      {/* 카테고리별 도구 목록 */}
      <div className="space-y-4 overflow-y-auto">
        {Object.entries(grouped).map(([category, categoryTools]) => (
          <div key={category} className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${CATEGORY_COLORS[category] ?? CATEGORY_COLORS.etc}`}>
                  {CATEGORY_LABELS[category] ?? category}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{categoryTools.length}개</span>
              </div>
            </div>
            <div>
              {categoryTools.map((tool, i) => (
                <div
                  key={tool.id}
                  className={`flex items-center justify-between px-4 py-3 ${
                    i < categoryTools.length - 1 ? 'border-b border-gray-50 dark:border-gray-800/50' : ''
                  } hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors`}
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{tool.name}</div>
                    {tool.description && (
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{tool.description}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
                      수정
                    </button>
                    <button className="text-xs text-red-400 hover:text-red-600 cursor-pointer">
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
