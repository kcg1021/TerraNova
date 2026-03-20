import { useState } from 'react'
import { useSystemRoles, useSystemMenus, useLayers, useTools, useSystemTools } from '../api/queries'
import type { SystemRole, PermissionLevel } from '../types/index'

const LEVEL_LABELS: Record<PermissionLevel, string> = {
  allow: '허용',
  deny: '거부',
  inherit: '상속',
}

const LEVEL_COLORS: Record<PermissionLevel, string> = {
  allow: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  deny: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  inherit: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
}

interface Props {
  systemId: string
}

export default function SystemRolePanel({ systemId }: Props) {
  const { data: roles = [] } = useSystemRoles(systemId)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const selectedRole = selectedRoleId ? roles.find(r => r.id === selectedRoleId) : null

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">역할 관리</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            시스템 권한 역할을 생성하고 각 역할의 세부 권한을 설정합니다 · {roles.length}개 역할
          </p>
        </div>
        <button
          onClick={() => { setShowCreateForm(true); setSelectedRoleId(null) }}
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer"
        >
          + 역할 추가
        </button>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* 좌측: 역할 목록 */}
        <div className="w-72 shrink-0 flex flex-col bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => { setSelectedRoleId(role.id); setShowCreateForm(false) }}
                className={`w-full px-4 py-3 text-left border-b border-gray-50 dark:border-gray-800/50 last:border-b-0 transition-colors cursor-pointer ${
                  selectedRoleId === role.id ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{role.name}</span>
                  {role.isDefault && (
                    <span className="px-1.5 py-0.5 text-xs rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">기본</span>
                  )}
                </div>
                {role.description && (
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{role.description}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 우측: 역할 상세 */}
        <div className="flex-1 min-w-0">
          {showCreateForm ? (
            <RoleCreateForm onClose={() => setShowCreateForm(false)} />
          ) : selectedRole ? (
            <RoleDetailPanel role={selectedRole} systemId={systemId} />
          ) : (
            <div className="h-full flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-xl">
              <p className="text-sm text-gray-400 dark:text-gray-500">좌측에서 역할을 선택하세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RoleCreateForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="h-full bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-xl overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">새 역할 생성</h4>
        <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-5 space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">역할 이름</label>
          <input type="text" placeholder="예: 편집자, 관리자" className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">설명</label>
          <input type="text" placeholder="이 역할의 용도를 설명하세요" className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all" />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">역할 생성 후 세부 권한을 설정할 수 있습니다.</p>
        <div className="flex gap-3 pt-2">
          <button className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer">역할 생성</button>
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">취소</button>
        </div>
      </div>
    </div>
  )
}

function RoleDetailPanel({ role, systemId }: { role: SystemRole; systemId: string }) {
  const { data: menus = [] } = useSystemMenus(systemId)
  const { data: layers = [] } = useLayers(systemId)
  const { data: allTools = [] } = useTools()
  const { data: systemTools = [] } = useSystemTools(systemId)
  const [tab, setTab] = useState<'menu' | 'layer' | 'tool'>('menu')
  const [editing, setEditing] = useState(false)

  const enabledTools = systemTools
    .filter(st => st.enabled)
    .map(st => allTools.find(t => t.id === st.toolId))
    .filter(Boolean)

  const tabs = [
    { id: 'menu' as const, label: '메뉴 권한', count: menus.length },
    { id: 'layer' as const, label: '레이어 권한', count: layers.length },
    { id: 'tool' as const, label: '도구 권한', count: enabledTools.length },
  ]

  const fieldClass = 'w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all'

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-xl overflow-hidden">
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {editing && !role.isDefault ? (
              <input type="text" defaultValue={role.name} className={`${fieldClass} max-w-48`} />
            ) : (
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{role.name}</h4>
            )}
            {role.isDefault && (
              <span className="px-1.5 py-0.5 text-xs rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">기본 역할</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!role.isDefault && (
              <>
                <button
                  onClick={() => setEditing(!editing)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    editing
                      ? 'text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30'
                      : 'text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {editing ? '완료' : '이름/설명 수정'}
                </button>
                <button className="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer">
                  삭제
                </button>
              </>
            )}
          </div>
        </div>
        {editing && !role.isDefault ? (
          <input type="text" defaultValue={role.description ?? ''} placeholder="역할 설명을 입력하세요" className={`${fieldClass} mt-2`} />
        ) : role.description ? (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{role.description}</p>
        ) : null}
        {role.isDefault && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">기본 역할은 이름, 설명을 변경하거나 삭제할 수 없습니다. 권한만 수정 가능합니다.</p>
        )}
      </div>

      {/* 탭 */}
      <div className="flex border-b border-gray-100 dark:border-gray-800 px-5 shrink-0">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
              tab === t.id
                ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500'
                : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* 권한 설정 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
        {tab === 'menu' && (
          <PermissionGrid
            items={menus.map(m => ({ id: m.id, name: m.name, description: m.description }))}
            permissions={role.permissions.menus}
            type="simple"
          />
        )}
        {tab === 'layer' && (
          <PermissionGrid
            items={layers.map(l => ({ id: l.id, name: l.name, description: `${l.type} 타입` }))}
            permissions={Object.fromEntries(
              Object.entries(role.permissions.layers).map(([id, actions]) => [id, actions.view])
            )}
            type="layer"
            layerPermissions={role.permissions.layers}
          />
        )}
        {tab === 'tool' && (
          <PermissionGrid
            items={enabledTools.filter(Boolean).map(t => ({ id: t!.id, name: t!.name, description: t!.description }))}
            permissions={role.permissions.tools}
            type="simple"
          />
        )}
      </div>

      {/* 저장 */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 shrink-0 flex justify-end">
        <button className="px-5 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer">
          권한 저장
        </button>
      </div>
    </div>
  )
}

function PermissionGrid({
  items,
  permissions,
  type,
  layerPermissions,
}: {
  items: { id: string; name: string; description?: string }[]
  permissions: Record<string, PermissionLevel>
  type: 'simple' | 'layer'
  layerPermissions?: Record<string, import('../types/index').LayerActionPermissions>
}) {
  return (
    <div className="space-y-1">
      {items.map(item => {
        const level = permissions[item.id] ?? 'inherit'
        return (
          <div key={item.id} className="flex flex-col">
            <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/30">
              <div>
                <div className="text-sm text-gray-900 dark:text-white">{item.name}</div>
                {item.description && (
                  <div className="text-xs text-gray-400 dark:text-gray-500">{item.description}</div>
                )}
              </div>
              <PermissionToggle value={level} />
            </div>

            {/* 레이어 상세 권한 */}
            {type === 'layer' && layerPermissions?.[item.id] && (
              <div className="ml-8 mb-2 flex items-center gap-3 text-xs">
                {(['view', 'edit', 'delete', 'export'] as const).map(action => {
                  const actionLevel = layerPermissions[item.id][action]
                  const actionLabel = action === 'view' ? '조회' : action === 'edit' ? '편집' : action === 'delete' ? '삭제' : '내보내기'
                  return (
                    <div key={action} className="flex items-center gap-1.5">
                      <span className="text-gray-400 dark:text-gray-500">{actionLabel}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs ${LEVEL_COLORS[actionLevel]}`}>
                        {LEVEL_LABELS[actionLevel]}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
      {items.length === 0 && (
        <p className="text-xs text-gray-400 dark:text-gray-500 py-4 text-center">항목이 없습니다</p>
      )}
    </div>
  )
}

function PermissionToggle({ value }: { value: PermissionLevel }) {
  const levels: PermissionLevel[] = ['inherit', 'allow', 'deny']
  return (
    <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {levels.map(level => (
        <button
          key={level}
          className={`px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
            value === level
              ? level === 'allow'
                ? 'bg-emerald-500 text-white'
                : level === 'deny'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          {LEVEL_LABELS[level]}
        </button>
      ))}
    </div>
  )
}
