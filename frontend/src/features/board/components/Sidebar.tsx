import { useAuth } from '@/shared/contexts/AuthContext.tsx'
import { useCollapsible } from '@/shared/hooks/useCollapsible.ts'
import type { SystemMenu } from '../types/index.ts'
import { Icon } from '@/shared/components/ui-kit'

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
        className={`hidden md:flex flex-col flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-[width] duration-300 ease-in-out ${
          collapsed ? 'w-14' : 'w-56'
        } overflow-hidden`}
      >
        {/* 헤더 */}
        <div className={`flex items-center h-12 border-b border-slate-100 dark:border-slate-800 ${showCollapsed ? 'justify-center' : 'justify-between pl-4 pr-2'}`}>
          {!showCollapsed && (
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">
              시스템 목록
            </span>
          )}
          <button
            onClick={toggle}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={collapsed ? '메뉴 펼치기' : '메뉴 접기'}
          >
            <Icon name="chevronLeft" className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
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
                } hover:bg-slate-50 dark:hover:bg-slate-800/50`}
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-[var(--color-primary)]/10 transition-colors">
                  <Icon name="dashboard" className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-[var(--color-primary)] dark:group-hover:text-sky-400 transition-colors" strokeWidth={1.5} />
                </span>
                {!showCollapsed && (
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-[var(--color-primary)] dark:group-hover:text-sky-400 truncate transition-colors">
                      {sys.name}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 truncate leading-tight">
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
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex gap-2 overflow-x-auto">
        {accessibleSystems.map(sys => (
          <a
            key={sys.id}
            href={sys.url}
            className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-[var(--color-primary)] dark:hover:text-sky-400 hover:bg-[var(--color-primary)]/10 dark:hover:bg-sky-400/10 transition-all"
          >
            <Icon name="dashboard" className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-xs font-medium whitespace-nowrap">{sys.name}</span>
          </a>
        ))}
      </div>
    </>
  )
}
