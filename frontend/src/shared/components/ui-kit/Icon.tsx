import type { FC, SVGProps } from 'react'

import ChevronDown from '@/shared/assets/icons/chevron-down.svg?react'
import ChevronUp from '@/shared/assets/icons/chevron-up.svg?react'
import ChevronLeft from '@/shared/assets/icons/chevron-left.svg?react'
import ChevronRight from '@/shared/assets/icons/chevron-right.svg?react'
import Close from '@/shared/assets/icons/close.svg?react'
import Search from '@/shared/assets/icons/search.svg?react'
import Download from '@/shared/assets/icons/download.svg?react'
import Upload from '@/shared/assets/icons/upload.svg?react'
import Logout from '@/shared/assets/icons/logout.svg?react'
import Paperclip from '@/shared/assets/icons/paperclip.svg?react'
import Document from '@/shared/assets/icons/document.svg?react'
import ImageIcon from '@/shared/assets/icons/image.svg?react'
import DocumentEmpty from '@/shared/assets/icons/document-empty.svg?react'
import User from '@/shared/assets/icons/user.svg?react'
import UserSimple from '@/shared/assets/icons/user-simple.svg?react'
import Lock from '@/shared/assets/icons/lock.svg?react'
import Shield from '@/shared/assets/icons/shield.svg?react'
import ShieldAdmin from '@/shared/assets/icons/shield-admin.svg?react'
import Eye from '@/shared/assets/icons/eye.svg?react'
import Bell from '@/shared/assets/icons/bell.svg?react'
import Dashboard from '@/shared/assets/icons/dashboard.svg?react'
import Settings from '@/shared/assets/icons/settings.svg?react'
import Calendar from '@/shared/assets/icons/calendar.svg?react'
import Clock from '@/shared/assets/icons/clock.svg?react'
import Check from '@/shared/assets/icons/check.svg?react'
import Sun from '@/shared/assets/icons/sun.svg?react'
import Moon from '@/shared/assets/icons/moon.svg?react'
import Monitor from '@/shared/assets/icons/monitor.svg?react'
import Email from '@/shared/assets/icons/email.svg?react'
import Megaphone from '@/shared/assets/icons/megaphone.svg?react'
import Key from '@/shared/assets/icons/key.svg?react'
import List from '@/shared/assets/icons/list.svg?react'
import Wrench from '@/shared/assets/icons/wrench.svg?react'
import Pencil from '@/shared/assets/icons/pencil.svg?react'
import Trash from '@/shared/assets/icons/trash.svg?react'
import Home from '@/shared/assets/icons/home.svg?react'
import Folder from '@/shared/assets/icons/folder.svg?react'
import InfoCircle from '@/shared/assets/icons/info-circle.svg?react'
import CheckCircle from '@/shared/assets/icons/check-circle.svg?react'
import WarningCircle from '@/shared/assets/icons/warning-circle.svg?react'
import WarningTriangle from '@/shared/assets/icons/warning-triangle.svg?react'

const ICONS: Record<string, FC<SVGProps<SVGSVGElement>>> = {
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  close: Close,
  search: Search,
  download: Download,
  upload: Upload,
  logout: Logout,
  paperclip: Paperclip,
  document: Document,
  image: ImageIcon,
  documentEmpty: DocumentEmpty,
  user: User,
  userSimple: UserSimple,
  lock: Lock,
  shield: Shield,
  shieldAdmin: ShieldAdmin,
  eye: Eye,
  bell: Bell,
  dashboard: Dashboard,
  settings: Settings,
  calendar: Calendar,
  clock: Clock,
  check: Check,
  sun: Sun,
  moon: Moon,
  monitor: Monitor,
  email: Email,
  megaphone: Megaphone,
  key: Key,
  list: List,
  wrench: Wrench,
  pencil: Pencil,
  trash: Trash,
  home: Home,
  folder: Folder,
  infoCircle: InfoCircle,
  checkCircle: CheckCircle,
  warningCircle: WarningCircle,
  warningTriangle: WarningTriangle,
}

export type IconName = keyof typeof ICONS

export interface IconProps {
  name: IconName
  className?: string
  strokeWidth?: number
}

export default function Icon({ name, className = 'w-5 h-5', strokeWidth }: IconProps) {
  const SvgComponent = ICONS[name]
  if (!SvgComponent) return null

  return <SvgComponent className={className} {...(strokeWidth ? { strokeWidth } : {})} />
}
