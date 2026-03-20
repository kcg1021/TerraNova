import { useState, useMemo } from 'react'
import { Pagination, SaveBar, EmptyState } from '@/shared/components/ui-kit'
import Toast from '@/shared/components/Toast'
import { useToast } from '@/shared/hooks/useToast'
import { useUsers, useSystemRoles, useUserRoleAssignments } from '../api/queries'
import type { MockAccount } from '@/shared/mocks/accounts'

const PAGE_SIZE = 10

interface Props {
  systemId: string
}

export default function SystemUserPanel({ systemId }: Props) {
  const { data: allUsers = [] } = useUsers()
  const { data: roles = [] } = useSystemRoles(systemId)
  const { data: allAssignments = [] } = useUserRoleAssignments()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // 이 시스템에 접근 권한이 있는 사용자만 필터
  const systemAssignments = allAssignments.filter(a => a.systemId === systemId)
  const systemUserIds = new Set(systemAssignments.map(a => a.userId))
  const systemUsers = allUsers.filter(u => systemUserIds.has(u.id))

  const filteredUsers = useMemo(() => {
    if (!search) return systemUsers
    const term = search.toLowerCase()
    return systemUsers.filter(u => u.name.toLowerCase().includes(term) || u.id.toLowerCase().includes(term))
  }, [systemUsers, search])

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE)
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredUsers.slice(start, start + PAGE_SIZE)
  }, [filteredUsers, currentPage])

  const selectedUser = selectedUserId ? allUsers.find(u => u.id === selectedUserId) : null
  const selectedAssignment = selectedUserId ? systemAssignments.find(a => a.userId === selectedUserId) : null

  return (
    <div className="flex flex-col gap-4 h-full">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">사용자 관리</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          이 시스템에 접근 가능한 사용자의 역할을 관리합니다 · {systemUsers.length}명
        </p>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* 좌측: 사용자 목록 */}
        <div className="w-72 shrink-0 flex flex-col bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="p-3 border-b border-gray-100 dark:border-gray-800">
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
              placeholder="사용자 검색..."
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {paginatedUsers.map(user => {
              const assignment = systemAssignments.find(a => a.userId === user.id)
              const roleCount = assignment?.roleIds.length ?? 0
              return (
                <button
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-50 dark:border-gray-800/50 last:border-b-0 transition-colors cursor-pointer ${
                    selectedUserId === user.id ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-300 shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {roleCount > 0 ? `${roleCount}개 역할` : '기본 역할만'}
                    </div>
                  </div>
                </button>
              )
            })}
            {paginatedUsers.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                {systemUsers.length === 0 ? '접근 권한이 부여된 사용자가 없습니다' : '검색 결과가 없습니다'}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="p-3 border-t border-gray-100 dark:border-gray-800">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </div>

        {/* 우측: 역할 배정 */}
        <div className="flex-1 min-w-0">
          {selectedUser ? (
            <UserRoleEditor user={selectedUser} roles={roles} assignedRoleIds={selectedAssignment?.roleIds ?? []} />
          ) : (
            <EmptyState icon="user" message="좌측에서 사용자를 선택하세요" />
          )}
        </div>
      </div>
    </div>
  )
}

function UserRoleEditor({
  user,
  roles,
  assignedRoleIds: initialRoleIds,
}: {
  user: MockAccount
  roles: { id: string; name: string; description?: string; isDefault?: boolean; permissions: import('../types/index').RolePermissions }[]
  assignedRoleIds: string[]
}) {
  const [checkedRoles, setCheckedRoles] = useState(new Set(initialRoleIds))
  const [dirty, setDirty] = useState(false)
  const { toast, showToast, hideToast } = useToast()

  const defaultRole = roles.find(r => r.isDefault)
  const otherRoles = roles.filter(r => !r.isDefault)

  const toggleRole = (roleId: string) => {
    setCheckedRoles(prev => {
      const next = new Set(prev)
      if (next.has(roleId)) next.delete(roleId)
      else next.add(roleId)
      return next
    })
    setDirty(true)
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-sm font-bold text-gray-500 dark:text-gray-300">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500">{user.id} · {user.email}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">부여된 역할</h4>

        {/* 기본 역할 (항상 표시, 체크 해제 불가) */}
        {defaultRole && (
          <div className="mb-3">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
              <input type="checkbox" checked disabled className="h-4 w-4 rounded border-gray-300 text-emerald-600 mt-0.5 cursor-not-allowed" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{defaultRole.name}</span>
                  <span className="px-1.5 py-0.5 text-xs rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">자동 부여</span>
                </div>
                {defaultRole.description && (
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{defaultRole.description}</div>
                )}
                <PermissionSummary permissions={defaultRole.permissions} />
              </div>
            </div>
          </div>
        )}

        {/* 추가 역할 */}
        {otherRoles.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">추가 역할을 선택하세요</p>
            {otherRoles.map(role => {
              const isChecked = checkedRoles.has(role.id)
              return (
                <label
                  key={role.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    isChecked
                      ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleRole(role.id)}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-gray-600 cursor-pointer mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{role.name}</div>
                    {role.description && (
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{role.description}</div>
                    )}
                    <PermissionSummary permissions={role.permissions} />
                  </div>
                </label>
              )
            })}
          </div>
        )}

        {otherRoles.length === 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 py-4">추가 역할이 정의되지 않았습니다. 역할 관리에서 역할을 생성하세요.</p>
        )}
      </div>

      <SaveBar isDirty={dirty} onSave={() => { showToast('변경사항이 저장되었습니다'); setDirty(false) }} />

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}

function PermissionSummary({ permissions }: { permissions: import('../types/index').RolePermissions }) {
  const tags: { label: string; color: string }[] = []

  const menuAllows = Object.values(permissions.menus).filter(v => v === 'allow').length
  const menuDenies = Object.values(permissions.menus).filter(v => v === 'deny').length
  if (menuAllows > 0) tags.push({ label: `메뉴 ${menuAllows}허용`, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' })
  if (menuDenies > 0) tags.push({ label: `메뉴 ${menuDenies}거부`, color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' })

  const layerCount = Object.keys(permissions.layers).length
  if (layerCount > 0) tags.push({ label: `레이어 ${layerCount}`, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' })

  const toolAllows = Object.values(permissions.tools).filter(v => v === 'allow').length
  if (toolAllows > 0) tags.push({ label: `도구 ${toolAllows}`, color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' })

  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {tags.map((tag, i) => (
        <span key={i} className={`px-1.5 py-0.5 text-xs rounded ${tag.color}`}>{tag.label}</span>
      ))}
    </div>
  )
}
