import type { UserRole } from './auth'
import type { Attachment } from './attachment'

export interface Board {
  id: string
  name: string
  type: 'notice' | 'board'
  description?: string
}

export interface BoardPost {
  id: number
  boardId: string
  title: string
  author: string
  createdAt: string
  views: number
  isNew?: boolean
  attachments?: Attachment[]
  isPublic?: boolean
  content?: string
}

export interface SystemMenu {
  id: string
  name: string
  description: string
  url: string
  requiredRoles: UserRole[]
}
