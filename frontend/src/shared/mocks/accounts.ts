import type { UserRole, UserStatus } from '../types/auth'

export interface MockAccount {
  id: string
  password: string
  name: string
  role: UserRole
  orgId?: string
  email?: string
  status: UserStatus
  registeredAt: string
  phone?: string
}

export const mockAccounts: MockAccount[] = [
  { id: 'user', password: 'user1234', name: '김민수', role: 'USER', orgId: 'planning-dept', email: 'user@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'admin', password: 'admin1234', name: '이관리', role: 'SYSTEM_ADMIN', orgId: 'it-dept', email: 'admin@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'super', password: 'super1234', name: '박최고', role: 'SUPER_ADMIN', orgId: 'it-dept', email: 'super@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user2', password: 'user1234', name: '정수진', role: 'USER', orgId: 'water-pipe-team', email: 'jsj@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user3', password: 'user1234', name: '최동현', role: 'USER', orgId: 'sewage-pipe-team', email: 'cdh@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user4', password: 'user1234', name: '한서연', role: 'USER', orgId: 'road-mgmt-team', email: 'hsy@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'admin2', password: 'admin1234', name: '오준호', role: 'SYSTEM_ADMIN', orgId: 'facility-mgmt-team', email: 'ojh@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user5', password: 'user1234', name: '강현우', role: 'USER', orgId: 'water-facility-team', email: 'khw@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user6', password: 'user1234', name: '윤지영', role: 'USER', orgId: 'sewage-treatment-team', email: 'yjy@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user7', password: 'user1234', name: '임태호', role: 'USER', orgId: 'road-safety-team', email: 'ith@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user8', password: 'user1234', name: '배수현', role: 'USER', orgId: 'facility-inspect-team', email: 'bsh@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user9', password: 'user1234', name: '송민재', role: 'USER', orgId: 'planning-dept', email: 'smj@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user10', password: 'user1234', name: '조은비', role: 'USER', orgId: 'water-pipe-team', email: 'jeb@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user11', password: 'user1234', name: '노형석', role: 'USER', orgId: 'sewage-pipe-team', email: 'nhs@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user12', password: 'user1234', name: '황지민', role: 'USER', orgId: 'road-mgmt-team', email: 'hjm@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user13', password: 'user1234', name: '문성훈', role: 'USER', orgId: 'it-dept', email: 'msh@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'admin3', password: 'admin1234', name: '서다은', role: 'SYSTEM_ADMIN', orgId: 'water-dept', email: 'sde@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user14', password: 'user1234', name: '구본철', role: 'USER', orgId: 'facility-mgmt-team', email: 'gbc@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user15', password: 'user1234', name: '차윤서', role: 'USER', orgId: 'water-facility-team', email: 'cys@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user16', password: 'user1234', name: '류재원', role: 'USER', orgId: 'sewage-treatment-team', email: 'rjw@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user17', password: 'user1234', name: '양미라', role: 'USER', orgId: 'road-safety-team', email: 'ymr@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user18', password: 'user1234', name: '권도윤', role: 'USER', orgId: 'planning-dept', email: 'kdy@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user19', password: 'user1234', name: '남궁호', role: 'USER', orgId: 'water-pipe-team', email: 'ngh@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user20', password: 'user1234', name: '장예린', role: 'USER', orgId: 'sewage-pipe-team', email: 'jyr@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user21', password: 'user1234', name: '피승우', role: 'USER', orgId: 'road-mgmt-team', email: 'psw@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user22', password: 'user1234', name: '하은정', role: 'USER', orgId: 'facility-inspect-team', email: 'hej@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user23', password: 'user1234', name: '탁준영', role: 'USER', orgId: 'water-facility-team', email: 'tjy@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user24', password: 'user1234', name: '공서현', role: 'USER', orgId: 'sewage-treatment-team', email: 'gsh@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user25', password: 'user1234', name: '우민혁', role: 'USER', orgId: 'road-safety-team', email: 'wmh@test.com', status: 'active', registeredAt: '2025-01-01' },
  { id: 'user26', password: 'user1234', name: '신가영', role: 'USER', orgId: 'it-dept', email: 'sgy@test.com', status: 'active', registeredAt: '2025-01-01' },
  // 가입 대기 (pending) 테스트 데이터
  { id: 'pending1', password: 'user1234', name: '신입일', role: 'USER', orgId: 'planning-dept', email: 'new1@test.com', status: 'pending', registeredAt: '2026-03-20' },
  { id: 'pending2', password: 'user1234', name: '신입이', role: 'USER', orgId: 'water-pipe-team', email: 'new2@test.com', status: 'pending', registeredAt: '2026-03-21' },
  { id: 'pending3', password: 'user1234', name: '신입삼', role: 'USER', orgId: 'it-dept', email: 'new3@test.com', status: 'pending', registeredAt: '2026-03-22' },
  // 거절 (rejected) 테스트 데이터
  { id: 'rejected1', password: 'user1234', name: '거절자', role: 'USER', email: 'reject@test.com', status: 'rejected', registeredAt: '2026-03-15' },
  // 삭제 (deleted) 테스트 데이터
  { id: 'deleted1', password: 'user1234', name: '삭제자', role: 'USER', orgId: 'road-mgmt-team', email: 'del@test.com', status: 'deleted', registeredAt: '2025-06-01' },
]
