import { useState, useMemo, useRef, useEffect } from 'react'
import { Pagination } from '@/shared/components/ui-kit'
import { mockOrganization, type OrgUnit } from '@/shared/mocks/organization'
import { useUsers, useAdminSystems, useAdminPermissions } from '../api/queries'
import type { AdminSystem } from '../types/index'
import type { MockAccount } from '@/shared/mocks/accounts'

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: '슈퍼 관리자',
  SYSTEM_ADMIN: '시스템 관리자',
  USER: '일반 사용자',
}

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  SYSTEM_ADMIN: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  USER: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
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
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">사용자 관리</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            사용자 정보를 관리하고 시스템 접근 권한을 부여합니다 · 총 {users.length}명
          </p>
        </div>
        <button
          onClick={() => { setShowAddForm(true); setSelectedUserId(null) }}
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer"
        >
          + 사용자 추가
        </button>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* 좌측: 사용자 목록 */}
        <div className="w-80 shrink-0 flex flex-col bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="p-3 border-b border-gray-100 dark:border-gray-800">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
                placeholder="이름, 아이디, 부서 검색..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-gray-800 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {paginatedUsers.map(user => (
              <button
                key={user.id}
                onClick={() => { setSelectedUserId(user.id); setShowAddForm(false) }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-50 dark:border-gray-800/50 last:border-b-0 transition-colors cursor-pointer ${
                  selectedUserId === user.id
                    ? 'bg-emerald-50 dark:bg-emerald-950/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-300 shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</span>
                    <span className={`px-1.5 py-0.5 text-xs rounded shrink-0 ${ROLE_COLORS[user.role]}`}>
                      {ROLE_LABELS[user.role]}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                    {getOrgName(user.orgId)} · {user.id}
                  </div>
                </div>
              </button>
            ))}
            {paginatedUsers.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">검색 결과가 없습니다</div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="p-3 border-t border-gray-100 dark:border-gray-800">
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
            <div className="h-full flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-xl">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-400 dark:text-gray-500">좌측에서 사용자를 선택하세요</p>
              </div>
            </div>
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

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const roots = mockOrganization.filter(o => o.parentId === null)
  const selectedName = value ? getOrgPath(value, mockOrganization) : undefined

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm border rounded-lg transition-all cursor-pointer ${
          open
            ? 'border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/30 dark:ring-emerald-400/20 bg-white dark:bg-gray-800'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
      >
        <span className={selectedName ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}>
          {selectedName ?? '소속 부서를 선택하세요'}
        </span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/30 max-h-64 overflow-y-auto scrollbar-thin py-1">
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
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }`}
        style={{ paddingLeft: `${12 + depth * 20}px` }}
      >
        {children.length > 0 ? (
          <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
          </svg>
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

const fieldInputClass = 'w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 dark:focus:ring-emerald-400/20 dark:focus:border-emerald-400 transition-all'

const fieldSelectClass = `${fieldInputClass} cursor-pointer`

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{children}</label>
}

function FieldLabelSm({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{children}</label>
}

// ─── 사용자 추가 폼 ─────────────────────────────────────────

function UserAddForm({ onClose }: { onClose: () => void }) {
  const [orgId, setOrgId] = useState<string | undefined>()

  return (
    <div className="h-full bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-xl overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">새 사용자 등록</h4>
        <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
        <div className="space-y-5 max-w-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>아이디</FieldLabel>
              <input type="text" placeholder="로그인에 사용할 아이디" className={fieldInputClass} />
            </div>
            <div>
              <FieldLabel>이름</FieldLabel>
              <input type="text" placeholder="사용자 이름" className={fieldInputClass} />
            </div>
          </div>
          <div>
            <FieldLabel>이메일</FieldLabel>
            <input type="email" placeholder="example@email.com" className={fieldInputClass} />
          </div>
          <div>
            <FieldLabel>소속 부서</FieldLabel>
            <OrgTreeSelect value={orgId} onChange={setOrgId} />
          </div>
          <div>
            <FieldLabel>초기 비밀번호</FieldLabel>
            <input type="password" placeholder="초기 비밀번호 지정" className={fieldInputClass} />
          </div>
          <div>
            <FieldLabel>역할</FieldLabel>
            <select defaultValue="USER" className={fieldSelectClass}>
              <option value="USER">일반 사용자</option>
              <option value="SYSTEM_ADMIN">시스템 관리자</option>
              <option value="SUPER_ADMIN">슈퍼 관리자</option>
            </select>
          </div>
          <div className="flex gap-3 pt-3">
            <button className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer">
              사용자 등록
            </button>
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
              취소
            </button>
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
    alert('저장되었습니다. (mock)')
    setDirty(false)
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-xl overflow-hidden">
      {/* 사용자 정보 헤더 */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-sm font-bold text-gray-500 dark:text-gray-300">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</span>
                <span className={`px-1.5 py-0.5 text-xs rounded ${ROLE_COLORS[user.role]}`}>
                  {ROLE_LABELS[user.role]}
                </span>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {getOrgPath(user.orgId, mockOrganization)} · {user.email}
              </div>
            </div>
          </div>
          <button
            onClick={() => { setEditing(!editing); setEditOrgId(user.orgId) }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
              editing
                ? 'text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30'
                : 'text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {editing ? '접기' : '정보 수정'}
          </button>
        </div>

        {editing && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabelSm>이름</FieldLabelSm>
                <input type="text" defaultValue={user.name} className={fieldInputClass} />
              </div>
              <div>
                <FieldLabelSm>이메일</FieldLabelSm>
                <input type="email" defaultValue={user.email} className={fieldInputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabelSm>소속 부서</FieldLabelSm>
                <OrgTreeSelect value={editOrgId} onChange={setEditOrgId} />
              </div>
              <div>
                <FieldLabelSm>역할</FieldLabelSm>
                <select defaultValue={user.role} className={fieldSelectClass}>
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
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">시스템 접근 권한</h4>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
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
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSystem(sys.id)}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-gray-600 cursor-pointer"
                  />
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: sys.color }} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{sys.name}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{sys.description}</div>
                  </div>
                  {isChecked && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
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
      {dirty && (
        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 shrink-0 flex items-center justify-between">
          <p className="text-xs text-amber-600 dark:text-amber-400">변경사항이 있습니다</p>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer"
          >
            저장
          </button>
        </div>
      )}
    </div>
  )
}
