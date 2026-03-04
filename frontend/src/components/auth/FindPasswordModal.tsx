import { useState } from 'react'
import Modal from '../common/Modal'
import { Input, Button, Alert, IconBadge, Icons } from '../ui-kit'

interface FindPasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FindPasswordModal({ isOpen, onClose }: FindPasswordModalProps) {
  const [id, setId] = useState('')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id.trim() || !email.trim()) {
      setError('모든 항목을 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError('')

    // Mock API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000))

    if ((id === 'admin' && email === 'admin@test.com') || (id === 'user' && email === 'user@test.com')) {
      setSent(true)
    } else {
      setError('일치하는 정보를 찾을 수 없습니다.')
    }
    setIsLoading(false)
  }

  const handleClose = () => {
    setId('')
    setEmail('')
    setSent(false)
    setError('')
    setIsLoading(false)
    onClose()
  }

  // 이메일 발송 완료 화면
  if (sent) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="이메일이 발송되었습니다"
        icon={
          <IconBadge
            icon={Icons.email}
            color="blue"
            badge={Icons.check}
            badgeColor="emerald"
            animate
          />
        }
      >
        <div className="text-center">
          {/* 이메일 주소 표시 */}
          <div className="relative mb-6">
            <div className="py-4 px-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">발송된 주소</p>
              <span className="text-lg font-semibold text-slate-800 dark:text-white">
                {email}
              </span>
            </div>
          </div>

          {/* 안내 메시지 */}
          <Alert type="info" title="이메일을 확인해주세요" className="mb-6 text-left">
            <p className="text-xs">
              비밀번호 재설정 링크가 포함된 이메일을 발송했습니다.
              링크는 24시간 동안 유효합니다.
            </p>
          </Alert>

          <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
            이메일이 도착하지 않으면 스팸 폴더를 확인해주세요.
          </p>

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
      subtitle="비밀번호 재설정 링크를 이메일로 보내드립니다"
      icon={
        <IconBadge
          icon={Icons.lock}
          color="amber"
          badge={Icons.key}
          badgeColor="white"
        />
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
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
            loadingText="발송 중..."
            className="flex-1"
          >
            이메일 발송
          </Button>
        </div>

        <p className="text-xs text-center text-slate-400 dark:text-slate-500 pt-2">
          테스트: 아이디 "admin" / 이메일 "admin@test.com"
        </p>
      </form>
    </Modal>
  )
}
