import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '@/shared/contexts/AuthContext'
import Header from './Header.tsx'

export default function Layout() {
  const { user } = useAuth()
  const location = useLocation()

  if (user?.requirePasswordChange && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />
  }

  return (
    <div className="h-dvh flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="flex-1 flex flex-col min-h-0">
        <Outlet />
      </main>
    </div>
  )
}
