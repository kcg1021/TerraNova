import Modal from '@/shared/components/Modal'
import { Button, IconBadge, Icons } from '@/shared/components/ui-kit'

interface UserDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  userName: string
  onConfirm: () => void
}

export default function UserDeleteModal({ isOpen, onClose, userName, onConfirm }: UserDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="사용자 삭제"
      icon={<IconBadge icon={Icons.warning} color="red" />}
    >
      <div className="text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
          <span className="font-semibold text-slate-900 dark:text-white">{userName}</span> 님을 삭제하시겠습니까?
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
          삭제된 사용자는 로그인할 수 없습니다. 이후 계정 복구가 가능합니다.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">취소</Button>
          <Button color="red" onClick={() => { onConfirm(); onClose(); }} className="flex-1">삭제</Button>
        </div>
      </div>
    </Modal>
  )
}
