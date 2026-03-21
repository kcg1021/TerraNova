import { useState, useRef, useEffect } from 'react'
import { Icon, Button, Input, Tabs, SaveBar, EmptyState, PanelHeader, ListDetailLayout } from '@/shared/components/ui-kit'
import Toast from '@/shared/components/Toast'
import { useClickOutside } from '@/shared/hooks/useClickOutside'
import { useToast } from '@/shared/hooks/useToast'
import { useAdminSystems } from '../api/queries'
import type { AdminSystem } from '../types/index'

const PRESET_COLORS = [
  '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899',
  '#6b7280', '#14b8a6', '#ef4444', '#0ea5e9', '#84cc16',
  '#f97316', '#a855f7', '#06b6d4', '#d946ef', '#64748b',
]


export default function SystemSettingsPanel() {
  const { data: systems = [] } = useAdminSystems()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const selectedSystem = selectedId ? systems.find(s => s.id === selectedId) : null

  return (
    <div className="flex flex-col gap-4 h-full">
      <PanelHeader
        title="시스템 설정"
        subtitle={`시스템을 생성하고 메뉴, 레이어, 도구를 구성합니다 · ${systems.length}개`}
        action={
          <Button color="emerald" size="sm" onClick={() => { setShowAddForm(true); setSelectedId(null) }}>
            + 시스템 추가
          </Button>
        }
      />

      <ListDetailLayout
        itemCount={systems.length}
        emptyMessage="등록된 시스템이 없습니다"
        listItems={systems.map(sys => (
          <button
            key={sys.id}
            onClick={() => { setSelectedId(sys.id); setShowAddForm(false) }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-slate-50 dark:border-slate-800/50 last:border-b-0 transition-colors cursor-pointer ${
              selectedId === sys.id
                ? 'bg-emerald-50 dark:bg-emerald-950/20'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
            }`}
          >
            <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: sys.color }} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{sys.name}</div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">{sys.description}</div>
            </div>
          </button>
        ))}
      >
        {showAddForm ? (
          <SystemAddForm onClose={() => setShowAddForm(false)} />
        ) : selectedSystem ? (
          <SystemDetailForm system={selectedSystem} />
        ) : (
          <EmptyState icon="settings" message="좌측에서 시스템을 선택하세요" />
        )}
      </ListDetailLayout>
    </div>
  )
}

// ─── 색상 선택기 ─────────────────────────────────────────────

function ColorPicker({ value, onChange }: { value: string; onChange: (color: string) => void }) {
  const [hexInput, setHexInput] = useState(value)
  const [showPicker, setShowPicker] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHexInput(value)
  }, [value])

  useClickOutside(ref, () => setShowPicker(false))

  const isValidHex = /^#[0-9a-fA-F]{6}$/.test(hexInput)

  const handleHexChange = (val: string) => {
    let hex = val
    if (!hex.startsWith('#')) hex = '#' + hex
    setHexInput(hex)
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
      onChange(hex)
    }
  }

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-2">
        {/* 색상 미리보기 + 드롭다운 토글 */}
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className={`w-10 h-10 rounded-lg border-2 cursor-pointer transition-all shrink-0 ${
            showPicker ? 'border-emerald-500 dark:border-emerald-400 scale-105' : 'border-slate-200 dark:border-slate-700 hover:scale-105'
          }`}
          style={{ backgroundColor: isValidHex ? hexInput : value }}
          title="색상 선택"
        />
        {/* 색상코드 입력 */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={hexInput}
            onChange={e => handleHexChange(e.target.value)}
            placeholder="#000000"
            maxLength={7}
            className={`w-full px-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono uppercase ${!isValidHex && hexInput.length > 1 ? 'border-red-300 dark:border-red-700 focus:ring-red-500/30 focus:border-red-500' : ''}`}
          />
          {!isValidHex && hexInput.length > 1 && (
            <p className="absolute -bottom-4 left-0 text-xs text-red-500">올바른 색상코드를 입력하세요 (예: #3b82f6)</p>
          )}
        </div>
      </div>

      {/* 프리셋 팔레트 */}
      {showPicker && (
        <div className="absolute z-50 top-full left-0 mt-2 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/30">
          <div className="grid grid-cols-5 gap-2">
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => { onChange(color); setHexInput(color); setShowPicker(false) }}
                className={`w-8 h-8 rounded-lg cursor-pointer transition-all hover:scale-110 ${
                  value === color ? 'ring-2 ring-offset-2 ring-emerald-500 dark:ring-offset-slate-800' : ''
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="color"
                value={isValidHex ? hexInput : value}
                onChange={e => { onChange(e.target.value); setHexInput(e.target.value) }}
                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">커스텀 색상 선택</span>
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── 시스템 추가 폼 ──────────────────────────────────────────

function SystemAddForm({ onClose }: { onClose: () => void }) {
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [dirty, setDirty] = useState(false)

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">새 시스템 추가</h4>
        <Button variant="ghost" size="sm" onClick={onClose} className="!p-1">
          <Icon name="close" className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
        <div className="space-y-5 max-w-lg">
          <Input label="시스템명" placeholder="예: 상수도" variant="default" accentColor="emerald" onChange={() => setDirty(true)} />
          <Input label="설명" placeholder="예: 상수도 시설·관망 관리" variant="default" accentColor="emerald" onChange={() => setDirty(true)} />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">대표 색상</label>
            <ColorPicker value={color} onChange={c => { setColor(c); setDirty(true) }} />
          </div>
        </div>
      </div>

      {/* 하단 저장 */}
      <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 shrink-0 flex items-center justify-between">
        <p className="text-xs text-slate-400 dark:text-slate-500">{dirty ? '입력 내용을 확인하세요' : ''}</p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>취소</Button>
          <Button color="emerald" size="sm">시스템 생성</Button>
        </div>
      </div>
    </div>
  )
}

// ─── 시스템 상세 폼 ──────────────────────────────────────────

function SystemDetailForm({ system }: { system: AdminSystem }) {
  const [tab, setTab] = useState<'basic' | 'menu' | 'layer' | 'tool'>('basic')
  const [color, setColor] = useState(system.color)
  const [dirty, setDirty] = useState(false)
  const { toast, showToast, hideToast } = useToast()

  const tabs = [
    { id: 'basic' as const, label: '기본 정보' },
    { id: 'menu' as const, label: '메뉴 구성' },
    { id: 'layer' as const, label: '레이어 구성' },
    { id: 'tool' as const, label: '도구 설정' },
  ]

  const handleSave = () => {
    showToast('변경사항이 저장되었습니다')
    setDirty(false)
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden">
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{system.name}</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">{system.description}</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer">
            시스템 삭제
          </button>
        </div>
      </div>

      {/* 탭 */}
      <Tabs items={tabs} activeId={tab} onChange={id => setTab(id as typeof tab)} />

      {/* 탭 내용 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
        {tab === 'basic' && (
          <div className="space-y-5 max-w-lg">
            <Input label="시스템명" defaultValue={system.name} variant="default" accentColor="emerald" onChange={() => setDirty(true)} />
            <Input label="설명" defaultValue={system.description} variant="default" accentColor="emerald" onChange={() => setDirty(true)} />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">대표 색상</label>
              <ColorPicker value={color} onChange={c => { setColor(c); setDirty(true) }} />
            </div>
          </div>
        )}
        {tab === 'menu' && <TabPlaceholder title="메뉴 구성" description="시스템 메뉴를 추가, 수정, 삭제하고 순서를 변경합니다" />}
        {tab === 'layer' && <TabPlaceholder title="레이어 구성" description="시스템에서 사용할 레이어를 등록하고 관리합니다" />}
        {tab === 'tool' && <TabPlaceholder title="도구 설정" description="공통 도구 풀에서 도구를 선택하고 순서와 설정을 관리합니다" />}
      </div>

      {/* 하단 저장 */}
      <SaveBar isDirty={dirty} onSave={handleSave} />

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}

function TabPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
        <Icon name="clock" className="w-6 h-6 text-slate-300 dark:text-slate-600" />
      </div>
      <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{title}</h4>
      <p className="text-xs text-slate-400 dark:text-slate-500">{description}</p>
    </div>
  )
}
