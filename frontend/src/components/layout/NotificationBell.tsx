import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { isAdminRole, isSuperAdminRole } from '../../utils/auth'
import { useAdminNotifications, useAdminPermissions } from '../../hooks/queries'

export default function NotificationBell() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const isAdmin = isAdminRole(user?.role)
  const isSuperAdmin = isSuperAdminRole(user?.role)

  const { data: allNotifications = [] } = useAdminNotifications({ enabled: isAdmin })
  const { data: permissions = [] } = useAdminPermissions({ enabled: isAdmin })

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
        className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150 cursor-pointer"
        title="알림"
      >
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {totalCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full leading-none">
            {totalCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg shadow-gray-200/50 dark:shadow-black/30 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">알림</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              처리 대기 {totalCount}건
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
                새로운 알림이 없습니다
              </div>
            ) : (
              notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => {
                    navigate(`/admin/permissions/${n.systemId}`)
                    setOpen(false)
                  }}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 cursor-pointer border-b border-gray-50 dark:border-gray-700/50 last:border-b-0"
                >
                  <span className="flex-shrink-0 mt-0.5 w-2 h-2 rounded-full bg-red-500" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-gray-700 dark:text-gray-200">{n.message}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">권한 관리 →</div>
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
