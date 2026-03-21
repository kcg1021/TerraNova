import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { Select } from '@/shared/components/ui-kit'
import { useContainerSize } from '@/shared/hooks/useContainerSize'
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
  const { ref: chartRef, width: chartWidth, height: chartHeight } = useContainerSize()

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 md:p-5 min-h-[350px] md:min-h-0 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">메뉴이용현황</h3>
        <Select
          value={topN}
          onChange={v => setTopN(Number(v) as TopN)}
          size="xs"
          accentColor="emerald"
          options={[
            { value: 5, label: '상위 5개' },
            { value: 10, label: '상위 10개' },
            { value: 15, label: '상위 15개' },
          ]}
        />
      </div>

      <div ref={chartRef} className="flex-1 min-h-0">
        {chartWidth > 0 && (
          <BarChart
            data={data}
            width={chartWidth}
            height={Math.max(chartHeight, 180)}
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
        )}
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        {Array.from(new Set(data.map(m => m.systemName))).map(name => {
          const item = data.find(m => m.systemName === name)!
          return (
            <div key={name} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-slate-500 dark:text-slate-400">{name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
