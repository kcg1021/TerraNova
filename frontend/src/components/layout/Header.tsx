import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useSiteConfig } from '../../contexts/SiteConfigContext'
import { useTheme } from '../../contexts/ThemeContext'
import Logo from './Logo'
import NotificationBell from './NotificationBell'

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

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'SYSTEM_ADMIN'
  const isSuperAdmin = user?.role === 'SUPER_ADMIN'

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
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      value: 'dark' as const,
      label: '다크',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
    },
    {
      value: 'system' as const,
      label: '시스템 설정',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ]

  const currentThemeIcon = themeOptions.find(o => o.value === theme)?.icon ?? themeOptions[2].icon

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-700/60 px-3 md:px-6 h-12 md:h-14 flex items-center justify-between shadow-sm">
      {/* 좌측: 로고 + 타이틀/슬로건 */}
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

      {/* 우측 */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* 알림 벨 (관리자 허브에서만) */}
        {location.pathname.startsWith('/admin') && <NotificationBell />}

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

        {/* 비로그인: 로그인 버튼 (메인에 로그인 폼이 있으므로 숨김) */}

        {/* 로그인: 사용자 메뉴 */}
        {user && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(prev => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition-all duration-150 cursor-pointer ${
                userMenuOpen
                  ? 'text-[var(--color-primary)] dark:text-white bg-[var(--color-primary)]/5 dark:bg-white/10 border-[var(--color-primary)]/30 dark:border-white/30'
                  : 'text-gray-700 dark:text-gray-200 bg-transparent border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              {user.name}님
              <svg className={`w-3.5 h-3.5 opacity-50 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg shadow-black/5 dark:shadow-black/40 z-50 overflow-hidden">
                {/* 사용자 정보 헤더 */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">
                    {user.role === 'SUPER_ADMIN' ? '슈퍼 관리자' : user.role === 'SYSTEM_ADMIN' ? '시스템 관리자' : '일반 사용자'}
                  </div>
                </div>

                {/* 세션 시간 */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-gray-400 dark:text-gray-400 uppercase tracking-wide">세션 남은 시간</div>
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
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => {
                          navigate('/admin')
                          setUserMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-sm text-[var(--color-primary)] dark:text-sky-400 hover:bg-[var(--color-primary)]/5 dark:hover:bg-sky-400/10 transition-colors duration-150 cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        관리자 페이지
                      </button>
                      <div className="mx-3 border-t border-gray-100 dark:border-gray-700" />
                    </>
                  )}
                  {!isSuperAdmin && (
                    <button className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer">
                      <svg className="w-4 h-4 text-gray-400 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      권한 신청
                    </button>
                  )}
                  <button className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer">
                    <svg className="w-4 h-4 text-gray-400 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
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
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
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
