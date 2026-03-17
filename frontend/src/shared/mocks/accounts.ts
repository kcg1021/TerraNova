import type { UserRole } from '../types/auth'

export interface MockAccount {
  id: string
  password: string
  name: string
  role: UserRole
}

export const mockAccounts: MockAccount[] = [
  { id: 'user', password: 'user1234', name: '김민수', role: 'USER' },
  { id: 'admin', password: 'admin1234', name: '이관리', role: 'SYSTEM_ADMIN' },
  { id: 'super', password: 'super1234', name: '박최고', role: 'SUPER_ADMIN' },
]
