import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/shared/contexts/AuthContext.tsx'
import { Input, Button, Alert, Icons } from '@/shared/components/ui-kit'
import FindIdModal from './FindIdModal.tsx'
import FindPasswordModal from './FindPasswordModal.tsx'

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
    <>
      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          label="아이디"
          type="text"
          value={id}
          onChange={e => { setId(e.target.value); setError('') }}
          placeholder="아이디를 입력하세요"
          icon={Icons.user}
          variant="default"
        />

        <Input
          label="비밀번호"
          type="password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError('') }}
          placeholder="비밀번호를 입력하세요"
          icon={Icons.lock}
          variant="default"
        />

        {error && <Alert type="error">{error}</Alert>}

        <Button type="submit" color="gray" fullWidth>
          로그인
        </Button>

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
      </form>

      {/* 모달 */}
      <FindIdModal
        isOpen={showFindIdModal}
        onClose={() => setShowFindIdModal(false)}
      />
      <FindPasswordModal
        isOpen={showFindPasswordModal}
        onClose={() => setShowFindPasswordModal(false)}
      />
    </>
  )
}
