// === 시스템 ===
export interface AdminSystem {
  id: string
  name: string
  description: string
  color: string
}

// === 시스템 메뉴 ===
export interface AdminMenu {
  id: string
  systemId: string
  name: string
  description?: string
  order?: number
}

// === 공통 도구 풀 ===
export interface Tool {
  id: string
  name: string
  description?: string
  icon?: string
  category: 'measure' | 'search' | 'analysis' | 'print' | 'edit' | 'etc'
}

// === 시스템별 도구 설정 ===
export interface SystemTool {
  systemId: string
  toolId: string
  order: number
  enabled: boolean
  config?: Record<string, unknown>
}

// === 레이어 ===
export interface Layer {
  id: string
  systemId: string
  name: string
  description?: string
  type: 'point' | 'line' | 'polygon' | 'raster'
  order?: number
}

// === 권한 3단계 ===
export type PermissionLevel = 'allow' | 'deny' | 'inherit'

// === 시스템 권한 역할 (각 시스템에서 생성) ===
export interface SystemRole {
  id: string
  systemId: string
  name: string
  description?: string
  isDefault?: boolean
  permissions: RolePermissions
}

// === 권한 역할이 가진 세부 권한 ===
export interface RolePermissions {
  menus: Record<string, PermissionLevel>           // menuId → allow/deny/inherit
  layers: Record<string, LayerActionPermissions>    // layerId → 상세권한
  tools: Record<string, PermissionLevel>            // toolId → allow/deny/inherit
}

// === 레이어 상세권한 ===
export interface LayerActionPermissions {
  view: PermissionLevel
  edit: PermissionLevel
  delete: PermissionLevel
  export: PermissionLevel
}

// === 사용자에게 부여된 역할 ===
export interface UserRoleAssignment {
  userId: string
  systemId: string
  roleIds: string[]
}

// === 시스템 관리자 권한 ===
export interface SystemAdminPermission {
  userId: string
  systemIds: string[]
}

// === 역할 권한 요청 ===
export interface RoleRequest {
  id: string
  userId: string
  systemId: string
  roleIds: string[]
  status: 'pending' | 'approved' | 'rejected'
  reason?: string
  requestedAt: string
  processedAt?: string
  processedBy?: string
  rejectionReason?: string
}

// === 대시보드 통계 ===
export interface DailyAccessSummary {
  date: string
  count: number
}

export interface MenuUsageRankItem {
  menuName: string
  systemId: string
  systemName: string
  count: number
  color: string
}

export interface AdminNotification {
  id: string
  type: 'permission_request' | 'stats'
  systemId: string
  systemName: string
  count: number
  message: string
}
