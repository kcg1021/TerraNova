import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/shared/components/ui-kit'
import { useAuth } from '@/shared/contexts/AuthContext'
import { useClickOutside } from '@/shared/hooks/useClickOutside'
import { isAdminRole, isSuperAdminRole } from '@/shared/utils/auth'
import { useAdminNotifications, useAdminPermissions } from '../api/queries'

export default function NotificationBell() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const isAdmin = isAdminRole(user?.role)
  const isSuperAdmin = isSuperAdminRole(user?.role)

  const { data: allNotifications = [] } = useAdminNotifications({ enabled: isAdmin })
  const { data: permissions = [] } = useAdminPermissions({ enabled: isAdmin })

  useClickOutside(ref, () => setOpen(false))

  if (!isAdmin || !user) return null

  // SYSTEM_ADMIN은 할당된 시스템의 알림만
  const notifications = isSuperAdmin
    ? allNotifications
    : (() => {
        const perm = permissions.find(p => p.userId === user.id)
        if (!perm) return []
        return allNotifications.filter(n => perm.systemIds.includes(n.systemId))
      })()

  const totalCount = notifications.reduce((sum, n) => sum + n.count, 0)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150 cursor-pointer"
        title="알림"
      >
        <Icon name="bell" className="w-4 h-4 md:w-5 md:h-5" />
        {totalCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-red-500 rounded-full leading-none">
            {totalCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed top-14 right-2 left-2 sm:absolute sm:top-full sm:mt-2 sm:left-auto sm:right-0 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-black/30 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">알림</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              처리 대기 {totalCount}건
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                새로운 알림이 없습니다
              </div>
            ) : (
              notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => {
                    navigate(`/admin/system/${n.systemId}/${n.systemId}-user-mgmt`)
                    setOpen(false)
                  }}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150 cursor-pointer border-b border-slate-50 dark:border-slate-700/50 last:border-b-0"
                >
                  <span className="flex-shrink-0 mt-0.5 w-2 h-2 rounded-full bg-red-500" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-slate-700 dark:text-slate-200">{n.message}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">역할 관리 →</div>
                  </div>
                  <span className="flex-shrink-0 text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-950/50 px-1.5 py-0.5 rounded-md">
                    {n.count}건
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
