import {
  mockAdminSystems,
  mockSystemAdminPermissions,
  mockDailyAccess,
  mockSystemDailyAccess,
  mockMenuUsage,
  mockSystemMenus,
  mockAdminNotifications,
} from '../mocks/adminData.ts'
import type {
  AdminSystem,
  SystemAdminPermission,
  DailyAccessSummary,
  MenuUsageRankItem,
  AdminMenu,
  AdminNotification,
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
