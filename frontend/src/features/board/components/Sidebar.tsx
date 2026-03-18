import { useAuth } from '@/shared/contexts/AuthContext.tsx'
import { useCollapsible } from '@/shared/hooks/useCollapsible.ts'
import type { SystemMenu } from '../types/index.ts'

interface SidebarProps {
  systems: SystemMenu[]
}

export default function Sidebar({ systems }: SidebarProps) {
  const { user } = useAuth()
  const { collapsed, showCollapsed, toggle, handleTransitionEnd } = useCollapsible()

  const accessibleSystems = systems.filter(
    sys => user && sys.requiredRoles.includes(user.role)
  )

  if (!user || accessibleSystems.length === 0) return null

  return (
    <>
      {/* 데스크탑 사이드바 */}
      <aside
        onTransitionEnd={handleTransitionEnd}
        className={`hidden md:flex flex-col flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-[width] duration-300 ease-in-out ${
          collapsed ? 'w-14' : 'w-56'
        } overflow-hidden`}
      >
        {/* 헤더 */}
        <div className={`flex items-center h-12 border-b border-gray-100 dark:border-gray-800 ${showCollapsed ? 'justify-center' : 'justify-between pl-4 pr-2'}`}>
          {!showCollapsed && (
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">
              시스템 목록
            </span>
          )}
          <button
            onClick={toggle}
            className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title={collapsed ? '메뉴 펼치기' : '메뉴 접기'}
          >
            <svg className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        </div>

        {/* 시스템 목록 */}
        <nav className="flex-1 py-2 overflow-x-hidden overflow-y-auto scrollbar-thin">
          {accessibleSystems.map(sys => (
            <div key={sys.id} className="mx-2 mb-0.5">
              <a
                href={sys.url}
                title={showCollapsed ? sys.name : undefined}
                className={`group flex items-center gap-3 h-10 rounded-lg transition-all duration-150 ${
                  showCollapsed
                    ? 'justify-center'
                    : 'px-3'
                } hover:bg-gray-50 dark:hover:bg-gray-800/50`}
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-[var(--color-primary)]/10 transition-colors">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-[var(--color-primary)] dark:group-hover:text-sky-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </span>
                {!showCollapsed && (
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-[var(--color-primary)] dark:group-hover:text-sky-400 truncate transition-colors">
                      {sys.name}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 truncate leading-tight">
                      {sys.description}
                    </div>
                  </div>
                )}
              </a>
            </div>
          ))}
        </nav>
      </aside>

      {/* 모바일: 하단 고정 바 */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 px-3 py-2 flex gap-2 overflow-x-auto">
        {accessibleSystems.map(sys => (
          <a
            key={sys.id}
            href={sys.url}
            className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-sky-400 hover:bg-[var(--color-primary)]/10 dark:hover:bg-sky-400/10 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            <span className="text-xs font-medium whitespace-nowrap">{sys.name}</span>
          </a>
        ))}
      </div>
    </>
  )
}
