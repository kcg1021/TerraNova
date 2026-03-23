import { useState } from 'react'
import Modal from '@/shared/components/Modal.tsx'
import { Input, Button, Alert, IconBadge, Icons } from '@/shared/components/ui-kit'
import { useFormModal } from '../hooks/useFormModal.ts'
import { generateTempPassword } from '@/shared/utils/password'
import { mockAccounts } from '@/shared/mocks/accounts'

interface FindPasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FindPasswordModal({ isOpen, onClose }: FindPasswordModalProps) {
  const [id, setId] = useState('')
  const [email, setEmail] = useState('')
  const { result: tempPassword, error, isLoading, setError, handleClose, submit } = useFormModal<string>(() => {
    setId('')
    setEmail('')
    onClose()
  })

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!id.trim() || !email.trim()) {
      setError('모든 항목을 입력해주세요.')
      return
    }

    submit(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const account = mockAccounts.find(
        a => a.id === id.trim() && a.email === email.trim() && a.status === 'active'
      )
      if (!account) {
        throw new Error('해당 계정을 찾을 수 없습니다.')
      }
      const newPassword = generateTempPassword()
      account.password = newPassword
      account.requirePasswordChange = true
      return newPassword
    })
  }

  // 임시 비밀번호 발급 완료 화면
  if (tempPassword) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="임시 비밀번호가 발급되었습니다"
        icon={<IconBadge icon={Icons.lock} color="blue" animate />}
      >
        <div className="text-center">
          <div className="relative mb-6">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 font-mono text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">임시 비밀번호</p>
              <span className="text-lg font-semibold text-slate-800 dark:text-white">
                {tempPassword}
              </span>
            </div>
          </div>

          <Alert type="info" title="안내" className="mb-6 text-left">
            <p className="text-xs">
              임시 비밀번호로 로그인 후 새 비밀번호를 설정해주세요.
            </p>
          </Alert>

          <Button onClick={handleClose} fullWidth>
            확인
          </Button>
        </div>
      </Modal>
    )
  }

  // 입력 폼 화면
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="비밀번호 찾기"
      subtitle="임시 비밀번호를 발급해드립니다"
      icon={<IconBadge icon={Icons.lock} color="amber" />}
    >
      <form onSubmit={handleFormSubmit} className="space-y-5">
        <Input
          label="아이디"
          type="text"
          value={id}
          onChange={e => { setId(e.target.value); setError('') }}
          placeholder="아이디를 입력하세요"
          icon={Icons.user}
          size="lg"
          accentColor="amber"
        />

        <Input
          label="이메일"
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setError('') }}
          placeholder="example@email.com"
          icon={Icons.email}
          size="lg"
          accentColor="amber"
        />

        {error && <Alert type="error">{error}</Alert>}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            type="submit"
            color="amber"
            loading={isLoading}
            loadingText="발급 중..."
            className="flex-1"
          >
            임시 비밀번호 발급
          </Button>
        </div>
      </form>
    </Modal>
  )
}
