import {
  mockAdminSystems,
  mockSystemAdminPermissions,
  mockDailyAccess,
  mockSystemDailyAccess,
  mockMenuUsage,
  mockSystemMenus,
  mockAdminNotifications,
  mockTools,
  mockSystemTools,
  mockLayers,
  mockSystemRoles,
  mockUserRoleAssignments,
} from '../mocks/adminData.ts'
import { mockAccounts } from '@/shared/mocks/accounts.ts'
import type { MockAccount } from '@/shared/mocks/accounts.ts'
import type {
  AdminSystem,
  SystemAdminPermission,
  DailyAccessSummary,
  MenuUsageRankItem,
  AdminMenu,
  AdminNotification,
  Tool,
  SystemTool,
  Layer,
  SystemRole,
  UserRoleAssignment,
} from '../types/index.ts'

export async function fetchAdminSystems(): Promise<AdminSystem[]> {
  return mockAdminSystems
}

export async function fetchAdminPermissions(): Promise<SystemAdminPermission[]> {
  return mockSystemAdminPermissions
}

export async function fetchDailyAccess(): Promise<DailyAccessSummary[]> {
  return mockDailyAccess
}

export async function fetchSystemDailyAccess(): Promise<Record<string, DailyAccessSummary[]>> {
  return mockSystemDailyAccess
}

export async function fetchMenuUsage(): Promise<MenuUsageRankItem[]> {
  return mockMenuUsage
}

export async function fetchSystemMenus(systemId?: string): Promise<AdminMenu[]> {
  if (systemId) return mockSystemMenus.filter(m => m.systemId === systemId)
  return mockSystemMenus
}

export async function fetchAdminNotifications(): Promise<AdminNotification[]> {
  return mockAdminNotifications
}

export async function fetchTools(): Promise<Tool[]> {
  return mockTools
}

export async function fetchSystemTools(systemId?: string): Promise<SystemTool[]> {
  if (systemId) return mockSystemTools.filter(t => t.systemId === systemId)
  return mockSystemTools
}

export async function fetchLayers(systemId?: string): Promise<Layer[]> {
  if (systemId) return mockLayers.filter(l => l.systemId === systemId)
  return mockLayers
}

export async function fetchUsers(): Promise<MockAccount[]> {
  return mockAccounts
}

export async function fetchSystemRoles(systemId?: string): Promise<SystemRole[]> {
  if (systemId) return mockSystemRoles.filter(r => r.systemId === systemId)
  return mockSystemRoles
}

export async function fetchUserRoleAssignments(userId?: string): Promise<UserRoleAssignment[]> {
  if (userId) return mockUserRoleAssignments.filter(a => a.userId === userId)
  return mockUserRoleAssignments
}
