import { useState, useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useAuth } from '@/shared/contexts/AuthContext'
import { isAdminRole, isSuperAdminRole } from '@/shared/utils/auth'
import { useAdminSystems, useAdminPermissions, useSystemDailyAccess, useSystemMenus } from '../api/queries'
import SystemMenuSidebar from '../components/SystemMenuSidebar'
import SystemAccessChart from '../components/SystemAccessChart'
import MenuUsageChart from '../components/MenuUsageChart'
import MenuManagementPlaceholder from '../components/MenuManagementPlaceholder'
import SystemSettingsPanel from '../components/SystemSettingsPanel'
import ToolManagementPanel from '../components/ToolManagementPanel'
import UserManagementPanel from '../components/UserManagementPanel'
import SystemFilterDropdown from '../components/SystemFilterDropdown'

const ALL_SYSTEM_IDS = ['integrated', 'hr', 'budget', 'civil', 'approval', 'asset', 'monitor']

export default function SystemDetailPage() {
  const { user } = useAuth()
  const { systemId, menuId } = useParams<{ systemId: string; menuId?: string }>()
  const [selectedSystems, setSelectedSystems] = useState<string[]>(ALL_SYSTEM_IDS)
  const isAdmin = user ? isAdminRole(user.role) : false
  const { data: adminSystems, isPending: systemsLoading } = useAdminSystems()
  const { data: permissions, isPending: permsLoading } = useAdminPermissions()
  const { data: systemDailyAccess = {} } = useSystemDailyAccess()
  const { data: menus = [] } = useSystemMenus(systemId)

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />
  }

  if (!systemId) {
    return <Navigate to="/admin" replace />
  }

  if (systemsLoading || permsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-sm text-gray-400 dark:text-gray-500">불러오는 중...</div>
      </div>
    )
  }

  const isIntegrated = systemId === 'integrated'
  const system = isIntegrated
    ? { id: 'integrated', name: '통합관리', description: '전체 시스템 통합 관리', color: '#10b981' }
    : adminSystems?.find(s => s.id === systemId)

  if (!system) {
    return <Navigate to="/admin" replace />
  }

  if (isIntegrated && !isSuperAdminRole(user.role)) {
    return <Navigate to="/admin" replace />
  }

  if (!isSuperAdminRole(user.role) && !isIntegrated) {
    const perm = permissions?.find(p => p.userId === user.id)
    const allowedIds = perm?.systemIds ?? []
    if (!allowedIds.includes(systemId)) {
      return <Navigate to="/admin" replace />
    }
  }

  const isDashboard = !menuId
  const chartSystemIds = isIntegrated ? selectedSystems : [systemId]

  return (
    <div className="flex flex-1 min-h-0">
      <SystemMenuSidebar systemId={systemId} />

      <main className="flex-1 flex flex-col p-4 md:p-6 pb-16 md:pb-6 bg-gray-50 dark:bg-gray-950 min-w-0 overflow-y-auto overflow-x-hidden md:overflow-hidden">
        {/* 페이지 헤더 */}
        {isDashboard && (
          <div className="flex items-center justify-between shrink-0 mb-4 md:mb-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {system.description}
            </p>
            {isIntegrated && (
              <SystemFilterDropdown
                selectedSystems={selectedSystems}
                onChange={setSelectedSystems}
              />
            )}
          </div>
        )}

        {isDashboard ? (
          <DashboardView
            chartSystemIds={chartSystemIds}
            systemDailyAccess={systemDailyAccess}
            menuCount={menus.length}
          />
        ) : (
          <MenuContent systemId={systemId} menuId={menuId!} />
        )}
      </main>
    </div>
  )
}

function DashboardView({
  chartSystemIds,
  systemDailyAccess,
  menuCount,
}: {
  chartSystemIds: string[]
  systemDailyAccess: Record<string, { date: string; count: number }[]>
  menuCount: number
}) {
  const stats = useMemo(() => {
    let todayTotal = 0
    let weekTotal = 0

    for (const sid of chartSystemIds) {
      const data = systemDailyAccess[sid]
      if (!data || data.length === 0) continue
      todayTotal += data[data.length - 1]?.count ?? 0
      const last7 = data.slice(-7)
      weekTotal += last7.reduce((sum, d) => sum + d.count, 0)
    }

    const weekAvg = Math.round(weekTotal / 7)

    return { todayTotal, weekAvg, menuCount }
  }, [chartSystemIds, systemDailyAccess, menuCount])

  const kpis = [
    { label: '오늘 접속', value: stats.todayTotal.toLocaleString(), unit: '명', color: 'text-emerald-600 dark:text-emerald-400' },
    { label: '7일 평균', value: stats.weekAvg.toLocaleString(), unit: '명/일', color: 'text-blue-600 dark:text-blue-400' },
    { label: '관리 메뉴', value: String(stats.menuCount), unit: '개', color: 'text-amber-600 dark:text-amber-400' },
  ]

  return (
    <div className="flex-1 flex flex-col gap-3 md:gap-4 min-h-0 min-w-0">
      {/* KPI 요약 카드 */}
      <div className="grid grid-cols-3 gap-3 shrink-0">
        {kpis.map(kpi => (
          <div
            key={kpi.label}
            className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-xl p-4 md:p-5"
          >
            <div className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">{kpi.label}</div>
            <div className="flex items-baseline gap-1">
              <span className={`text-xl md:text-2xl font-bold tabular-nums ${kpi.color}`}>
                {kpi.value}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{kpi.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 차트 영역 */}
      <div className="flex-1 flex flex-col gap-3 md:gap-4 min-h-0 min-w-0">
        <SystemAccessChart systemIds={chartSystemIds} />
        <MenuUsageChart systemIds={chartSystemIds} />
      </div>
    </div>
  )
}

function MenuContent({ systemId, menuId }: { systemId: string; menuId: string }) {
  // 통합관리의 시스템 설정
  if (systemId === 'integrated' && menuId === 'system-settings') {
    return <SystemSettingsPanel />
  }

  // 통합관리의 도구 관리
  if (systemId === 'integrated' && menuId === 'tool-mgmt') {
    return <ToolManagementPanel />
  }

  // 통합관리의 사용자 관리
  if (systemId === 'integrated' && menuId === 'user-mgmt') {
    return <UserManagementPanel />
  }

  // 그 외 메뉴는 Placeholder
  return <MenuManagementPlaceholder systemId={systemId} menuId={menuId} />
}
