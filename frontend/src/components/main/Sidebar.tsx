import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import type { SystemMenu } from '../../types/board'

interface SidebarProps {
  systems: SystemMenu[]
}

export default function Sidebar({ systems }: SidebarProps) {
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const accessibleSystems = systems.filter(
    sys => user && sys.requiredRoles.includes(user.role)
  )

  if (!user || accessibleSystems.length === 0) return null

  return (
    <>
      {/* 데스크탑 사이드바 */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200/80 dark:border-gray-800 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-12 overflow-visible' : 'w-56'
        }`}
      >
        {/* 헤더 */}
        <div className={`flex items-center h-10 border-b border-gray-100 dark:border-gray-800 ${collapsed ? 'justify-center' : 'justify-between pl-4 pr-2'}`}>
          {!collapsed && (
            <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              시스템 목록
            </span>
          )}
          <button
            onClick={() => setCollapsed(prev => !prev)}
            className="p-1 rounded text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title={collapsed ? '메뉴 펼치기' : '메뉴 접기'}
          >
            <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        </div>

        {/* 시스템 목록 */}
        <nav className={`flex-1 py-1.5 ${collapsed ? 'overflow-visible' : 'overflow-y-auto'}`}>
          {accessibleSystems.map(sys => (
            <div
              key={sys.id}
              className="relative"
              onMouseEnter={() => collapsed && setHoveredId(sys.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <a
                href={sys.url}
                className={`group flex items-center gap-2.5 transition-colors duration-150 ${
                  collapsed
                    ? 'justify-center py-2.5 mx-1 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                    : 'px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors">
                  <svg className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </span>
                {!collapsed && (
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 truncate transition-colors">
                      {sys.name}
                    </div>
                    <div className="text-[11px] text-gray-400 dark:text-gray-500 truncate leading-tight">
                      {sys.description}
                    </div>
                  </div>
                )}
              </a>

              {/* 접힘 상태 호버 팝업 */}
              {collapsed && hoveredId === sys.id && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 pointer-events-none">
                  <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg shadow-gray-200/50 dark:shadow-black/30 px-3 py-2 w-48">
                    {/* 화살표 */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-gray-200 dark:border-r-gray-700" />
                    <div className="absolute right-full top-1/2 -translate-y-1/2 ml-px w-0 h-0 border-y-[5px] border-y-transparent border-r-[5px] border-r-white dark:border-r-gray-800" style={{ marginLeft: '1px' }} />
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{sys.name}</div>
                    <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 leading-snug">{sys.description}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* 모바일: 하단 고정 바 */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-2 py-1.5 flex gap-1 overflow-x-auto">
        {accessibleSystems.map(sys => (
          <a
            key={sys.id}
            href={sys.url}
            className="flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            <span className="text-[10px] font-medium whitespace-nowrap">{sys.name}</span>
          </a>
        ))}
      </div>
    </>
  )
}
