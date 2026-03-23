export type UserRole = 'SUPER_ADMIN' | 'SYSTEM_ADMIN' | 'USER'
export type UserStatus = 'pending' | 'active' | 'rejected' | 'deleted'

export interface User {
  id: string
  name: string
  role: UserRole
  email?: string
  status: UserStatus
  requirePasswordChange?: boolean
}

export interface LoginResult {
  success: boolean
  error?: string
  blockedReason?: 'pending' | 'rejected' | 'deleted'
  requirePasswordChange?: boolean
}

export interface AuthState {
  user: User | null
  sessionExpiry: Date | null
}

export interface SiteConfig {
  logoUrl: string
  slogan: string
  title: string
  theme: 'light' | 'dark' | 'system'
  displayBoards: string[]
}
