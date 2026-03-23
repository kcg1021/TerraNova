import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/contexts/AuthContext.tsx'
import { Input, Button, Alert, IconBadge, Icons } from '@/shared/components/ui-kit'
import Modal from '@/shared/components/Modal.tsx'
import FindIdModal from './FindIdModal.tsx'
import FindPasswordModal from './FindPasswordModal.tsx'

interface LoginFormProps {
  onSuccess?: () => void
}

const blockedMessages: Record<'pending' | 'rejected' | 'deleted', { title: string; message: string; color: 'amber' | 'red' }> = {
  pending: { title: '가입 승인 대기 중', message: '관리자 승인 후 로그인이 가능합니다.', color: 'amber' },
  rejected: { title: '가입이 거절되었습니다', message: '관리자에게 문의해주세요.', color: 'red' },
  deleted: { title: '삭제된 계정입니다', message: '관리자에게 문의해주세요.', color: 'red' },
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [blockedReason, setBlockedReason] = useState<'pending' | 'rejected' | 'deleted' | null>(null)
  const [showFindIdModal, setShowFindIdModal] = useState(false)
  const [showFindPasswordModal, setShowFindPasswordModal] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!id.trim() || !password) return

    const result = login(id.trim(), password)
    if (result.blockedReason) {
      setBlockedReason(result.blockedReason)
    } else if (result.success) {
      setError('')
      if (result.requirePasswordChange) {
        navigate('/change-password')
      } else {
        onSuccess?.()
      }
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
        <div className="flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400 pt-2">
          <button
            type="button"
            onClick={() => setShowFindIdModal(true)}
            className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            아이디 찾기
          </button>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <button
            type="button"
            onClick={() => setShowFindPasswordModal(true)}
            className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            비밀번호 찾기
          </button>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <Link to="/signup" className="hover:text-slate-900 dark:hover:text-white">
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

      {/* 로그인 차단 모달 */}
      {blockedReason && (
        <Modal
          isOpen={!!blockedReason}
          onClose={() => setBlockedReason(null)}
          title={blockedMessages[blockedReason].title}
          icon={
            <IconBadge
              icon={Icons.lock}
              color={blockedMessages[blockedReason].color}
            />
          }
          size="sm"
        >
          <p className="text-center text-slate-500 dark:text-slate-400 mb-6">
            {blockedMessages[blockedReason].message}
          </p>
          <Button
            onClick={() => setBlockedReason(null)}
            color="gray"
            fullWidth
          >
            확인
          </Button>
        </Modal>
      )}
    </>
  )
}
