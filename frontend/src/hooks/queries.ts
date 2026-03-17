import { useQuery } from '@tanstack/react-query'
import * as api from '../api'

export function useBoards() {
  return useQuery({ queryKey: ['boards'], queryFn: api.fetchBoards })
}

export function usePosts() {
  return useQuery({ queryKey: ['posts'], queryFn: api.fetchPosts })
}

export function usePost(boardId: string | undefined, postId: number | undefined) {
  return useQuery({
    queryKey: ['post', boardId, postId],
    queryFn: () => api.fetchPost(boardId!, postId!),
    enabled: !!boardId && !!postId,
  })
}

export function useSystems() {
  return useQuery({ queryKey: ['systems'], queryFn: api.fetchSystems })
}

export function useAdminSystems() {
  return useQuery({ queryKey: ['adminSystems'], queryFn: api.fetchAdminSystems })
}

export function useAdminPermissions(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['adminPermissions'],
    queryFn: api.fetchAdminPermissions,
    enabled: options?.enabled,
  })
}

export function useDailyAccess() {
  return useQuery({ queryKey: ['dailyAccess'], queryFn: api.fetchDailyAccess })
}

export function useSystemDailyAccess() {
  return useQuery({ queryKey: ['systemDailyAccess'], queryFn: api.fetchSystemDailyAccess })
}

export function useMenuUsage() {
  return useQuery({ queryKey: ['menuUsage'], queryFn: api.fetchMenuUsage })
}

export function useSystemMenus(systemId?: string) {
  return useQuery({
    queryKey: ['systemMenus', systemId],
    queryFn: () => api.fetchSystemMenus(systemId),
  })
}

export function useAdminNotifications(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['adminNotifications'],
    queryFn: api.fetchAdminNotifications,
    enabled: options?.enabled,
  })
}
