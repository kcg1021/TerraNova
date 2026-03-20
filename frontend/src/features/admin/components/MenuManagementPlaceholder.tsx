import { Icon } from '@/shared/components/ui-kit'
import { useSystemMenus } from '../api/queries'

interface Props {
  systemId: string
  menuId: string
}

export default function MenuManagementPlaceholder({ systemId, menuId }: Props) {
  const { data: systemMenus = [] } = useSystemMenus(systemId)
  const menu = systemMenus.find(m => m.id === menuId)

  if (!menu) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-slate-400 dark:text-slate-500">메뉴를 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm p-6 md:p-8">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <Icon name="wrench" className="w-8 h-8 text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{menu.name}</h3>
        {menu.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{menu.description}</p>
        )}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <Icon name="clock" className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <span className="text-sm text-slate-500 dark:text-slate-400">준비 중입니다</span>
        </div>
      </div>
    </div>
  )
}
