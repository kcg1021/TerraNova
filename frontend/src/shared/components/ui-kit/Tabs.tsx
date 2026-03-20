export interface TabItem {
  id: string
  label: string
  count?: number
}

export interface TabsProps {
  items: TabItem[]
  activeId: string
  onChange: (id: string) => void
  accentColor?: 'emerald' | 'primary'
}

const accentClasses = {
  emerald: {
    active: 'text-emerald-600 dark:text-emerald-400 border-emerald-500',
    inactive: 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300',
  },
  primary: {
    active: 'text-[var(--color-primary)] border-[var(--color-primary)]',
    inactive: 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300',
  },
}

export default function Tabs({ items, activeId, onChange, accentColor = 'emerald' }: TabsProps) {
  const accent = accentClasses[accentColor]

  return (
    <div className="flex border-b border-slate-100 dark:border-slate-800 px-5 shrink-0">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
            activeId === item.id ? accent.active : accent.inactive
          }`}
        >
          {item.label}{item.count != null ? ` (${item.count})` : ''}
        </button>
      ))}
    </div>
  )
}
