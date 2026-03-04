import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import FindIdModal from './FindIdModal'
import FindPasswordModal from './FindPasswordModal'

interface LoginFormProps {
  onSuccess?: () => void
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth()
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showFindIdModal, setShowFindIdModal] = useState(false)
  const [showFindPasswordModal, setShowFindPasswordModal] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!id.trim() || !password) return

    const result = login(id.trim(), password)
    if (result.success) {
      setError('')
      onSuccess?.()
    } else {
      setError(result.error ?? '로그인에 실패했습니다.')
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          아이디
        </label>
        <input
          type="text"
          value={id}
          onChange={e => { setId(e.target.value); setError('') }}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-shadow"
          placeholder="아이디를 입력하세요"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          비밀번호
        </label>
        <input
          type="password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError('') }}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-shadow"
          placeholder="비밀번호를 입력하세요"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <button
        type="submit"
        className="w-full py-2.5 text-sm font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors cursor-pointer"
      >
        로그인
      </button>

      {/* 하단 링크 */}
      <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 pt-2">
        <button
          type="button"
          onClick={() => setShowFindIdModal(true)}
          className="hover:text-gray-900 dark:hover:text-white cursor-pointer"
        >
          아이디 찾기
        </button>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <button
          type="button"
          onClick={() => setShowFindPasswordModal(true)}
          className="hover:text-gray-900 dark:hover:text-white cursor-pointer"
        >
          비밀번호 찾기
        </button>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <Link to="/signup" className="hover:text-gray-900 dark:hover:text-white">
          회원가입
        </Link>
      </div>

      {/* 모달 */}
      <FindIdModal
        isOpen={showFindIdModal}
        onClose={() => setShowFindIdModal(false)}
      />
      <FindPasswordModal
        isOpen={showFindPasswordModal}
        onClose={() => setShowFindPasswordModal(false)}
      />
    </form>
  )
}
