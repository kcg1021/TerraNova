export interface AdminSystem {
  id: string
  name: string
  description: string
  color: string
}

export interface SystemAdminPermission {
  userId: string
  systemIds: string[]
}

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

export interface AdminMenu {
  id: string
  systemId: string
  name: string
  description?: string
}
