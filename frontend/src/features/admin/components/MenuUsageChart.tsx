import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { useMenuUsage } from '../api/queries'

type TopN = 5 | 10 | 15

const ALL_COUNT = 7

interface Props {
  systemIds?: string[]
}

export default function MenuUsageChart({ systemIds }: Props) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [topN, setTopN] = useState<TopN>(5)
  const { data: menuUsage = [] } = useMenuUsage()

  const allData = systemIds && systemIds.length < ALL_COUNT
    ? menuUsage.filter(m => systemIds.includes(m.systemId))
    : menuUsage
  const data = allData.slice(0, topN)

  const gridColor = isDark ? '#374151' : '#e5e7eb'
  const textColor = isDark ? '#9ca3af' : '#6b7280'

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl shadow-sm p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">메뉴이용현황</h3>
        <select
          value={topN}
          onChange={e => setTopN(Number(e.target.value) as TopN)}
          className="text-xs px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value={5}>상위 5개</option>
          <option value={10}>상위 10개</option>
          <option value={15}>상위 15개</option>
        </select>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%" debounce={400}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: textColor }}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
            />
            <YAxis
              type="category"
              dataKey="menuName"
              width={100}
              tick={{ fontSize: 11, fill: textColor }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: isDark ? '#f3f4f6' : '#111827' }}
              itemStyle={{ color: isDark ? '#d1d5db' : '#374151' }}
              formatter={(value: number | undefined, name: string | undefined, props: any) => [
                value ? `${value.toLocaleString()}회` : '-',
                props?.payload?.systemName || name,
              ]}
              labelFormatter={(label) => `${label}`}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={18}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        {Array.from(new Set(data.map(m => m.systemName))).map(name => {
          const item = data.find(m => m.systemName === name)!
          return (
            <div key={name} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-gray-500 dark:text-gray-400">{name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
