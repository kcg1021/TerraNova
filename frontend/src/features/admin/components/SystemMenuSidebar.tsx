import { useNavigate, useParams } from 'react-router-dom'
import { Icon } from '@/shared/components/ui-kit'
import { useCollapsible } from '@/shared/hooks/useCollapsible'
import { useSystemMenus, useAdminSystems } from '../api/queries'

interface Props {
  systemId: string
}

export default function SystemMenuSidebar({ systemId }: Props) {
  const navigate = useNavigate()
  const { menuId } = useParams<{ menuId?: string }>()
  const { collapsed, showCollapsed, toggle, handleTransitionEnd } = useCollapsible()
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
          collapsed ? 'w-14' : 'w-56'
        } overflow-hidden`}
      >
        {/* 헤더: 시스템명 + 접기/펼치기 */}
        <div className={`flex items-center h-12 border-b border-gray-100 dark:border-gray-800 ${showCollapsed ? 'justify-center' : 'justify-between pl-4 pr-2'}`}>
          {!showCollapsed && system && (
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: system.color }} />
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{system.name}</span>
            </div>
          )}
          <button
            onClick={toggle}
            className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer flex-shrink-0"
            title={collapsed ? '메뉴 펼치기' : '메뉴 접기'}
          >
            <Icon name="chevronLeft" className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* 메뉴 목록 */}
        <nav className="flex-1 py-2 overflow-x-hidden overflow-y-auto scrollbar-thin">
          {/* 대시보드 항목 */}
          <div className="mx-2 mb-0.5">
            <button
              onClick={() => navigate(`/admin/system/${systemId}`)}
              title={showCollapsed ? '대시보드' : undefined}
              className={`w-full flex items-center gap-2.5 px-3 h-9 rounded-lg text-left cursor-pointer transition-colors ${
                showCollapsed ? 'justify-center' : ''
              } ${
                isDashboard
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60'
              }`}
            >
              <Icon name="dashboard" className="w-4 h-4 flex-shrink-0" />
              {!showCollapsed && <span className="text-sm whitespace-nowrap">대시보드</span>}
            </button>
          </div>

          {/* 구분선 */}
          <div className="border-t border-gray-100 dark:border-gray-800 mx-2 my-1" />

          {/* 관리 메뉴 목록 */}
          {menus.map(menu => {
            const isActive = menuId === menu.id
            return (
              <div key={menu.id} className="mx-2 mb-0.5">
                <button
                  onClick={() => navigate(`/admin/system/${systemId}/${menu.id}`)}
                  title={showCollapsed ? menu.name : undefined}
                  className={`w-full flex items-center gap-2.5 px-3 h-9 rounded-lg text-left cursor-pointer transition-colors ${
                    showCollapsed ? 'justify-center' : ''
                  } ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                  }`}
                >
                  {showCollapsed ? (
                    <span className="text-sm font-medium">{menu.name.charAt(0)}</span>
                  ) : (
                    <>
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                      <span className="text-sm whitespace-nowrap">{menu.name}</span>
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </nav>

      </aside>

      {/* 모바일: 하단 고정 바 */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-3 py-2 flex gap-1.5 overflow-x-auto">
        {/* 대시보드 */}
        <button
          onClick={() => navigate(`/admin/system/${systemId}`)}
          className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors cursor-pointer ${
            isDashboard
              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
              : 'text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
          }`}
        >
          <Icon name="dashboard" className="w-4 h-4" />
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
