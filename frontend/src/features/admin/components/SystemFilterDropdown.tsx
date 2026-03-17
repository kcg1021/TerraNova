import { useState, useRef, useEffect } from 'react'
import { SYSTEM_COLORS } from '../constants/systems'

const ALL_SYSTEMS = [
  { id: 'integrated', name: '통합관리' },
  { id: 'hr', name: '인사관리' },
  { id: 'budget', name: '예산회계' },
  { id: 'civil', name: '민원처리' },
  { id: 'approval', name: '전자결재' },
  { id: 'asset', name: '자산관리' },
  { id: 'monitor', name: '모니터링' },
]

const ALL_IDS = ALL_SYSTEMS.map(s => s.id)

interface Props {
  selectedSystems: string[]
  onChange: (ids: string[]) => void
}

export default function SystemFilterDropdown({ selectedSystems, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  const allSelected = selectedSystems.length === ALL_IDS.length
  const someSelected = selectedSystems.length > 0 && !allSelected

  const label = allSelected
    ? '전체'
    : selectedSystems.length === 1
      ? ALL_SYSTEMS.find(s => s.id === selectedSystems[0])?.name ?? '1개 시스템'
      : `${selectedSystems.length}개 시스템`

  function toggleAll() {
    onChange(allSelected ? [ALL_IDS[0]] : [...ALL_IDS])
  }

  function toggleSystem(id: string) {
    if (selectedSystems.includes(id)) {
      if (selectedSystems.length <= 1) return
      onChange(selectedSystems.filter(s => s !== id))
    } else {
      onChange([...selectedSystems, id])
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <span>{label}</span>
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-52 rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {/* 전체 선택 */}
          <label className="flex items-center gap-2.5 px-3 py-1.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
            <input
              type="checkbox"
              checked={allSelected}
              ref={el => { if (el) el.indeterminate = someSelected }}
              onChange={toggleAll}
              className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-200">전체</span>
          </label>

          <div className="mx-2 my-1 border-t border-gray-200 dark:border-gray-600" />

          {ALL_SYSTEMS.map(sys => (
            <label
              key={sys.id}
              className="flex items-center gap-2.5 px-3 py-1.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <input
                type="checkbox"
                checked={selectedSystems.includes(sys.id)}
                onChange={() => toggleSystem(sys.id)}
                className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-600"
              />
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: SYSTEM_COLORS[sys.id] ?? '#6b7280' }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-200">{sys.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
