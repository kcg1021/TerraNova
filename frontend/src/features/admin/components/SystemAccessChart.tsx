import { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { useDailyAccess, useSystemDailyAccess } from '../api/queries'
import { Select } from '@/shared/components/ui-kit'
import { useContainerSize } from '@/shared/hooks/useContainerSize'
import { SYSTEM_COLORS } from '../constants/systems'

type Period = 7 | 14 | 30

const SYSTEM_NAMES: Record<string, string> = {
  integrated: '통합관리',
  hr: '인사관리',
  budget: '예산회계',
  civil: '민원처리',
  approval: '전자결재',
  asset: '자산관리',
  monitor: '모니터링',
}

const ALL_IDS = Object.keys(SYSTEM_NAMES)

interface Props {
  systemIds?: string[]
}

export default function SystemAccessChart({ systemIds }: Props) {
  const { resolvedTheme } = useTheme()
  const [period, setPeriod] = useState<Period>(7)
  const [sumOnly, setSumOnly] = useState(false)
  const isDark = resolvedTheme === 'dark'
  const { data: dailyAccess = [] } = useDailyAccess()
  const { data: systemDailyAccess = {} } = useSystemDailyAccess()

  const ids = systemIds ?? ALL_IDS

  const { data, mode } = useMemo(() => {
    // 단일 시스템
    if (ids.length === 1) {
      const src = systemDailyAccess[ids[0]] ?? dailyAccess
      return { data: src.slice(-period), mode: 'single' as const }
    }
    // 복수 시스템 → 항상 멀티라인 + 합산
    const firstData = systemDailyAccess[ids[0]]
    if (!firstData) return { data: dailyAccess.slice(-period), mode: 'single' as const }

    const merged = firstData.map((_, i) => {
      const entry: Record<string, number | string> = { date: firstData[i].date }
      let sum = 0
      for (const sid of ids) {
        const val = systemDailyAccess[sid]?.[i]?.count ?? 0
        entry[sid] = val
        sum += val
      }
      entry.sum = sum
      return entry
    })
    return { data: merged.slice(-period), mode: 'multi' as const }
  }, [ids, period, dailyAccess, systemDailyAccess])

  const singleColor = ids.length === 1 && SYSTEM_COLORS[ids[0]]
    ? SYSTEM_COLORS[ids[0]]
    : '#10b981'

  const gridColor = isDark ? '#374151' : '#e5e7eb'
  const textColor = isDark ? '#9ca3af' : '#6b7280'
  const { ref: chartRef, width: chartWidth, height: chartHeight } = useContainerSize()

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 md:p-5 min-h-[350px] md:min-h-0 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">시스템 접속현황</h3>
        <div className="flex items-center gap-2">
          {mode === 'multi' && (
            <button
              type="button"
              onClick={() => setSumOnly(v => !v)}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                sumOnly
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              합산만
            </button>
          )}
          <Select
            value={period}
            onChange={v => setPeriod(Number(v) as Period)}
            size="xs"
            accentColor="emerald"
            options={[
              { value: 7, label: '7일' },
              { value: 14, label: '14일' },
              { value: 30, label: '30일' },
            ]}
          />
        </div>
      </div>

      <div ref={chartRef} className="flex-1 min-h-0">
        {chartWidth > 0 && (
          <LineChart data={data} width={chartWidth} height={Math.max(chartHeight, 180)} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
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
              formatter={(value: number | undefined, name: string | undefined) => [
                value ? `${value.toLocaleString()}명` : '-',
                name ?? '접속자',
              ]}
            />

            {mode === 'single' ? (
              <Line
                type="monotone"
                dataKey="count"
                name={SYSTEM_NAMES[ids[0]] ?? '접속자'}
                stroke={singleColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: singleColor, stroke: isDark ? '#1f2937' : '#ffffff', strokeWidth: 2 }}
              />
            ) : sumOnly ? (
              <Line
                type="monotone"
                dataKey="sum"
                name="합산"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#10b981', stroke: isDark ? '#1f2937' : '#ffffff', strokeWidth: 2 }}
              />
            ) : (
              <>
                {ids.map(sid => (
                  <Line
                    key={sid}
                    type="monotone"
                    dataKey={sid}
                    name={SYSTEM_NAMES[sid] ?? sid}
                    stroke={SYSTEM_COLORS[sid] ?? '#6b7280'}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: SYSTEM_COLORS[sid] ?? '#6b7280', stroke: isDark ? '#1f2937' : '#ffffff', strokeWidth: 2 }}
                  />
                ))}
                <Line
                  type="monotone"
                  dataKey="sum"
                  name="합산"
                  stroke="#9ca3af"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={{ r: 3, fill: '#9ca3af', stroke: isDark ? '#1f2937' : '#ffffff', strokeWidth: 2 }}
                />
              </>
            )}
          </LineChart>
        )}
      </div>

      {/* 범례 */}
      {mode === 'multi' && !sumOnly && (
        <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {ids.map(sid => (
            <div key={sid} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SYSTEM_COLORS[sid] ?? '#6b7280' }} />
              <span className="text-xs text-slate-500 dark:text-slate-400">{SYSTEM_NAMES[sid] ?? sid}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <span className="w-4 border-t-2 border-dashed border-slate-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400">합산</span>
          </div>
        </div>
      )}
    </div>
  )
}
