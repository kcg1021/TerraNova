import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/shared/components/layout/Layout.tsx'
import { MainPage, PostDetailPage } from '@/features/board'
import { AdminHubPage, SystemDetailPage } from '@/features/admin'
import { SignupPage, ChangePasswordPage } from '@/features/auth'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/board/:boardId/:postId" element={<PostDetailPage />} />
          <Route path="/admin" element={<AdminHubPage />} />
          <Route path="/admin/system/:systemId" element={<SystemDetailPage />} />
          <Route path="/admin/system/:systemId/:menuId" element={<SystemDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
