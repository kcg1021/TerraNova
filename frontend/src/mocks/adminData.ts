import type {
  AdminSystem,
  SystemAdminPermission,
  DailyAccessSummary,
  MenuUsageRankItem,
  AdminNotification,
  SystemMenu,
} from '../types/admin'

export const SYSTEM_COLORS: Record<string, string> = {
  hr: '#10b981',       // emerald-500
  budget: '#3b82f6',   // blue-500
  civil: '#f59e0b',    // amber-500
  approval: '#8b5cf6', // violet-500
  asset: '#ec4899',    // pink-500
  monitor: '#6b7280',  // gray-500
  integrated: '#14b8a6', // teal-500
}

export const mockAdminSystems: AdminSystem[] = [
  { id: 'hr', name: '인사관리', description: '인사·급여·근태 관리', color: SYSTEM_COLORS.hr },
  { id: 'budget', name: '예산회계', description: '예산 편성·집행·결산', color: SYSTEM_COLORS.budget },
  { id: 'civil', name: '민원처리', description: '민원 접수·처리·통계', color: SYSTEM_COLORS.civil },
  { id: 'approval', name: '전자결재', description: '기안·결재·문서관리', color: SYSTEM_COLORS.approval },
  { id: 'asset', name: '자산관리', description: '자산 등록·이력·폐기', color: SYSTEM_COLORS.asset },
  { id: 'monitor', name: '모니터링', description: '시스템 상태·로그 관리', color: SYSTEM_COLORS.monitor },
]

export const mockSystemAdminPermissions: SystemAdminPermission[] = [
  { userId: 'admin', systemIds: ['hr', 'budget', 'approval'] },
]

// 시스템별 30일간 일별 접속 데이터
function generateSystemDailyAccess(): Record<string, DailyAccessSummary[]> {
  const systemBases: Record<string, number> = {
    hr: 250,
    budget: 180,
    civil: 220,
    approval: 300,
    asset: 120,
    monitor: 80,
    integrated: 60,
  }
  const result: Record<string, DailyAccessSummary[]> = {}
  const now = new Date()

  for (const [systemId, base] of Object.entries(systemBases)) {
    const data: DailyAccessSummary[] = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const isWeekend = d.getDay() === 0 || d.getDay() === 6
      const dayBase = isWeekend ? Math.floor(base * 0.35) : base
      const variance = Math.floor(Math.random() * (base * 0.4)) - Math.floor(base * 0.2)
      data.push({
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        count: Math.max(10, dayBase + variance),
      })
    }
    result[systemId] = data
  }
  return result
}

export const mockSystemDailyAccess: Record<string, DailyAccessSummary[]> = generateSystemDailyAccess()

// 전체 접속 합계 = 모든 시스템의 날짜별 합산
const systemIds = Object.keys(mockSystemDailyAccess)
export const mockDailyAccess: DailyAccessSummary[] = mockSystemDailyAccess[systemIds[0]].map((_, i) => ({
  date: mockSystemDailyAccess[systemIds[0]][i].date,
  count: Object.values(mockSystemDailyAccess).reduce((sum, data) => sum + data[i].count, 0),
}))

// 시스템별 관리 메뉴
export const mockSystemMenus: SystemMenu[] = [
  // 인사관리
  { id: 'employee', systemId: 'hr', name: '직원 관리', description: '직원 정보 등록 및 관리' },
  { id: 'attendance', systemId: 'hr', name: '근태 관리', description: '출퇴근 및 근무시간 관리' },
  { id: 'salary', systemId: 'hr', name: '급여 관리', description: '급여 계산 및 명세서 관리' },
  { id: 'appointment', systemId: 'hr', name: '인사 발령', description: '인사이동 및 발령 관리' },
  { id: 'leave', systemId: 'hr', name: '휴가 관리', description: '연차 및 휴가 신청 관리' },

  // 예산회계
  { id: 'planning', systemId: 'budget', name: '예산 편성', description: '연간 예산 편성 및 조정' },
  { id: 'execution', systemId: 'budget', name: '예산 집행', description: '예산 집행 현황 관리' },
  { id: 'settlement', systemId: 'budget', name: '결산 관리', description: '회계 결산 처리' },
  { id: 'revenue', systemId: 'budget', name: '세입 관리', description: '세입 현황 관리' },
  { id: 'expenditure', systemId: 'budget', name: '세출 관리', description: '세출 현황 관리' },

  // 민원처리
  { id: 'reception', systemId: 'civil', name: '민원 접수', description: '민원 접수 및 등록' },
  { id: 'processing', systemId: 'civil', name: '민원 처리', description: '민원 처리 현황 관리' },
  { id: 'civil-stats', systemId: 'civil', name: '민원 통계', description: '민원 처리 통계 분석' },
  { id: 'civil-type', systemId: 'civil', name: '민원 유형 관리', description: '민원 유형 분류 관리' },
  { id: 'template', systemId: 'civil', name: '답변 템플릿', description: '민원 답변 템플릿 관리' },

  // 전자결재
  { id: 'approval-line', systemId: 'approval', name: '결재선 관리', description: '결재선 설정 및 관리' },
  { id: 'doc-form', systemId: 'approval', name: '문서 양식', description: '결재 문서 양식 관리' },
  { id: 'delegation', systemId: 'approval', name: '위임 설정', description: '결재 위임 설정' },
  { id: 'approval-history', systemId: 'approval', name: '결재 이력', description: '결재 처리 이력 조회' },
  { id: 'doc-box', systemId: 'approval', name: '문서함 관리', description: '문서함 분류 및 관리' },

  // 자산관리
  { id: 'asset-register', systemId: 'asset', name: '자산 등록', description: '자산 등록 및 정보 관리' },
  { id: 'asset-history', systemId: 'asset', name: '자산 이력', description: '자산 변동 이력 관리' },
  { id: 'depreciation', systemId: 'asset', name: '감가상각', description: '감가상각 계산 및 관리' },
  { id: 'asset-inspect', systemId: 'asset', name: '자산 점검', description: '자산 실사 점검' },
  { id: 'disposal', systemId: 'asset', name: '폐기 관리', description: '자산 폐기 처리' },

  // 모니터링
  { id: 'server-status', systemId: 'monitor', name: '서버 상태', description: '서버 상태 모니터링' },
  { id: 'system-log', systemId: 'monitor', name: '시스템 로그', description: '시스템 로그 조회' },
  { id: 'access-stats', systemId: 'monitor', name: '접속 통계', description: '시스템 접속 통계' },
  { id: 'alert-settings', systemId: 'monitor', name: '알림 설정', description: '모니터링 알림 설정' },
  { id: 'backup', systemId: 'monitor', name: '백업 관리', description: '시스템 백업 관리' },

  // 통합관리
  { id: 'user-mgmt', systemId: 'integrated', name: '사용자 관리', description: '전체 사용자 계정 관리' },
  { id: 'permission-mgmt', systemId: 'integrated', name: '권한 관리', description: '시스템 접근 권한 관리' },
  { id: 'system-settings', systemId: 'integrated', name: '시스템 설정', description: '전체 시스템 환경 설정' },
  { id: 'audit-log', systemId: 'integrated', name: '감사 로그', description: '시스템 감사 로그 조회' },
  { id: 'notice-mgmt', systemId: 'integrated', name: '공지사항 관리', description: '공지사항 등록 및 관리' },
]

// mockSystemMenus 기반 메뉴이용현황 자동 생성
function generateMenuUsage(): MenuUsageRankItem[] {
  const items: MenuUsageRankItem[] = []
  for (const menu of mockSystemMenus) {
    const sys = menu.systemId === 'integrated'
      ? { id: 'integrated', name: '통합관리' }
      : mockAdminSystems.find(s => s.id === menu.systemId)
    if (!sys) continue
    const count = menu.systemId === 'integrated'
      ? Math.floor(Math.random() * 300) + 50
      : Math.floor(Math.random() * 1800) + 200
    items.push({
      menuName: menu.name,
      systemId: menu.systemId,
      systemName: sys.name,
      count,
      color: SYSTEM_COLORS[menu.systemId] || '#6b7280',
    })
  }
  return items.sort((a, b) => b.count - a.count)
}

export const mockMenuUsage: MenuUsageRankItem[] = generateMenuUsage()

export const mockAdminNotifications: AdminNotification[] = [
  { id: '1', type: 'permission_request', systemId: 'hr', systemName: '인사관리', count: 2, message: '인사관리 시스템 권한신청 2건이 있습니다' },
  { id: '2', type: 'permission_request', systemId: 'budget', systemName: '예산회계', count: 1, message: '예산회계 시스템 권한신청 1건이 있습니다' },
  { id: '3', type: 'permission_request', systemId: 'approval', systemName: '전자결재', count: 3, message: '전자결재 시스템 권한신청 3건이 있습니다' },
  { id: '4', type: 'permission_request', systemId: 'civil', systemName: '민원처리', count: 1, message: '민원처리 시스템 권한신청 1건이 있습니다' },
]
