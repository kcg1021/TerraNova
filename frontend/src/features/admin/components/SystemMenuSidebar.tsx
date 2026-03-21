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
        className={`hidden md:flex flex-col flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-[width] duration-300 ease-in-out ${
          collapsed ? 'w-14' : 'w-56'
        } overflow-hidden`}
      >
        {/* 헤더: 시스템명 + 접기/펼치기 */}
        <div className={`flex items-center h-12 border-b border-slate-100 dark:border-slate-800 ${showCollapsed ? 'justify-center' : 'justify-between pl-4 pr-2'}`}>
          {!showCollapsed && system && (
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: system.color }} />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{system.name}</span>
            </div>
          )}
          <button
            onClick={toggle}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0"
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
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon name="dashboard" className="w-4 h-4 flex-shrink-0" />
              {!showCollapsed && <span className="text-sm whitespace-nowrap">대시보드</span>}
            </button>
          </div>

          {/* 구분선 */}
          <div className="border-t border-slate-100 dark:border-slate-800 mx-2 my-1" />

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
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {showCollapsed ? (
                    <span className="text-sm font-medium">{menu.name.charAt(0)}</span>
                  ) : (
                    <>
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                      <span className="text-sm whitespace-nowrap">{menu.name}</span>
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </nav>

      </aside>

      {/* 모바일: 하단 탭 바 */}
      <div className="order-last shrink-0 md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-1 flex overflow-x-auto scrollbar-thin">
        <button
          onClick={() => navigate(`/admin/system/${systemId}`)}
          className={`flex-shrink-0 px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer border-b-2 ${
            isDashboard
              ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500'
              : 'text-slate-400 dark:text-slate-500 border-transparent'
          }`}
        >
          대시보드
        </button>
        {menus.map(menu => (
          <button
            key={menu.id}
            onClick={() => navigate(`/admin/system/${systemId}/${menu.id}`)}
            className={`flex-shrink-0 px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer border-b-2 ${
              menuId === menu.id
                ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500'
                : 'text-slate-400 dark:text-slate-500 border-transparent'
            }`}
          >
            {menu.name}
          </button>
        ))}
      </div>
    </>
  )
}
