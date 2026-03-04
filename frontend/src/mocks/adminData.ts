import type {
  AdminSystem,
  SystemAdminPermission,
  DailyAccessSummary,
  MenuUsageRankItem,
  AdminNotification,
  SystemMenu,
} from '../types/admin'

export const SYSTEM_COLORS: Record<string, string> = {
  water: '#3b82f6',      // blue-500 (상수도)
  sewage: '#10b981',     // emerald-500 (하수도)
  gis: '#8b5cf6',        // violet-500 (공간정보)
  facility: '#f59e0b',   // amber-500 (시설물)
  road: '#ec4899',       // pink-500 (도로관리)
  monitor: '#6b7280',    // gray-500 (모니터링)
  integrated: '#14b8a6', // teal-500 (통합관리)
}

export const mockAdminSystems: AdminSystem[] = [
  { id: 'water', name: '상수도', description: '상수도 시설·관망 관리', color: SYSTEM_COLORS.water },
  { id: 'sewage', name: '하수도', description: '하수도 시설·관거 관리', color: SYSTEM_COLORS.sewage },
  { id: 'gis', name: '공간정보', description: 'GIS 데이터·지도 관리', color: SYSTEM_COLORS.gis },
  { id: 'facility', name: '시설물', description: '공공시설물 현황·점검', color: SYSTEM_COLORS.facility },
  { id: 'road', name: '도로관리', description: '도로 시설·포장 관리', color: SYSTEM_COLORS.road },
  { id: 'monitor', name: '모니터링', description: '시스템 상태·로그 관리', color: SYSTEM_COLORS.monitor },
]

export const mockSystemAdminPermissions: SystemAdminPermission[] = [
  { userId: 'admin', systemIds: ['water', 'sewage', 'gis'] },
]

// 시스템별 30일간 일별 접속 데이터
function generateSystemDailyAccess(): Record<string, DailyAccessSummary[]> {
  const systemBases: Record<string, number> = {
    water: 280,
    sewage: 220,
    gis: 350,
    facility: 180,
    road: 150,
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
  // 상수도 관리
  { id: 'water-pipe', systemId: 'water', name: '관로 관리', description: '상수관로 현황 및 정보 관리' },
  { id: 'water-meter', systemId: 'water', name: '계량기 관리', description: '수도계량기 현황 관리' },
  { id: 'water-facility', systemId: 'water', name: '시설물 관리', description: '정수장, 배수지 등 시설 관리' },
  { id: 'water-quality', systemId: 'water', name: '수질 관리', description: '수질 검사 및 이력 관리' },
  { id: 'water-leak', systemId: 'water', name: '누수 관리', description: '누수 탐사 및 복구 이력' },

  // 하수도 관리
  { id: 'sewer-pipe', systemId: 'sewage', name: '관거 관리', description: '하수관거 현황 및 정보 관리' },
  { id: 'sewer-manhole', systemId: 'sewage', name: '맨홀 관리', description: '맨홀 현황 및 점검 관리' },
  { id: 'sewer-pump', systemId: 'sewage', name: '펌프장 관리', description: '하수펌프장 시설 관리' },
  { id: 'sewer-treatment', systemId: 'sewage', name: '처리장 관리', description: '하수처리장 운영 관리' },
  { id: 'sewer-cctv', systemId: 'sewage', name: 'CCTV 조사', description: '관거 CCTV 조사 이력' },

  // 공간정보 관리
  { id: 'gis-map', systemId: 'gis', name: '지도 관리', description: '배경지도 및 레이어 관리' },
  { id: 'gis-layer', systemId: 'gis', name: '레이어 설정', description: 'GIS 레이어 구성 관리' },
  { id: 'gis-data', systemId: 'gis', name: '데이터 관리', description: '공간 데이터 등록 및 편집' },
  { id: 'gis-analysis', systemId: 'gis', name: '공간 분석', description: '버퍼, 중첩 분석 등' },
  { id: 'gis-print', systemId: 'gis', name: '출력 관리', description: '지도 출력 템플릿 관리' },

  // 시설물 관리
  { id: 'facility-register', systemId: 'facility', name: '시설물 등록', description: '공공시설물 등록 관리' },
  { id: 'facility-inspect', systemId: 'facility', name: '점검 관리', description: '시설물 정기점검 관리' },
  { id: 'facility-repair', systemId: 'facility', name: '보수 이력', description: '시설물 보수 이력 관리' },
  { id: 'facility-safety', systemId: 'facility', name: '안전 진단', description: '시설물 안전진단 관리' },
  { id: 'facility-stats', systemId: 'facility', name: '현황 통계', description: '시설물 현황 통계 분석' },

  // 도로관리
  { id: 'road-pavement', systemId: 'road', name: '포장 관리', description: '도로 포장 현황 관리' },
  { id: 'road-sign', systemId: 'road', name: '표지판 관리', description: '도로표지판 현황 관리' },
  { id: 'road-light', systemId: 'road', name: '가로등 관리', description: '가로등 시설 관리' },
  { id: 'road-repair', systemId: 'road', name: '보수 관리', description: '도로 보수 이력 관리' },
  { id: 'road-pothole', systemId: 'road', name: '포트홀 관리', description: '포트홀 신고 및 처리' },

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
  { id: '1', type: 'permission_request', systemId: 'water', systemName: '상수도', count: 2, message: '상수도 시스템 권한신청 2건이 있습니다' },
  { id: '2', type: 'permission_request', systemId: 'sewage', systemName: '하수도', count: 1, message: '하수도 시스템 권한신청 1건이 있습니다' },
  { id: '3', type: 'permission_request', systemId: 'gis', systemName: '공간정보', count: 3, message: '공간정보 시스템 권한신청 3건이 있습니다' },
  { id: '4', type: 'permission_request', systemId: 'facility', systemName: '시설물', count: 1, message: '시설물 시스템 권한신청 1건이 있습니다' },
]
