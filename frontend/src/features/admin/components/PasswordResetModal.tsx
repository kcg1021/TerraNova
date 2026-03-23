import { useState } from 'react'
import Modal from '@/shared/components/Modal'
import { Button, Input, Radio, Checkbox, IconBadge, Icons } from '@/shared/components/ui-kit'
import { generateTempPassword } from '@/shared/utils/password'

interface PasswordResetModalProps {
  isOpen: boolean
  onClose: () => void
  userName: string
  userEmail?: string
  onConfirm: (password: string, sendEmail: boolean) => void
}

export default function PasswordResetModal({
  isOpen,
  onClose,
  userName,
  userEmail,
  onConfirm,
}: PasswordResetModalProps) {
  const [mode, setMode] = useState<'random' | 'manual'>('random')
  const [manualPassword, setManualPassword] = useState('')
  const [sendEmail, setSendEmail] = useState(true)
  const [resultPassword, setResultPassword] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleClose = () => {
    setMode('random')
    setManualPassword('')
    setSendEmail(true)
    setResultPassword(null)
    setError('')
    onClose()
  }

  const handleSubmit = () => {
    const password = mode === 'random' ? generateTempPassword() : manualPassword
    if (mode === 'manual' && password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }
    setResultPassword(password)
    onConfirm(password, sendEmail)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="비밀번호 초기화"
      subtitle={`${userName} 님의 비밀번호를 초기화합니다.`}
      icon={<IconBadge icon={Icons.key} color="emerald" />}
    >
      {resultPassword ? (
        <div className="space-y-5">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">새 비밀번호</p>
            <p className="text-lg font-mono font-bold text-slate-900 dark:text-white tracking-wider">
              {resultPassword}
            </p>
          </div>
          <Button color="emerald" onClick={handleClose} className="w-full">
            확인
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* 모드 선택 */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">생성 방식</p>
            <div className="flex items-center gap-5">
              <Radio
                label="랜덤 생성"
                name="passwordMode"
                value="random"
                checked={mode === 'random'}
                onChange={() => { setMode('random'); setError('') }}
                accentColor="emerald"
              />
              <Radio
                label="직접 입력"
                name="passwordMode"
                value="manual"
                checked={mode === 'manual'}
                onChange={() => setMode('manual')}
                accentColor="emerald"
              />
            </div>
          </div>

          {/* 직접 입력 필드 */}
          {mode === 'manual' && (
            <Input
              label="새 비밀번호"
              type="password"
              placeholder="8자 이상 입력"
              value={manualPassword}
              onChange={e => {
                setManualPassword(e.target.value)
                if (error) setError('')
              }}
              error={error}
              variant="default"
              accentColor="emerald"
            />
          )}

          {/* 이메일 발송 체크박스 */}
          <div className="flex items-center gap-2">
            <Checkbox
              label="이메일로 발송"
              checked={sendEmail}
              onChange={e => setSendEmail(e.target.checked)}
              accentColor="emerald"
            />
            {userEmail && (
              <span className="text-xs text-slate-400 dark:text-slate-500">{userEmail}</span>
            )}
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleClose} className="flex-1">
              취소
            </Button>
            <Button color="emerald" onClick={handleSubmit} className="flex-1">
              초기화
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
