import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/shared/contexts/AuthContext.tsx'
import { useSiteConfig } from '@/shared/contexts/SiteConfigContext.tsx'
import { useTheme } from '@/shared/contexts/ThemeContext.tsx'
import { isAdminRole, isSuperAdminRole, getRoleLabel } from '@/shared/utils/auth.ts'
import { Icon } from '@/shared/components/ui-kit'
import Logo from './Logo.tsx'
import NotificationBell from '@/features/admin/components/NotificationBell.tsx'
import { useAdminSystems } from '@/features/admin/api/queries.ts'

export default function Header() {
  const { user, sessionExpiry, logout, extendSession } = useAuth()
  const { config } = useSiteConfig()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const [remainingTime, setRemainingTime] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)
  const themeMenuRef = useRef<HTMLDivElement>(null)

  const isAdmin = isAdminRole(user?.role)
  const isSuperAdmin = isSuperAdminRole(user?.role)
  const isAdminRoute = location.pathname.startsWith('/admin')

  // 세션 남은 시간 계산
  useEffect(() => {
    if (!sessionExpiry) return

    const timer = setInterval(() => {
      const diff = sessionExpiry.getTime() - Date.now()
      if (diff <= 0) {
        setRemainingTime('만료됨')
        logout()
        return
      }
      const min = Math.floor(diff / 60000)
      const sec = Math.floor((diff % 60000) / 1000)
      setRemainingTime(`${min}분 ${sec.toString().padStart(2, '0')}초`)
    }, 1000)

    return () => clearInterval(timer)
  }, [sessionExpiry, logout])

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setThemeMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const themeOptions = [
    {
      value: 'light' as const,
      label: '라이트',
      icon: <Icon name="sun" className="w-4 h-4" />,
    },
    {
      value: 'dark' as const,
      label: '다크',
      icon: <Icon name="moon" className="w-4 h-4" />,
    },
    {
      value: 'system' as const,
      label: '시스템 설정',
      icon: <Icon name="monitor" className="w-4 h-4" />,
    },
  ]

  const currentThemeIcon = themeOptions.find(o => o.value === theme)?.icon ?? themeOptions[2].icon

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-700/60 px-3 md:px-6 h-12 md:h-14 flex items-center justify-between shadow-sm">
      {/* 좌측: 로고 + 브레드크럼 */}
      {isAdminRoute ? (
        <AdminBreadcrumb />
      ) : (
        <Link to="/" className="flex items-center gap-2 md:gap-3 no-underline group min-w-0">
          <div className="transition-transform duration-200 group-hover:scale-105 flex-shrink-0">
            <Logo className="h-6 w-6 md:h-8 md:w-8" />
          </div>
          {config.title ? (
            <span className="text-sm md:text-lg font-bold text-gray-900 dark:text-white tracking-tight truncate">
              {config.title}
            </span>
          ) : config.slogan ? (
            <span className="text-xs md:text-sm font-medium text-[var(--color-primary)] dark:text-sky-400 truncate">
              {config.slogan}
            </span>
          ) : null}
        </Link>
      )}

      {/* 우측 */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* 알림 벨 (관리자 허브에서만) */}
        {isAdminRoute && <NotificationBell />}

        {/* 테마 선택 */}
        <div className="relative" ref={themeMenuRef}>
          <button
            onClick={() => setThemeMenuOpen(prev => !prev)}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150 cursor-pointer"
            title={theme === 'light' ? '라이트 모드' : theme === 'dark' ? '다크 모드' : '시스템 설정'}
          >
            {currentThemeIcon}
          </button>

          {themeMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg shadow-black/5 dark:shadow-black/30 z-50 py-1 overflow-hidden">
              {themeOptions.map(option => {
                const isActive = theme === option.value
                return (
                  <button
                    key={option.value}
                    disabled={isActive}
                    onClick={() => {
                      setTheme(option.value)
                      setThemeMenuOpen(false)
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors duration-150 cursor-pointer ${
                      isActive
                        ? 'text-[var(--color-primary)] dark:text-sky-400 bg-[var(--color-primary)]/5 dark:bg-sky-400/5 font-medium cursor-default'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {option.icon}
                    <span>{option.label}</span>
                    {isActive && (
                      <svg className="w-3.5 h-3.5 ml-auto text-[var(--color-primary)] dark:text-sky-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* 로그인: 사용자 메뉴 */}
        {user && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(prev => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border whitespace-nowrap transition-all duration-150 cursor-pointer ${
                userMenuOpen
                  ? 'text-[var(--color-primary)] dark:text-white bg-[var(--color-primary)]/5 dark:bg-white/10 border-[var(--color-primary)]/30 dark:border-white/30'
                  : 'text-gray-700 dark:text-gray-200 bg-transparent border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon name="user" className="w-4 h-4 opacity-60" />
              {user.name}님
              <Icon name="chevronDown" className={`w-3.5 h-3.5 opacity-50 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg shadow-black/5 dark:shadow-black/40 z-50 overflow-hidden">
                {/* 사용자 정보 헤더 */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">
                    {getRoleLabel(user.role)}
                  </div>
                </div>

                {/* 세션 시간 */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-400 dark:text-gray-400 uppercase tracking-wide">세션 남은 시간</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5 tabular-nums">{remainingTime}</div>
                    </div>
                    <button
                      onClick={extendSession}
                      className="text-xs px-2.5 py-1.5 font-medium text-[var(--color-primary)] dark:text-white bg-[var(--color-primary)]/10 dark:bg-white/10 rounded-md hover:bg-[var(--color-primary)]/20 dark:hover:bg-white/20 transition-colors duration-150 cursor-pointer"
                    >
                      연장
                    </button>
                  </div>
                </div>

                {/* 메뉴 항목들 */}
                <div className="py-1">
                  {isAdmin && !isAdminRoute && (
                    <>
                      <button
                        onClick={() => {
                          navigate('/admin')
                          setUserMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-sm text-[var(--color-primary)] dark:text-sky-400 hover:bg-[var(--color-primary)]/5 dark:hover:bg-sky-400/10 transition-colors duration-150 cursor-pointer"
                      >
                        <Icon name="settings" className="w-4 h-4" />
                        관리자 페이지
                      </button>
                      <div className="mx-3 border-t border-gray-100 dark:border-gray-700" />
                    </>
                  )}
                  {!isSuperAdmin && (
                    <button className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer">
                      <Icon name="shield" className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                      권한 신청
                    </button>
                  )}
                  <button className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer">
                    <Icon name="userSimple" className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                    회원정보 수정
                  </button>
                  <div className="mx-3 border-t border-gray-100 dark:border-gray-700" />
                  <button
                    onClick={() => {
                      logout()
                      setUserMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-150 cursor-pointer"
                  >
                    <Icon name="logout" className="w-4 h-4" />
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

/** 관리자 영역 브레드크럼 */
function AdminBreadcrumb() {
  const location = useLocation()
  const { data: adminSystems = [] } = useAdminSystems()

  // /admin/system/:systemId 에서 systemId 추출
  const match = location.pathname.match(/^\/admin\/system\/([^/]+)/)
  const systemId = match?.[1]

  const systemName = systemId
    ? systemId === 'integrated'
      ? '통합관리'
      : adminSystems.find(s => s.id === systemId)?.name ?? systemId
    : null

  const Separator = () => (
    <Icon name="chevronRight" className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
  )

  return (
    <nav className="flex items-center gap-1.5 min-w-0 text-sm">
      <Link
        to="/"
        className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex-shrink-0"
      >
        <Icon name="home" className="w-4 h-4" />
      </Link>
      <Separator />
      <Link
        to="/admin"
        className={`truncate transition-colors flex-shrink-0 ${
          systemName
            ? 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            : 'text-gray-900 dark:text-white font-semibold'
        }`}
      >
        관리자 허브
      </Link>
      {systemName && (
        <>
          <Separator />
          <span className="text-gray-900 dark:text-white font-semibold truncate">
            {systemName}
          </span>
        </>
      )}
    </nav>
  )
}
