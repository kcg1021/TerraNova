import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { mockAdminSystems, mockSystemAdminPermissions } from '../mocks/adminData'
import SystemMenuSidebar from '../components/admin/SystemMenuSidebar'
import SystemAccessChart from '../components/admin/SystemAccessChart'
import MenuUsageChart from '../components/admin/MenuUsageChart'
import MenuManagementPlaceholder from '../components/admin/MenuManagementPlaceholder'

export default function SystemDetailPage() {
  const { user } = useAuth()
  const { systemId, menuId } = useParams<{ systemId: string; menuId?: string }>()
  const [selectedFilter, setSelectedFilter] = useState('integrated')

  if (!user || user.role === 'USER') {
    return <Navigate to="/" replace />
  }

  if (!systemId) {
    return <Navigate to="/admin" replace />
  }

  // systemId 유효성 검증
  const isIntegrated = systemId === 'integrated'
  const system = isIntegrated
    ? { id: 'integrated', name: '통합관리', description: '전체 시스템 통합 관리', color: '#10b981' }
    : mockAdminSystems.find(s => s.id === systemId)

  if (!system) {
    return <Navigate to="/admin" replace />
  }

  // 통합관리는 SUPER_ADMIN만 접근 가능
  if (isIntegrated && user.role !== 'SUPER_ADMIN') {
    return <Navigate to="/admin" replace />
  }

  // SYSTEM_ADMIN 권한 검증
  if (user.role === 'SYSTEM_ADMIN' && !isIntegrated) {
    const perm = mockSystemAdminPermissions.find(p => p.userId === user.id)
    const allowedIds = perm?.systemIds ?? []
    if (!allowedIds.includes(systemId)) {
      return <Navigate to="/admin" replace />
    }
  }

  const isDashboard = !menuId
  const chartSystemId = isIntegrated ? selectedFilter : systemId

  return (
    <div className="flex flex-1 min-h-0">
      <SystemMenuSidebar systemId={systemId} />

      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
        <div className="space-y-4 md:space-y-5">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: system.color }} />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isDashboard ? system.name : ''}
              </h2>
            </div>
            {isIntegrated && isDashboard && (
              <select
                value={selectedFilter}
                onChange={e => setSelectedFilter(e.target.value)}
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              >
                <option value="integrated">전체</option>
                {mockAdminSystems.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            )}
          </div>

          {isDashboard ? (
            <>
              <SystemAccessChart systemId={chartSystemId} />
              <MenuUsageChart systemId={chartSystemId} />
            </>
          ) : (
            <MenuManagementPlaceholder systemId={systemId} menuId={menuId!} />
          )}
        </div>
      </main>
    </div>
  )
}
