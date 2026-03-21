import { Outlet } from 'react-router-dom'
import Header from './Header.tsx'

export default function Layout() {
  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="flex-1 flex flex-col min-h-0">
        <Outlet />
      </main>
    </div>
  )
}
