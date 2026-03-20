import { useEffect, useState } from 'react'
import { Icon } from '@/shared/components/ui-kit'
import type { IconName } from '@/shared/constants/icons.ts'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  message: string
  type?: ToastType
  onClose: () => void
  duration?: number
}

const TOAST_STYLES: Record<ToastType, { icon: IconName; iconColor: string }> = {
  success: {
    icon: 'checkCircle',
    iconColor: 'text-emerald-400',
  },
  error: {
    icon: 'warningCircle',
    iconColor: 'text-red-400',
  },
  warning: {
    icon: 'warningTriangle',
    iconColor: 'text-amber-400',
  },
  info: {
    icon: 'infoCircle',
    iconColor: 'text-blue-400',
  },
}

export default function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(false)
  const style = TOAST_STYLES[type]

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))

    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 200)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`flex items-center gap-2.5 px-4 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-xl shadow-lg transition-all duration-200 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <Icon name={style.icon} className={`w-4 h-4 flex-shrink-0 ${style.iconColor}`} />
        {message}
      </div>
    </div>
  )
}
