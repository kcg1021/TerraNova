import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/contexts/AuthContext'
import { Input, Button, Alert, IconBadge, Icons } from '@/shared/components/ui-kit'
import { mockAccounts } from '@/shared/mocks/accounts'

export default function ChangePasswordPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const account = mockAccounts.find(a => a.id === user?.id)

  const validate = (): string | null => {
    if (!newPassword) return '새 비밀번호를 입력해주세요.'
    if (newPassword.length < 8) return '비밀번호는 8자 이상이어야 합니다.'
    if (newPassword !== confirmPassword) return '비밀번호가 일치하지 않습니다.'
    if (account && newPassword === account.password) return '현재 비밀번호와 다른 비밀번호를 입력해주세요.'
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    // Mock: 비밀번호 업데이트
    if (account) {
      account.password = newPassword
      account.requirePasswordChange = false
    }

    setSuccess(true)
  }

  const handleGoToLogin = () => {
    logout()
    navigate('/')
  }

  // 비밀번호 변경이 필요 없는 사용자가 접근한 경우
  if (user && !user.requirePasswordChange) {
    navigate('/')
    return null
  }

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="w-full max-w-lg">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-12 text-center">
              <div className="flex justify-center mb-6">
                <IconBadge icon={Icons.check} color="emerald" animate />
              </div>

              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
                비밀번호가 변경되었습니다
              </h1>
              <p className="mt-3 text-slate-500 dark:text-slate-400 leading-relaxed">
                새 비밀번호로 다시 로그인해주세요.
              </p>

              <div className="mt-8">
                <Button onClick={handleGoToLogin} fullWidth>
                  로그인하러 가기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-8">
            {/* 헤더 */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-5">
                <IconBadge icon={Icons.lock} color="amber" />
              </div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
                비밀번호 변경
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                보안을 위해 새 비밀번호를 설정해주세요
              </p>
            </div>

            {/* 폼 */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="새 비밀번호"
                type="password"
                value={newPassword}
                onChange={e => { setNewPassword(e.target.value); setError('') }}
                placeholder="8자 이상 입력하세요"
                icon={Icons.lock}
                variant="default"
              />

              <Input
                label="비밀번호 확인"
                type="password"
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); setError('') }}
                placeholder="비밀번호를 다시 입력하세요"
                icon={Icons.lock}
                variant="default"
              />

              {error && <Alert type="error">{error}</Alert>}

              <Button type="submit" color="gray" fullWidth>
                비밀번호 변경
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
