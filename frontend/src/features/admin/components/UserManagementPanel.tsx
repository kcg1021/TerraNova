import { useState, useMemo, useRef } from 'react'
import { Icon, Button, Input, Avatar, Badge, Pagination, SaveBar, EmptyState, PanelHeader } from '@/shared/components/ui-kit'
import Toast from '@/shared/components/Toast'
import { useClickOutside } from '@/shared/hooks/useClickOutside'
import { useToast } from '@/shared/hooks/useToast'
import { mockOrganization, type OrgUnit } from '@/shared/mocks/organization'
import { useUsers, useAdminSystems, useAdminPermissions } from '../api/queries'
import type { AdminSystem } from '../types/index'
import type { MockAccount } from '@/shared/mocks/accounts'

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: '슈퍼 관리자',
  SYSTEM_ADMIN: '시스템 관리자',
  USER: '일반 사용자',
}

const ROLE_BADGE_COLORS: Record<string, 'red' | 'emerald' | 'slate'> = {
  SUPER_ADMIN: 'red',
  SYSTEM_ADMIN: 'emerald',
  USER: 'slate',
}

const PAGE_SIZE = 10

function getOrgPath(orgId: string | undefined, orgs: OrgUnit[]): string {
  if (!orgId) return '소속 없음'
  const parts: string[] = []
  let current = orgs.find(o => o.id === orgId)
  while (current) {
    parts.unshift(current.name)
    current = current.parentId ? orgs.find(o => o.id === current!.parentId) : undefined
  }
  return parts.join(' > ')
}

function getOrgName(orgId: string | undefined): string {
  if (!orgId) return '소속 없음'
  return mockOrganization.find(o => o.id === orgId)?.name ?? '소속 없음'
}

export default function UserManagementPanel() {
  const { data: users = [] } = useUsers()
  const { data: systems = [] } = useAdminSystems()
  const { data: permissions = [] } = useAdminPermissions()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddForm, setShowAddForm] = useState(false)

  const filteredUsers = useMemo(() => {
    if (!search) return users
    const term = search.toLowerCase()
    return users.filter(u =>
      u.name.toLowerCase().includes(term) ||
      u.id.toLowerCase().includes(term) ||
      getOrgName(u.orgId).toLowerCase().includes(term)
    )
  }, [users, search])

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE)
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredUsers.slice(start, start + PAGE_SIZE)
  }, [filteredUsers, currentPage])

  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) : null

  return (
    <div className="flex flex-col gap-4 h-full">
      <PanelHeader
        title="사용자 관리"
        subtitle={`사용자 정보를 관리하고 시스템 접근 권한을 부여합니다 · 총 ${users.length}명`}
        action={
          <Button color="emerald" size="sm" onClick={() => { setShowAddForm(true); setSelectedUserId(null) }}>
            + 사용자 추가
          </Button>
        }
      />

      <div className="flex gap-4 flex-1 min-h-0">
        {/* 좌측: 사용자 목록 */}
        <div className="w-80 shrink-0 flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800">
            <Input
              icon={<Icon name="search" className="w-4 h-4" />}
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
              placeholder="이름, 아이디, 부서 검색..."
              accentColor="emerald"
              size="sm"
            />
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {paginatedUsers.map(user => (
              <button
                key={user.id}
                onClick={() => { setSelectedUserId(user.id); setShowAddForm(false) }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-slate-50 dark:border-slate-800/50 last:border-b-0 transition-colors cursor-pointer ${
                  selectedUserId === user.id
                    ? 'bg-emerald-50 dark:bg-emerald-950/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                }`}
              >
                <Avatar name={user.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</span>
                    <Badge color={ROLE_BADGE_COLORS[user.role]} className="shrink-0">
                      {ROLE_LABELS[user.role]}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                    {getOrgName(user.orgId)} · {user.id}
                  </div>
                </div>
              </button>
            ))}
            {paginatedUsers.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500">검색 결과가 없습니다</div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="p-3 border-t border-slate-100 dark:border-slate-800">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </div>

        {/* 우측 */}
        <div className="flex-1 min-w-0">
          {showAddForm ? (
            <UserAddForm onClose={() => setShowAddForm(false)} />
          ) : selectedUser ? (
            <UserDetailPanel user={selectedUser} systems={systems} permissions={permissions} />
          ) : (
            <EmptyState icon="user" message="좌측에서 사용자를 선택하세요" />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── 조직 트리 선택 드롭다운 ─────────────────────────────────

function OrgTreeSelect({ value, onChange }: { value?: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useClickOutside(ref, () => setOpen(false))

  const roots = mockOrganization.filter(o => o.parentId === null)
  const selectedName = value ? getOrgPath(value, mockOrganization) : undefined

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm border rounded-lg transition-all cursor-pointer ${
          open
            ? 'border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/30 dark:ring-emerald-400/20 bg-white dark:bg-slate-800'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
        }`}
      >
        <span className={selectedName ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}>
          {selectedName ?? '소속 부서를 선택하세요'}
        </span>
        <Icon name="chevronDown" className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/30 max-h-64 overflow-y-auto scrollbar-thin py-1">
          {roots.map(root => (
            <OrgTreeNode key={root.id} node={root} depth={0} selectedId={value} onSelect={id => { onChange(id); setOpen(false) }} />
          ))}
        </div>
      )}
    </div>
  )
}

function OrgTreeNode({ node, depth, selectedId, onSelect }: { node: OrgUnit; depth: number; selectedId?: string; onSelect: (id: string) => void }) {
  const children = mockOrganization.filter(o => o.parentId === node.id)
  const isSelected = selectedId === node.id

  return (
    <>
      <button
        type="button"
        onClick={() => onSelect(node.id)}
        className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors cursor-pointer ${
          isSelected
            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-medium'
            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
        }`}
        style={{ paddingLeft: `${12 + depth * 20}px` }}
      >
        {children.length > 0 ? (
          <Icon name="folder" className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        {node.name}
      </button>
      {children.map(child => (
        <OrgTreeNode key={child.id} node={child} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} />
      ))}
    </>
  )
}

// ─── 폼 필드 ─────────────────────────────────────────────────

const selectClass = 'w-full px-4 py-3 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all cursor-pointer'

// ─── 사용자 추가 폼 ─────────────────────────────────────────

function UserAddForm({ onClose }: { onClose: () => void }) {
  const [orgId, setOrgId] = useState<string | undefined>()

  return (
    <div className="h-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">새 사용자 등록</h4>
        <Button variant="ghost" size="sm" onClick={onClose} className="!p-1">
          <Icon name="close" className="w-5 h-5" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
        <div className="space-y-5 max-w-lg">
          <div className="grid grid-cols-2 gap-4">
            <Input label="아이디" placeholder="로그인에 사용할 아이디" variant="default" accentColor="emerald" />
            <Input label="이름" placeholder="사용자 이름" variant="default" accentColor="emerald" />
          </div>
          <Input label="이메일" type="email" placeholder="example@email.com" variant="default" accentColor="emerald" />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">소속 부서</label>
            <div className="mt-2">
              <OrgTreeSelect value={orgId} onChange={setOrgId} />
            </div>
          </div>
          <Input label="초기 비밀번호" type="password" placeholder="초기 비밀번호 지정" variant="default" accentColor="emerald" />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">역할</label>
            <select defaultValue="USER" className={selectClass}>
              <option value="USER">일반 사용자</option>
              <option value="SYSTEM_ADMIN">시스템 관리자</option>
              <option value="SUPER_ADMIN">슈퍼 관리자</option>
            </select>
          </div>
          <div className="flex gap-3 pt-3">
            <Button color="emerald" size="sm">사용자 등록</Button>
            <Button variant="secondary" size="sm" onClick={onClose}>취소</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 사용자 상세 패널 (시스템 접근만) ────────────────────────

function UserDetailPanel({
  user,
  systems,
  permissions,
}: {
  user: MockAccount
  systems: AdminSystem[]
  permissions: { userId: string; systemIds: string[] }[]
}) {
  const [editing, setEditing] = useState(false)
  const [editOrgId, setEditOrgId] = useState(user.orgId)
  const { toast, showToast, hideToast } = useToast()

  const userPerm = permissions.find(p => p.userId === user.id)
  const initialSystemIds = new Set(userPerm?.systemIds ?? [])
  const [checkedSystems, setCheckedSystems] = useState(initialSystemIds)
  const [dirty, setDirty] = useState(false)

  const toggleSystem = (sysId: string) => {
    setCheckedSystems(prev => {
      const next = new Set(prev)
      if (next.has(sysId)) next.delete(sysId)
      else next.add(sysId)
      return next
    })
    setDirty(true)
  }

  const handleSave = () => {
    showToast('변경사항이 저장되었습니다')
    setDirty(false)
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden">
      {/* 사용자 정보 헤더 */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={user.name} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</span>
                <Badge color={ROLE_BADGE_COLORS[user.role]}>
                  {ROLE_LABELS[user.role]}
                </Badge>
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {getOrgPath(user.orgId, mockOrganization)} · {user.email}
              </div>
            </div>
          </div>
          <button
            onClick={() => { setEditing(!editing); setEditOrgId(user.orgId) }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
              editing
                ? 'text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30'
                : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            {editing ? '접기' : '정보 수정'}
          </button>
        </div>

        {editing && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="이름" defaultValue={user.name} variant="default" accentColor="emerald" size="sm" />
              <Input label="이메일" type="email" defaultValue={user.email} variant="default" accentColor="emerald" size="sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">소속 부서</label>
                <OrgTreeSelect value={editOrgId} onChange={setEditOrgId} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">역할</label>
                <select defaultValue={user.role} className={selectClass}>
                  <option value="USER">일반 사용자</option>
                  <option value="SYSTEM_ADMIN">시스템 관리자</option>
                  <option value="SUPER_ADMIN">슈퍼 관리자</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 시스템 접근 권한 (체크만, 역할은 각 시스템에서) */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-5">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">시스템 접근 권한</h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
            접근 허용된 시스템에는 기본 역할이 자동 부여됩니다. 세부 역할은 각 시스템의 사용자 관리에서 설정합니다.
          </p>
          <div className="space-y-2">
            {systems.map(sys => {
              const isChecked = checkedSystems.has(sys.id)
              return (
                <label
                  key={sys.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSystem(sys.id)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-600 cursor-pointer"
                  />
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: sys.color }} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">{sys.name}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">{sys.description}</div>
                  </div>
                  {isChecked && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      기본 역할
                    </span>
                  )}
                </label>
              )
            })}
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <SaveBar isDirty={dirty} onSave={handleSave} />

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}
