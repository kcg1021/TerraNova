import { useState, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Avatar, Badge, Button, Checkbox, Input, SaveBar, EmptyState, PanelHeader, ListDetailLayout } from '@/shared/components/ui-kit'
import Toast from '@/shared/components/Toast'
import { useToast } from '@/shared/hooks/useToast'
import { useAuth } from '@/shared/contexts/AuthContext'
import { useUsers, useSystemRoles, useUserRoleAssignments, useRoleRequests, useAdminPermissions } from '../api/queries'
import { mockRoleRequests, mockUserRoleAssignments } from '../mocks/adminData'
import type { MockAccount } from '@/shared/mocks/accounts'
import type { RoleRequest, SystemRole } from '../types/index'

const PAGE_SIZE = 10

interface Props {
  systemId: string
}

export default function SystemUserPanel({ systemId }: Props) {
  const queryClient = useQueryClient()
  const { data: allUsers = [] } = useUsers()
  const { data: roles = [] } = useSystemRoles(systemId)
  const { data: allAssignments = [] } = useUserRoleAssignments()
  const { data: roleRequests = [] } = useRoleRequests(systemId)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<'user' | 'request'>('user')
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const pendingRequests = roleRequests.filter(r => r.status === 'pending')

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

  const selectedRequest = selectedRequestId ? roleRequests.find(r => r.id === selectedRequestId) : null
  const requestUser = selectedRequest ? allUsers.find(u => u.id === selectedRequest.userId) : null

  return (
    <div className="flex flex-col gap-4 h-full">
      <PanelHeader
        title="사용자 관리"
        subtitle={`이 시스템에 접근 가능한 사용자의 역할을 관리합니다 · ${systemUsers.length}명`}
      />

      <ListDetailLayout
        search={{
          value: search,
          onChange: v => { setSearch(v); setCurrentPage(1) },
          placeholder: '사용자 검색...',
        }}
        pagination={{ currentPage, totalPages, onPageChange: setCurrentPage }}
        accentColor="emerald"
        itemCount={paginatedUsers.length + pendingRequests.length}
        emptyMessage={systemUsers.length === 0 ? '접근 권한이 부여된 사용자가 없습니다' : '검색 결과가 없습니다'}
        hasSelection={!!selectedUserId || !!selectedRequestId}
        onBack={() => { setSelectedUserId(null); setSelectedRequestId(null); setSelectedType('user') }}
        listItems={
          <>
            {pendingRequests.length > 0 && (
              <>
                <div className="px-4 py-2 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20">
                  권한 요청 {pendingRequests.length}건
                </div>
                {pendingRequests.map(req => {
                  const reqUser = allUsers.find(u => u.id === req.userId)
                  if (!reqUser) return null
                  return (
                    <button
                      key={req.id}
                      onClick={() => { setSelectedType('request'); setSelectedRequestId(req.id); setSelectedUserId(null) }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-slate-50 dark:border-slate-800/50 last:border-b-0 transition-colors cursor-pointer ${
                        selectedRequestId === req.id ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                      }`}
                    >
                      <Avatar name={reqUser.name} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{reqUser.name}</span>
                          <Badge color="amber">요청</Badge>
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                          {req.roleIds.length}개 역할 · {req.requestedAt}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </>
            )}
            {paginatedUsers.map(user => {
              const assignment = systemAssignments.find(a => a.userId === user.id)
              const roleCount = assignment?.roleIds.length ?? 0
              return (
                <button
                  key={user.id}
                  onClick={() => { setSelectedType('user'); setSelectedUserId(user.id); setSelectedRequestId(null) }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-slate-50 dark:border-slate-800/50 last:border-b-0 transition-colors cursor-pointer ${
                    selectedUserId === user.id ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <Avatar name={user.name} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {roleCount > 0 ? `${roleCount}개 역할` : '기본 역할만'}
                    </div>
                  </div>
                </button>
              )
            })}
          </>
        }
      >
        {selectedType === 'request' && selectedRequest && requestUser ? (
          <RoleRequestDetail request={selectedRequest} user={requestUser} systemId={systemId} roles={roles} />
        ) : selectedUser ? (
          <UserRoleEditor user={selectedUser} roles={roles} assignedRoleIds={selectedAssignment?.roleIds ?? []} />
        ) : (
          <EmptyState icon="user" message="좌측에서 사용자를 선택하세요" />
        )}
      </ListDetailLayout>
    </div>
  )
}

function RoleRequestDetail({
  request,
  user,
  systemId,
  roles,
}: {
  request: RoleRequest
  user: MockAccount
  systemId: string
  roles: SystemRole[]
}) {
  const queryClient = useQueryClient()
  const { user: currentUser } = useAuth()
  const { data: adminPerms = [] } = useAdminPermissions()
  const { toast, showToast, hideToast } = useToast()
  const [rejecting, setRejecting] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  // 권한 확인: SUPER_ADMIN은 모두 가능, SYSTEM_ADMIN은 자기 시스템만
  const canProcess = (() => {
    if (!currentUser) return false
    if (currentUser.role === 'SUPER_ADMIN') return true
    if (currentUser.role === 'SYSTEM_ADMIN') {
      const perm = adminPerms.find(p => p.userId === currentUser.id)
      return perm ? perm.systemIds.includes(systemId) : false
    }
    return false
  })()

  const requestedRoleNames = request.roleIds
    .map(rid => roles.find(r => r.id === rid)?.name ?? rid)

  const handleApprove = () => {
    if (!currentUser) return
    // mock 데이터 직접 변경
    const target = mockRoleRequests.find(r => r.id === request.id)
    if (target) {
      target.status = 'approved'
      target.processedAt = new Date().toISOString().slice(0, 10)
      target.processedBy = currentUser.id
    }

    // 역할 배정 추가
    const existing = mockUserRoleAssignments.find(
      a => a.userId === request.userId && a.systemId === request.systemId
    )
    if (existing) {
      const newRoleIds = new Set([...existing.roleIds, ...request.roleIds])
      existing.roleIds = Array.from(newRoleIds)
    } else {
      mockUserRoleAssignments.push({
        userId: request.userId,
        systemId: request.systemId,
        roleIds: [...request.roleIds],
      })
    }

    queryClient.invalidateQueries({ queryKey: ['admin', 'roleRequests'] })
    queryClient.invalidateQueries({ queryKey: ['userRoleAssignments'] })
    showToast('권한 요청을 승인했습니다')
  }

  const handleReject = () => {
    if (!currentUser) return
    const target = mockRoleRequests.find(r => r.id === request.id)
    if (target) {
      target.status = 'rejected'
      target.rejectionReason = rejectionReason || undefined
      target.processedAt = new Date().toISOString().slice(0, 10)
      target.processedBy = currentUser.id
    }

    queryClient.invalidateQueries({ queryKey: ['admin', 'roleRequests'] })
    queryClient.invalidateQueries({ queryKey: ['userRoleAssignments'] })
    setRejecting(false)
    setRejectionReason('')
    showToast('권한 요청을 반려했습니다')
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden">
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</span>
              <Badge color="amber">권한 요청</Badge>
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500">{user.id} · {user.email}</div>
          </div>
        </div>
      </div>

      {/* 요청 정보 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
        <div className="space-y-4">
          {/* 요청일 */}
          <div>
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">요청일</h4>
            <p className="text-sm text-slate-900 dark:text-white">{request.requestedAt}</p>
          </div>

          {/* 요청 역할 */}
          <div>
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">요청 역할</h4>
            <div className="space-y-1.5">
              {requestedRoleNames.map((name, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                  <span className="text-sm text-slate-900 dark:text-white">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 요청 사유 */}
          {request.reason && (
            <div>
              <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">요청 사유</h4>
              <p className="text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3 py-2">{request.reason}</p>
            </div>
          )}

          {/* 승인/반려 액션 */}
          {canProcess && request.status === 'pending' && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              {rejecting ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400">반려 사유 (선택)</h4>
                  <Input
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                    placeholder="반려 사유를 입력하세요..."
                    size="sm"
                  />
                  <div className="flex gap-2">
                    <Button color="red" size="sm" onClick={handleReject}>반려 확인</Button>
                    <Button variant="ghost" color="gray" size="sm" onClick={() => { setRejecting(false); setRejectionReason('') }}>취소</Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button color="emerald" size="sm" onClick={handleApprove}>승인</Button>
                  <Button color="red" variant="secondary" size="sm" onClick={() => setRejecting(true)}>반려</Button>
                </div>
              )}
            </div>
          )}

          {/* 권한 없음 안내 */}
          {!canProcess && request.status === 'pending' && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-400 dark:text-slate-500">이 시스템의 권한 요청을 처리할 권한이 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
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
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="md" />
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500">{user.id} · {user.email}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">부여된 역할</h4>

        {/* 기본 역할 (항상 표시, 체크 해제 불가) */}
        {defaultRole && (
          <div className="mb-3">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
              <Checkbox checked disabled accentColor="emerald" className="mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{defaultRole.name}</span>
                  <Badge color="emerald">자동 부여</Badge>
                </div>
                {defaultRole.description && (
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{defaultRole.description}</div>
                )}
                <PermissionSummary permissions={defaultRole.permissions} />
              </div>
            </div>
          </div>
        )}

        {/* 추가 역할 */}
        {otherRoles.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">추가 역할을 선택하세요</p>
            {otherRoles.map(role => {
              const isChecked = checkedRoles.has(role.id)
              return (
                <label
                  key={role.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    isChecked
                      ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <Checkbox
                    checked={isChecked}
                    onChange={() => toggleRole(role.id)}
                    accentColor="emerald"
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">{role.name}</div>
                    {role.description && (
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{role.description}</div>
                    )}
                    <PermissionSummary permissions={role.permissions} />
                  </div>
                </label>
              )
            })}
          </div>
        )}

        {otherRoles.length === 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500 py-4">추가 역할이 정의되지 않았습니다. 역할 관리에서 역할을 생성하세요.</p>
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
