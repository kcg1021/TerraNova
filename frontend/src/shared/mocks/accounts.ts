import type { UserRole } from '../types/auth'

export interface MockAccount {
  id: string
  password: string
  name: string
  role: UserRole
  orgId?: string
  email?: string
}

export const mockAccounts: MockAccount[] = [
  { id: 'user', password: 'user1234', name: '김민수', role: 'USER', orgId: 'planning-dept', email: 'user@test.com' },
  { id: 'admin', password: 'admin1234', name: '이관리', role: 'SYSTEM_ADMIN', orgId: 'it-dept', email: 'admin@test.com' },
  { id: 'super', password: 'super1234', name: '박최고', role: 'SUPER_ADMIN', orgId: 'it-dept', email: 'super@test.com' },
  { id: 'user2', password: 'user1234', name: '정수진', role: 'USER', orgId: 'water-pipe-team', email: 'jsj@test.com' },
  { id: 'user3', password: 'user1234', name: '최동현', role: 'USER', orgId: 'sewage-pipe-team', email: 'cdh@test.com' },
  { id: 'user4', password: 'user1234', name: '한서연', role: 'USER', orgId: 'road-mgmt-team', email: 'hsy@test.com' },
  { id: 'admin2', password: 'admin1234', name: '오준호', role: 'SYSTEM_ADMIN', orgId: 'facility-mgmt-team', email: 'ojh@test.com' },
]
