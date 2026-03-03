import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTheme } from '../../contexts/ThemeContext'
import { mockDailyAccess, mockSystemDailyAccess, SYSTEM_COLORS } from '../../mocks/adminData'

type Period = 7 | 14 | 30

interface Props {
  systemId?: string
}

export default function SystemAccessChart({ systemId }: Props) {
  const { resolvedTheme } = useTheme()
  const [period, setPeriod] = useState<Period>(7)
  const isDark = resolvedTheme === 'dark'

  const sourceData = systemId && systemId !== 'integrated' && mockSystemDailyAccess[systemId]
    ? mockSystemDailyAccess[systemId]
    : mockDailyAccess
  const data = sourceData.slice(-period)

  const lineColor = systemId && systemId !== 'integrated' && SYSTEM_COLORS[systemId]
    ? SYSTEM_COLORS[systemId]
    : '#10b981'

  const gridColor = isDark ? '#374151' : '#e5e7eb'
  const textColor = isDark ? '#9ca3af' : '#6b7280'

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl shadow-sm p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">시스템 접속현황</h3>
        <select
          value={period}
          onChange={e => setPeriod(Number(e.target.value) as Period)}
          className="text-xs px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value={7}>7일</option>
          <option value={14}>14일</option>
          <option value={30}>30일</option>
        </select>
      </div>

      <div className="h-44 md:h-56 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%" debounce={400}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: textColor }}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: textColor }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: isDark ? '#f3f4f6' : '#111827' }}
              itemStyle={{ color: isDark ? '#d1d5db' : '#374151' }}
              labelFormatter={(label) => `${label}`}
              formatter={(value: number | undefined) => [
                value ? `${value.toLocaleString()}명` : '-',
                '접속자'
              ]}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: lineColor, stroke: isDark ? '#1f2937' : '#ffffff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
