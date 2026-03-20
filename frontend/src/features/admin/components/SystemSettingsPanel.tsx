import { useState } from 'react'
import { useAdminSystems } from '../api/queries'
import { SYSTEM_COLORS } from '../constants/systems'
import type { AdminSystem } from '../types/index'

const COLOR_OPTIONS = Object.entries(SYSTEM_COLORS).map(([key, value]) => ({
  id: key,
  color: value,
}))

export default function SystemSettingsPanel() {
  const { data: systems = [] } = useAdminSystems()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const selectedSystem = selectedId ? systems.find(s => s.id === selectedId) : null

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">시스템 설정</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">시스템을 생성하고 메뉴, 레이어, 도구를 구성합니다</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setSelectedId(null) }}
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer"
        >
          + 시스템 추가
        </button>
      </div>

      {/* 시스템 목록 테이블 */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">색상</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">시스템명</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden sm:table-cell">설명</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">관리</th>
            </tr>
          </thead>
          <tbody>
            {systems.map(sys => (
              <tr
                key={sys.id}
                className={`border-b border-gray-50 dark:border-gray-800/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${
                  selectedId === sys.id ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : ''
                }`}
              >
                <td className="px-4 py-3">
                  <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: sys.color }} />
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{sys.name}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden sm:table-cell">{sys.description}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => { setSelectedId(sys.id); setShowForm(true) }}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    설정
                  </button>
                </td>
              </tr>
            ))}
            {systems.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-gray-400 dark:text-gray-500">
                  등록된 시스템이 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 시스템 상세 설정 (선택 시) */}
      {showForm && (
        <SystemFormPanel
          system={selectedSystem ?? undefined}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

function SystemFormPanel({ system, onClose }: { system?: AdminSystem; onClose: () => void }) {
  const [tab, setTab] = useState<'basic' | 'menu' | 'layer' | 'tool'>('basic')
  const isNew = !system

  const tabs = [
    { id: 'basic' as const, label: '기본 정보' },
    { id: 'menu' as const, label: '메뉴 구성' },
    { id: 'layer' as const, label: '레이어 구성' },
    { id: 'tool' as const, label: '도구 설정' },
  ]

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-xl overflow-hidden">
      {/* 패널 헤더 */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          {system && (
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: system.color }} />
          )}
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            {isNew ? '새 시스템 추가' : `${system.name} 설정`}
          </h4>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 탭 */}
      {!isNew && (
        <div className="flex border-b border-gray-100 dark:border-gray-800 px-5">
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
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* 탭 내용 */}
      <div className="p-5">
        {(isNew || tab === 'basic') && (
          <BasicInfoTab system={system} isNew={isNew} />
        )}
        {!isNew && tab === 'menu' && (
          <TabPlaceholder title="메뉴 구성" description="시스템 메뉴를 추가, 수정, 삭제하고 순서를 변경합니다" />
        )}
        {!isNew && tab === 'layer' && (
          <TabPlaceholder title="레이어 구성" description="시스템에서 사용할 레이어를 등록하고 관리합니다" />
        )}
        {!isNew && tab === 'tool' && (
          <TabPlaceholder title="도구 설정" description="공통 도구 풀에서 도구를 선택하고 순서와 설정을 관리합니다" />
        )}
      </div>
    </div>
  )
}

function BasicInfoTab({ system, isNew }: { system?: AdminSystem; isNew: boolean }) {
  return (
    <div className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">시스템명</label>
        <input
          type="text"
          defaultValue={system?.name ?? ''}
          placeholder="예: 상수도"
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">설명</label>
        <input
          type="text"
          defaultValue={system?.description ?? ''}
          placeholder="예: 상수도 시설·관망 관리"
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">대표 색상</label>
        <div className="flex gap-2 flex-wrap">
          {COLOR_OPTIONS.map(opt => (
            <button
              key={opt.id}
              className={`w-8 h-8 rounded-lg border-2 cursor-pointer transition-all ${
                system?.color === opt.color
                  ? 'border-gray-900 dark:border-white scale-110'
                  : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: opt.color }}
              title={opt.id}
            />
          ))}
        </div>
      </div>
      <div className="pt-2">
        <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer">
          {isNew ? '시스템 생성' : '변경사항 저장'}
        </button>
      </div>
    </div>
  )
}

function TabPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
        <svg className="w-6 h-6 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
      <p className="text-xs text-gray-400 dark:text-gray-500">{description}</p>
    </div>
  )
}
