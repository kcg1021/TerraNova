import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import MainPage from './pages/MainPage'
import PostDetailPage from './pages/PostDetailPage'
import AdminHubPage from './pages/AdminHubPage'
import SystemDetailPage from './pages/SystemDetailPage'
import SignupPage from './pages/SignupPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/board/:boardId/:postId" element={<PostDetailPage />} />
          <Route path="/admin" element={<AdminHubPage />} />
          <Route path="/admin/system/:systemId" element={<SystemDetailPage />} />
          <Route path="/admin/system/:systemId/:menuId" element={<SystemDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
