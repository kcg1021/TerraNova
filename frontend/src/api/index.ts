import { mockBoards, mockPosts, mockSystems } from '../mocks/mainPageData'
import {
  mockAdminSystems,
  mockSystemAdminPermissions,
  mockDailyAccess,
  mockSystemDailyAccess,
  mockMenuUsage,
  mockSystemMenus,
  mockAdminNotifications,
} from '../mocks/adminData'
import type { Board, BoardPost, SystemMenu } from '../types/board'
import type {
  AdminSystem,
  SystemAdminPermission,
  DailyAccessSummary,
  MenuUsageRankItem,
  AdminMenu,
  AdminNotification,
} from '../types/admin'

// --- 실제 API 전환 시 이 파일의 구현부만 교체하면 됩니다 ---

export async function fetchBoards(): Promise<Board[]> {
  return mockBoards
}

export async function fetchPosts(): Promise<BoardPost[]> {
  return mockPosts
}

export async function fetchPost(boardId: string, postId: number): Promise<BoardPost | undefined> {
  return mockPosts.find(p => p.boardId === boardId && p.id === postId)
}

export async function fetchSystems(): Promise<SystemMenu[]> {
  return mockSystems
}

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
