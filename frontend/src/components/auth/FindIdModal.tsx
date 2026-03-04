import { useState } from 'react'
import Modal from '../common/Modal'
import { Input, Button, Alert, IconBadge, Icons } from '../ui-kit'

interface FindIdModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FindIdModal({ isOpen, onClose }: FindIdModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      setError('모든 항목을 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError('')

    // Mock API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 800))

    if (email === 'admin@test.com' && name === '관리자') {
      setResult('admin')
    } else if (email === 'user@test.com' && name === '홍길동') {
      setResult('user')
    } else {
      setError('일치하는 정보를 찾을 수 없습니다.')
    }
    setIsLoading(false)
  }

  const handleClose = () => {
    setName('')
    setEmail('')
    setResult(null)
    setError('')
    setIsLoading(false)
    onClose()
  }

  // 결과 화면
  if (result) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="아이디를 찾았습니다"
        icon={
          <IconBadge
            icon={Icons.check}
            color="emerald"
            animate
          />
        }
      >
        <div className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
            회원님의 아이디는
          </p>

          {/* 아이디 표시 박스 */}
          <div className="relative mb-6">
            <div className="py-4 px-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-2xl font-bold text-[var(--color-primary)] dark:text-sky-400 tracking-wide">
                {result}
              </span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-primary)] rounded-full opacity-60" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full opacity-40" />
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
            보안을 위해 비밀번호는 직접 재설정해주세요.
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
      title="아이디 찾기"
      subtitle="가입 시 등록한 정보를 입력해주세요"
      icon={
        <IconBadge
          icon={Icons.user}
          color="blue"
          badge={Icons.search}
          badgeColor="white"
        />
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="이름"
          type="text"
          value={name}
          onChange={e => { setName(e.target.value); setError('') }}
          placeholder="실명을 입력하세요"
          icon={Icons.user}
          size="lg"
        />

        <Input
          label="이메일"
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setError('') }}
          placeholder="example@email.com"
          icon={Icons.email}
          size="lg"
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
            loading={isLoading}
            loadingText="조회 중..."
            className="flex-1"
          >
            아이디 찾기
          </Button>
        </div>

        <p className="text-xs text-center text-slate-400 dark:text-slate-500 pt-2">
          테스트: 이름 "관리자" / 이메일 "admin@test.com"
        </p>
      </form>
    </Modal>
  )
}
