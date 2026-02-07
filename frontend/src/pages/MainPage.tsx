import { useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSiteConfig } from '../contexts/SiteConfigContext'
import Sidebar from '../components/main/Sidebar'
import BoardSection from '../components/main/BoardSection'
import LoginForm from '../components/auth/LoginForm'
import Logo from '../components/layout/Logo'
import { mockBoards, mockPosts, mockSystems } from '../mocks/mainPageData'

export default function MainPage() {
  const { user } = useAuth()
  const { config } = useSiteConfig()

  // 표시할 게시판: 공지사항(항상) + 로그인 시 관리자 설정 게시판
  const visibleBoards = useMemo(() => {
    const notice = mockBoards.filter(b => b.type === 'notice')
    if (!user) return notice

    const extra = mockBoards.filter(
      b => b.type === 'board' && config.displayBoards.includes(b.id)
    )
    return [...notice, ...extra]
  }, [user, config.displayBoards])

  // 비로그인: 로그인 폼 + 공지사항
  if (!user) {
    return (
      <div className="h-[calc(100vh-3rem)] md:h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-5xl">
          {/* 환영 섹션 */}
          <div className="flex flex-col items-center mb-6 md:mb-8">
            <Logo className="h-10 w-10 md:h-12 md:w-12 mb-3" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {config.title}
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:h-[380px]">
            {/* 좌측: 로그인 */}
            <div className="w-full md:w-[320px] md:flex-shrink-0">
              <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden h-full">
                <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
                <div className="p-6">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">로그인</h2>
                  <LoginForm />

                  {/* 아이디/비밀번호 찾기 + 회원가입 */}
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
                      <button className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer">
                        아이디 찾기
                      </button>
                      <span>|</span>
                      <button className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer">
                        비밀번호 찾기
                      </button>
                    </div>
                    <button className="text-emerald-600 dark:text-emerald-400 font-medium hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer">
                      회원가입
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 우측: 공지사항 */}
            <div className="w-full md:flex-1 min-h-0">
              <BoardSection boards={visibleBoards} posts={mockPosts} maxPosts={10} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 로그인: 사이드바 + 게시판 탭
  return (
    <div className="flex h-[calc(100vh-3rem)] md:h-[calc(100vh-3.5rem)]">
      <Sidebar systems={mockSystems} />

      <div className="flex-1 min-w-0 p-4 md:p-6 pb-16 md:pb-6 flex flex-col">
        {/* 인사 배너 */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            안녕하세요, {user.name}님
          </h2>
        </div>

        <div className="flex-1 min-h-0">
          <BoardSection boards={visibleBoards} posts={mockPosts} />
        </div>
      </div>
    </div>
  )
}
