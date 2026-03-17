import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useAuth } from '@/shared/contexts/AuthContext'
import { isAdminRole, isSuperAdminRole } from '@/shared/utils/auth'
import { useAdminSystems, useAdminPermissions } from '../api/queries'
import SystemMenuSidebar from '../components/SystemMenuSidebar'
import SystemAccessChart from '../components/SystemAccessChart'
import MenuUsageChart from '../components/MenuUsageChart'
import MenuManagementPlaceholder from '../components/MenuManagementPlaceholder'
import SystemFilterDropdown from '../components/SystemFilterDropdown'

const ALL_SYSTEM_IDS = ['integrated', 'hr', 'budget', 'civil', 'approval', 'asset', 'monitor']

export default function SystemDetailPage() {
  const { user } = useAuth()
  const { systemId, menuId } = useParams<{ systemId: string; menuId?: string }>()
  const [selectedSystems, setSelectedSystems] = useState<string[]>(ALL_SYSTEM_IDS)
  const isAdmin = user ? isAdminRole(user.role) : false
  const { data: adminSystems, isPending: systemsLoading } = useAdminSystems()
  const { data: permissions, isPending: permsLoading } = useAdminPermissions()

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />
  }

  if (!systemId) {
    return <Navigate to="/admin" replace />
  }

  // 데이터 로딩 중이면 대기
  if (systemsLoading || permsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-sm text-gray-400 dark:text-gray-500">불러오는 중...</div>
      </div>
    )
  }

  // systemId 유효성 검증
  const isIntegrated = systemId === 'integrated'
  const system = isIntegrated
    ? { id: 'integrated', name: '통합관리', description: '전체 시스템 통합 관리', color: '#10b981' }
    : adminSystems?.find(s => s.id === systemId)

  if (!system) {
    return <Navigate to="/admin" replace />
  }

  // 통합관리는 SUPER_ADMIN만 접근 가능
  if (isIntegrated && !isSuperAdminRole(user.role)) {
    return <Navigate to="/admin" replace />
  }

  // SYSTEM_ADMIN 권한 검증
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

      <main className="flex-1 flex flex-col overflow-hidden p-4 md:p-6 pb-20 md:pb-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between shrink-0 mb-3 md:mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: system.color }} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isDashboard ? system.name : ''}
            </h2>
          </div>
          {isIntegrated && isDashboard && (
            <SystemFilterDropdown
              selectedSystems={selectedSystems}
              onChange={setSelectedSystems}
            />
          )}
        </div>

        {isDashboard ? (
          <div className="flex-1 flex flex-col gap-3 md:gap-4 min-h-0">
            <SystemAccessChart systemIds={chartSystemIds} />
            <MenuUsageChart systemIds={chartSystemIds} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <MenuManagementPlaceholder systemId={systemId} menuId={menuId!} />
          </div>
        )}
      </main>
    </div>
  )
}
