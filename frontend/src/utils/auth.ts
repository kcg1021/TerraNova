import type { UserRole } from '../types/auth'

export function isAdminRole(role?: UserRole): boolean {
  return role === 'SUPER_ADMIN' || role === 'SYSTEM_ADMIN'
}

export function isSuperAdminRole(role?: UserRole): boolean {
  return role === 'SUPER_ADMIN'
}

export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'SUPER_ADMIN': return '슈퍼 관리자'
    case 'SYSTEM_ADMIN': return '시스템 관리자'
    case 'USER': return '일반 사용자'
  }
}
