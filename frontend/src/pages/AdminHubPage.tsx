import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { isAdminRole, isSuperAdminRole } from '../utils/auth'
import { useAdminSystems, useAdminPermissions } from '../hooks/queries'
import type { AdminSystem } from '../types/admin'

export default function AdminHubPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: adminSystems, isPending: systemsLoading } = useAdminSystems()
  const { data: permissions, isPending: permsLoading } = useAdminPermissions()

  if (!user || !isAdminRole(user.role)) {
    return <Navigate to="/" replace />
  }

  if (systemsLoading || permsLoading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-sm text-gray-400 dark:text-gray-500">불러오는 중...</div>
      </main>
    )
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
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-5">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="메인페이지로 이동"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">관리자 허브</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* SUPER_ADMIN: 통합관리 카드 */}
          {isSuperAdmin && (
            <div
              onClick={() => navigate('/admin/system/integrated')}
              className="group relative rounded-2xl border-2 border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 p-5 cursor-pointer hover:shadow-lg hover:shadow-emerald-100 dark:hover:shadow-emerald-950/40 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-base font-semibold text-emerald-700 dark:text-emerald-300">통합관리</div>
                  <div className="text-sm text-emerald-600/70 dark:text-emerald-400/60 leading-snug mt-1">전체 시스템 통합 관리</div>
                </div>
                <svg className="w-5 h-5 text-emerald-400 dark:text-emerald-600 group-hover:translate-x-0.5 transition-transform flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          )}

          {/* 시스템 카드 목록 */}
          {systems.map(sys => (
            <div
              key={sys.id}
              onClick={() => navigate(`/admin/system/${sys.id}`)}
              className="group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 cursor-pointer hover:shadow-lg hover:shadow-gray-100 dark:hover:shadow-black/20 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <span
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: `${sys.color}18` }}
                >
                  <span className="w-5 h-5 rounded-full" style={{ backgroundColor: sys.color }} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-base font-semibold text-gray-800 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {sys.name}
                  </div>
                  <div className="text-sm text-gray-400 dark:text-gray-500 leading-snug mt-1">
                    {sys.description}
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
