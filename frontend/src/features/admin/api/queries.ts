import { useQuery } from '@tanstack/react-query'
import * as api from './index.ts'

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

export function useTools() {
  return useQuery({ queryKey: ['tools'], queryFn: api.fetchTools })
}

export function useSystemTools(systemId?: string) {
  return useQuery({
    queryKey: ['systemTools', systemId],
    queryFn: () => api.fetchSystemTools(systemId),
  })
}

export function useLayers(systemId?: string) {
  return useQuery({
    queryKey: ['layers', systemId],
    queryFn: () => api.fetchLayers(systemId),
  })
}

export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: api.fetchUsers })
}

export function useSystemRoles(systemId?: string) {
  return useQuery({
    queryKey: ['systemRoles', systemId],
    queryFn: () => api.fetchSystemRoles(systemId),
  })
}

export function useUserRoleAssignments(userId?: string) {
  return useQuery({
    queryKey: ['userRoleAssignments', userId],
    queryFn: () => api.fetchUserRoleAssignments(userId),
    enabled: !!userId,
  })
}
