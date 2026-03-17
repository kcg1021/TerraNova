import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCollapsible } from '@/shared/hooks/useCollapsible'
import { useSystemMenus, useAdminSystems } from '../api/queries'

interface Props {
  systemId: string
}

export default function SystemMenuSidebar({ systemId }: Props) {
  const navigate = useNavigate()
  const { menuId } = useParams<{ menuId?: string }>()
  const { collapsed, showCollapsed, animating, toggle, handleTransitionEnd } = useCollapsible()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const { data: adminSystems = [] } = useAdminSystems()
  const { data: menus = [] } = useSystemMenus(systemId)

  const system = systemId === 'integrated'
    ? { name: '통합관리', color: '#10b981' }
    : adminSystems.find(s => s.id === systemId)

  const isDashboard = !menuId

  return (
    <>
      {/* 데스크탑 사이드바 */}
      <aside
        onTransitionEnd={handleTransitionEnd}
        className={`hidden md:flex flex-col flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200/80 dark:border-gray-800 transition-[width] duration-300 ease-in-out ${
          collapsed ? 'w-14' : 'w-64'
        } ${animating ? 'overflow-hidden' : collapsed ? 'overflow-visible' : ''}`}
      >
        {/* 헤더 */}
        <div className={`flex items-center h-10 border-b border-gray-100 dark:border-gray-800 ${showCollapsed ? 'justify-center' : 'justify-between pl-4 pr-2'}`}>
          {!showCollapsed && (
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-1 text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer whitespace-nowrap"
            >
              <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              허브
            </button>
          )}
          <button
            onClick={toggle}
            className="p-1 rounded text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title={collapsed ? '메뉴 펼치기' : '메뉴 접기'}
          >
            <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        </div>

        {/* 시스템 이름 */}
        {!showCollapsed && system && (
          <div className="border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 px-4 py-3 whitespace-nowrap">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: system.color }} />
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{system.name}</span>
            </div>
          </div>
        )}

        {/* 메뉴 목록 */}
        <nav className={`flex-1 py-2 ${showCollapsed ? 'overflow-visible' : 'overflow-y-auto'}`}>
          {/* 대시보드 항목 */}
          <div
            className="relative"
            onMouseEnter={() => showCollapsed && setHoveredId('dashboard')}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="mx-2 mb-1">
              <button
                onClick={() => navigate(`/admin/system/${systemId}`)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left cursor-pointer transition-colors ${
                  showCollapsed ? 'justify-center' : ''
                } ${
                  isDashboard
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                }`}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                {!showCollapsed && <span className="text-sm whitespace-nowrap">대시보드</span>}
              </button>
            </div>

            {/* 접힘 호버 팝업 */}
            {showCollapsed && hoveredId === 'dashboard' && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 pointer-events-none">
                <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg shadow-gray-200/50 dark:shadow-black/30 px-3 py-2">
                  <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-gray-200 dark:border-r-gray-700" />
                  <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-[5px] border-y-transparent border-r-[5px] border-r-white dark:border-r-gray-800" style={{ marginLeft: '1px' }} />
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">대시보드</div>
                </div>
              </div>
            )}
          </div>

          {/* 구분선 */}
          <div className={`border-t border-gray-100 dark:border-gray-800 ${showCollapsed ? 'mx-2 my-1' : 'mx-4 my-1.5'}`} />

          {/* 관리 메뉴 목록 */}
          {menus.map(menu => {
            const isActive = menuId === menu.id
            return (
              <div
                key={menu.id}
                className="relative"
                onMouseEnter={() => showCollapsed && setHoveredId(menu.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="mx-2 mb-0.5">
                  <button
                    onClick={() => navigate(`/admin/system/${systemId}/${menu.id}`)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left cursor-pointer transition-colors ${
                      showCollapsed ? 'justify-center' : ''
                    } ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                    }`}
                  >
                    {showCollapsed ? (
                      <span className="text-xs font-medium">{menu.name.charAt(0)}</span>
                    ) : (
                      <>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                        <span className="text-sm whitespace-nowrap">{menu.name}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 접힘 호버 팝업 */}
                {showCollapsed && hoveredId === menu.id && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 pointer-events-none">
                    <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg shadow-gray-200/50 dark:shadow-black/30 px-3 py-2 w-48">
                      <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-gray-200 dark:border-r-gray-700" />
                      <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-[5px] border-y-transparent border-r-[5px] border-r-white dark:border-r-gray-800" style={{ marginLeft: '1px' }} />
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{menu.name}</div>
                      {menu.description && (
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-snug">{menu.description}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </aside>

      {/* 모바일: 하단 고정 바 */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-3 py-2 flex gap-1.5 overflow-x-auto">
        {/* 허브로 돌아가기 */}
        <button
          onClick={() => navigate('/admin')}
          className="flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span className="text-xs font-medium whitespace-nowrap">허브</span>
        </button>

        {/* 대시보드 */}
        <button
          onClick={() => navigate(`/admin/system/${systemId}`)}
          className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors cursor-pointer ${
            isDashboard
              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
              : 'text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
          <span className="text-xs font-medium whitespace-nowrap">대시보드</span>
        </button>

        {/* 메뉴 항목들 */}
        {menus.map(menu => (
          <button
            key={menu.id}
            onClick={() => navigate(`/admin/system/${systemId}/${menu.id}`)}
            className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              menuId === menu.id
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
                : 'text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
            }`}
          >
            <span className={`w-4 h-4 rounded-full border-2 ${
              menuId === menu.id ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300 dark:border-gray-600'
            }`} />
            <span className="text-xs font-medium whitespace-nowrap">{menu.name}</span>
          </button>
        ))}
      </div>
    </>
  )
}
