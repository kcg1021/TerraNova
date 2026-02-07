import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import MainPage from './pages/MainPage'
import PostDetailPage from './pages/PostDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/board/:boardId/:postId" element={<PostDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
