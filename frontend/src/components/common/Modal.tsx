import { useEffect, useRef, type ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  icon?: ReactNode
  children: ReactNode
}

export default function Modal({ isOpen, onClose, title, subtitle, icon, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
    >
      {/* 배경 블러 오버레이 */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />

      {/* 모달 컨테이너 */}
      <div
        ref={contentRef}
        className="relative w-full max-w-md overflow-hidden modal-content"
      >
        {/* 글래스모피즘 효과의 모달 본체 */}
        <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-slate-900/20 dark:shadow-black/40 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer group"
            aria-label="닫기"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* 헤더 영역 */}
          <div className="px-8 pt-8 pb-2">
            {/* 아이콘 (있는 경우) */}
            {icon && (
              <div className="flex justify-center mb-5">
                {icon}
              </div>
            )}

            {/* 타이틀 */}
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white tracking-tight text-center">
              {title}
            </h2>

            {/* 서브타이틀 */}
            {subtitle && (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 text-center leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* 콘텐츠 영역 */}
          <div className="px-8 pt-4 pb-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
