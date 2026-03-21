import { Navigate, useNavigate } from 'react-router-dom'
import { Icon, EmptyState } from '@/shared/components/ui-kit'
import { useAuth } from '@/shared/contexts/AuthContext'
import { isAdminRole, isSuperAdminRole } from '@/shared/utils/auth'
import { useAdminSystems, useAdminPermissions } from '../api/queries'
import type { AdminSystem } from '../types/index'

export default function AdminHubPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: adminSystems, isPending: systemsLoading } = useAdminSystems()
  const { data: permissions, isPending: permsLoading } = useAdminPermissions()

  if (!user || !isAdminRole(user.role)) {
    return <Navigate to="/" replace />
  }

  if (systemsLoading || permsLoading) {
    return <EmptyState loading message="불러오는 중..." />
  }

  const isSuperAdmin = isSuperAdminRole(user.role)

  let systems: AdminSystem[]
  if (isSuperAdmin) {
    systems = adminSystems ?? []
  } else {
    const perm = permissions?.find(p => p.userId === user.id)
    const allowedIds = perm?.systemIds ?? []
    systems = (adminSystems ?? []).filter(s => allowedIds.includes(s.id))
  }

  return (
    <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto p-6 lg:p-12">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          {isSuperAdmin ? '전체 시스템을 관리합니다' : `${systems.length}개 시스템에 대한 관리 권한이 있습니다`}
        </p>

        {/* 시스템 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* SUPER_ADMIN: 통합관리 카드 */}
          {isSuperAdmin && (
            <div
              onClick={() => navigate('/admin/system/integrated')}
              className="group sm:col-span-2 lg:col-span-3 relative rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 cursor-pointer hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200 overflow-hidden"
            >
              {/* 배경 패턴 */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
              </div>

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Icon name="shieldAdmin" className="w-6 h-6 text-white" />
                  </span>
                  <div>
                    <div className="text-lg font-semibold text-white">통합관리</div>
                    <div className="text-sm text-white/70 mt-0.5">전체 시스템 통합 대시보드 · 사용자 관리 · 권한 설정</div>
                  </div>
                </div>
                <Icon name="chevronRight" className="w-5 h-5 text-white/60 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </div>
            </div>
          )}

          {/* 시스템 카드 목록 */}
          {systems.map(sys => (
            <div
              key={sys.id}
              onClick={() => navigate(`/admin/system/${sys.id}`)}
              className="group relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md hover:shadow-slate-200/50 dark:hover:shadow-black/20 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <span
                  className="flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${sys.color}15` }}
                >
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: sys.color }} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {sys.name}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 leading-snug mt-1">
                    {sys.description}
                  </div>
                </div>
                <Icon name="chevronRight" className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
