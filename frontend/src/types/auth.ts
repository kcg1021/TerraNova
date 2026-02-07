export type UserRole = 'SUPER_ADMIN' | 'SYSTEM_ADMIN' | 'USER'

export interface User {
  name: string
  role: UserRole
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
