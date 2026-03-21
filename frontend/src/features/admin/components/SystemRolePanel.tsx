import { useState } from 'react'
import { Icon, Button, Input, Badge, Tabs, SaveBar, EmptyState, PanelHeader, ListDetailLayout } from '@/shared/components/ui-kit'
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
  inherit: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
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
      <PanelHeader
        title="역할 관리"
        subtitle={`시스템 권한 역할을 생성하고 각 역할의 세부 권한을 설정합니다 · ${roles.length}개 역할`}
        action={
          <Button color="emerald" size="sm" onClick={() => { setShowCreateForm(true); setSelectedRoleId(null) }}>
            + 역할 추가
          </Button>
        }
      />

      <ListDetailLayout
        itemCount={roles.length}
        listItems={roles.map(role => (
          <button
            key={role.id}
            onClick={() => { setSelectedRoleId(role.id); setShowCreateForm(false) }}
            className={`w-full px-4 py-3 text-left border-b border-slate-50 dark:border-slate-800/50 last:border-b-0 transition-colors cursor-pointer ${
              selectedRoleId === role.id ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-900 dark:text-white">{role.name}</span>
              {role.isDefault && (
                <Badge color="emerald">기본</Badge>
              )}
            </div>
            {role.description && (
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{role.description}</div>
            )}
          </button>
        ))}
      >
        {showCreateForm ? (
          <RoleCreateForm onClose={() => setShowCreateForm(false)} />
        ) : selectedRole ? (
          <RoleDetailPanel role={selectedRole} systemId={systemId} />
        ) : (
          <EmptyState icon="user" message="좌측에서 역할을 선택하세요" />
        )}
      </ListDetailLayout>
    </div>
  )
}

function RoleCreateForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="h-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">새 역할 생성</h4>
        <Button variant="ghost" size="sm" onClick={onClose} className="!p-1">
          <Icon name="close" className="w-5 h-5" />
        </Button>
      </div>
      <div className="p-5 space-y-4 max-w-lg">
        <Input label="역할 이름" placeholder="예: 편집자, 관리자" variant="default" accentColor="emerald" />
        <Input label="설명" placeholder="이 역할의 용도를 설명하세요" variant="default" accentColor="emerald" />
        <p className="text-xs text-slate-400 dark:text-slate-500">역할 생성 후 세부 권한을 설정할 수 있습니다.</p>
        <div className="flex gap-3 pt-2">
          <Button color="emerald" size="sm">역할 생성</Button>
          <Button variant="secondary" size="sm" onClick={onClose}>취소</Button>
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

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden">
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {editing && !role.isDefault ? (
              <Input defaultValue={role.name} variant="default" accentColor="emerald" size="sm" className="max-w-48" />
            ) : (
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{role.name}</h4>
            )}
            {role.isDefault && (
              <Badge color="emerald">기본 역할</Badge>
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
                      : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
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
          <Input defaultValue={role.description ?? ''} placeholder="역할 설명을 입력하세요" variant="default" accentColor="emerald" size="sm" className="mt-2" />
        ) : role.description ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{role.description}</p>
        ) : null}
        {role.isDefault && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">기본 역할은 이름, 설명을 변경하거나 삭제할 수 없습니다. 권한만 수정 가능합니다.</p>
        )}
      </div>

      {/* 탭 */}
      <Tabs items={tabs} activeId={tab} onChange={id => setTab(id as typeof tab)} />

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

      <SaveBar isDirty onSave={() => {}} saveLabel="권한 저장" />
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
            <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/30">
              <div>
                <div className="text-sm text-slate-900 dark:text-white">{item.name}</div>
                {item.description && (
                  <div className="text-xs text-slate-400 dark:text-slate-500">{item.description}</div>
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
                      <span className="text-slate-400 dark:text-slate-500">{actionLabel}</span>
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
        <p className="text-xs text-slate-400 dark:text-slate-500 py-4 text-center">항목이 없습니다</p>
      )}
    </div>
  )
}

function PermissionToggle({ value }: { value: PermissionLevel }) {
  const levels: PermissionLevel[] = ['inherit', 'allow', 'deny']
  return (
    <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {levels.map(level => (
        <button
          key={level}
          className={`px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
            value === level
              ? level === 'allow'
                ? 'bg-emerald-500 text-white'
                : level === 'deny'
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          {LEVEL_LABELS[level]}
        </button>
      ))}
    </div>
  )
}
