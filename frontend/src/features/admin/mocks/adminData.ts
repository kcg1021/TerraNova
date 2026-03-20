import type {
  AdminSystem,
  SystemAdminPermission,
  DailyAccessSummary,
  MenuUsageRankItem,
  AdminNotification,
  AdminMenu,
  Tool,
  SystemTool,
  Layer,
  SystemRole,
  UserRoleAssignment,
} from '../types/index'
import { SYSTEM_COLORS } from '../constants/systems'

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
export const mockSystemMenus: AdminMenu[] = [
  // 상수도
  { id: 'water-user-mgmt', systemId: 'water', name: '사용자 관리', description: '시스템 사용자 역할 관리' },
  { id: 'water-role-mgmt', systemId: 'water', name: '역할 관리', description: '시스템 권한 역할 관리' },

  // 하수도
  { id: 'sewage-user-mgmt', systemId: 'sewage', name: '사용자 관리', description: '시스템 사용자 역할 관리' },
  { id: 'sewage-role-mgmt', systemId: 'sewage', name: '역할 관리', description: '시스템 권한 역할 관리' },

  // 공간정보
  { id: 'gis-user-mgmt', systemId: 'gis', name: '사용자 관리', description: '시스템 사용자 역할 관리' },
  { id: 'gis-role-mgmt', systemId: 'gis', name: '역할 관리', description: '시스템 권한 역할 관리' },

  // 시설물
  { id: 'facility-user-mgmt', systemId: 'facility', name: '사용자 관리', description: '시스템 사용자 역할 관리' },
  { id: 'facility-role-mgmt', systemId: 'facility', name: '역할 관리', description: '시스템 권한 역할 관리' },

  // 도로관리
  { id: 'road-user-mgmt', systemId: 'road', name: '사용자 관리', description: '시스템 사용자 역할 관리' },
  { id: 'road-role-mgmt', systemId: 'road', name: '역할 관리', description: '시스템 권한 역할 관리' },

  // 모니터링
  { id: 'monitor-user-mgmt', systemId: 'monitor', name: '사용자 관리', description: '시스템 사용자 역할 관리' },
  { id: 'monitor-role-mgmt', systemId: 'monitor', name: '역할 관리', description: '시스템 권한 역할 관리' },

  // 통합관리
  { id: 'system-settings', systemId: 'integrated', name: '시스템 설정', description: '시스템 생성 및 구성 관리' },
  { id: 'tool-mgmt', systemId: 'integrated', name: '도구 관리', description: '공통 도구 풀 관리' },
  { id: 'user-mgmt', systemId: 'integrated', name: '사용자 관리', description: '전체 사용자 계정 관리' },
  { id: 'board-template-mgmt', systemId: 'integrated', name: '게시판 템플릿 관리', description: '게시판 유형 템플릿 생성 및 관리' },
  { id: 'board-mgmt', systemId: 'integrated', name: '게시판 관리', description: '템플릿 기반 게시판 생성·삭제·설정' },
  { id: 'audit-log', systemId: 'integrated', name: '감사 로그', description: '시스템 감사 로그 조회' },
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

// === 공통 도구 풀 ===
export const mockTools: Tool[] = [
  { id: 'measure-distance', name: '거리 측정', description: '두 점 사이의 거리를 측정합니다', category: 'measure' },
  { id: 'measure-area', name: '면적 측정', description: '다각형의 면적을 측정합니다', category: 'measure' },
  { id: 'measure-coordinates', name: '좌표 확인', description: '클릭한 지점의 좌표를 확인합니다', category: 'measure' },
  { id: 'search-address', name: '주소 검색', description: '주소로 위치를 검색합니다', category: 'search' },
  { id: 'search-parcel', name: '필지 검색', description: '지번으로 필지를 검색합니다', category: 'search' },
  { id: 'search-coordinates', name: '좌표 검색', description: '좌표로 위치를 이동합니다', category: 'search' },
  { id: 'analysis-buffer', name: '버퍼 분석', description: '지점/구간 주변 버퍼를 생성합니다', category: 'analysis' },
  { id: 'analysis-overlay', name: '중첩 분석', description: '레이어 간 중첩 분석을 수행합니다', category: 'analysis' },
  { id: 'analysis-route', name: '경로 분석', description: '최단 경로를 분석합니다', category: 'analysis' },
  { id: 'print-map', name: '지도 인쇄', description: '현재 지도를 인쇄합니다', category: 'print' },
  { id: 'print-report', name: '보고서 출력', description: '조회 결과를 보고서로 출력합니다', category: 'print' },
  { id: 'edit-feature', name: '객체 편집', description: '지도 객체를 편집합니다', category: 'edit' },
  { id: 'edit-attribute', name: '속성 편집', description: '객체 속성을 편집합니다', category: 'edit' },
  { id: 'bookmark', name: '즐겨찾기', description: '현재 위치를 즐겨찾기에 저장합니다', category: 'etc' },
  { id: 'screenshot', name: '화면 캡처', description: '현재 화면을 이미지로 저장합니다', category: 'etc' },
]

// === 시스템별 도구 설정 ===
export const mockSystemTools: SystemTool[] = [
  // 상수도
  { systemId: 'water', toolId: 'measure-distance', order: 1, enabled: true },
  { systemId: 'water', toolId: 'measure-area', order: 2, enabled: true },
  { systemId: 'water', toolId: 'search-address', order: 3, enabled: true },
  { systemId: 'water', toolId: 'analysis-buffer', order: 4, enabled: true },
  { systemId: 'water', toolId: 'print-map', order: 5, enabled: true },
  { systemId: 'water', toolId: 'edit-feature', order: 6, enabled: true },
  { systemId: 'water', toolId: 'edit-attribute', order: 7, enabled: true },
  // 하수도
  { systemId: 'sewage', toolId: 'measure-distance', order: 1, enabled: true },
  { systemId: 'sewage', toolId: 'search-address', order: 2, enabled: true },
  { systemId: 'sewage', toolId: 'analysis-buffer', order: 3, enabled: true },
  { systemId: 'sewage', toolId: 'analysis-route', order: 4, enabled: true },
  { systemId: 'sewage', toolId: 'print-map', order: 5, enabled: true },
  // 공간정보
  { systemId: 'gis', toolId: 'measure-distance', order: 1, enabled: true },
  { systemId: 'gis', toolId: 'measure-area', order: 2, enabled: true },
  { systemId: 'gis', toolId: 'measure-coordinates', order: 3, enabled: true },
  { systemId: 'gis', toolId: 'search-address', order: 4, enabled: true },
  { systemId: 'gis', toolId: 'search-parcel', order: 5, enabled: true },
  { systemId: 'gis', toolId: 'search-coordinates', order: 6, enabled: true },
  { systemId: 'gis', toolId: 'analysis-buffer', order: 7, enabled: true },
  { systemId: 'gis', toolId: 'analysis-overlay', order: 8, enabled: true },
  { systemId: 'gis', toolId: 'print-map', order: 9, enabled: true },
  { systemId: 'gis', toolId: 'print-report', order: 10, enabled: true },
  { systemId: 'gis', toolId: 'edit-feature', order: 11, enabled: true },
  { systemId: 'gis', toolId: 'edit-attribute', order: 12, enabled: true },
  { systemId: 'gis', toolId: 'bookmark', order: 13, enabled: true },
  { systemId: 'gis', toolId: 'screenshot', order: 14, enabled: true },
]

// === 레이어 ===
export const mockLayers: Layer[] = [
  // 상수도
  { id: 'water-pipe-layer', systemId: 'water', name: '상수관로', type: 'line', order: 1 },
  { id: 'water-valve-layer', systemId: 'water', name: '제수밸브', type: 'point', order: 2 },
  { id: 'water-hydrant-layer', systemId: 'water', name: '소화전', type: 'point', order: 3 },
  { id: 'water-meter-layer', systemId: 'water', name: '계량기', type: 'point', order: 4 },
  { id: 'water-facility-layer', systemId: 'water', name: '정수시설', type: 'polygon', order: 5 },
  { id: 'water-zone-layer', systemId: 'water', name: '급수구역', type: 'polygon', order: 6 },
  // 하수도
  { id: 'sewer-pipe-layer', systemId: 'sewage', name: '하수관거', type: 'line', order: 1 },
  { id: 'sewer-manhole-layer', systemId: 'sewage', name: '맨홀', type: 'point', order: 2 },
  { id: 'sewer-pump-layer', systemId: 'sewage', name: '펌프장', type: 'point', order: 3 },
  { id: 'sewer-treatment-layer', systemId: 'sewage', name: '처리장', type: 'polygon', order: 4 },
  { id: 'sewer-zone-layer', systemId: 'sewage', name: '배수구역', type: 'polygon', order: 5 },
  // 공간정보
  { id: 'gis-parcel-layer', systemId: 'gis', name: '지적도', type: 'polygon', order: 1 },
  { id: 'gis-building-layer', systemId: 'gis', name: '건물', type: 'polygon', order: 2 },
  { id: 'gis-road-layer', systemId: 'gis', name: '도로', type: 'line', order: 3 },
  { id: 'gis-contour-layer', systemId: 'gis', name: '등고선', type: 'line', order: 4 },
  { id: 'gis-satellite-layer', systemId: 'gis', name: '위성영상', type: 'raster', order: 5 },
]

// === 시스템 권한 역할 ===
export const mockSystemRoles: SystemRole[] = [
  // 상수도 역할
  {
    id: 'water-default',
    systemId: 'water',
    name: '기본 역할',
    description: '시스템 접근 시 자동 부여되는 기본 권한',
    isDefault: true,
    permissions: {
      menus: { 'water-pipe': 'allow', 'water-meter': 'allow' },
      layers: {
        'water-pipe-layer': { view: 'allow', edit: 'deny', delete: 'deny', export: 'inherit' },
        'water-valve-layer': { view: 'allow', edit: 'deny', delete: 'deny', export: 'inherit' },
      },
      tools: { 'measure-distance': 'allow', 'search-address': 'allow' },
    },
  },
  {
    id: 'water-viewer',
    systemId: 'water',
    name: '상수도 조회자',
    description: '상수도 데이터 조회만 가능',
    permissions: {
      menus: { 'water-pipe': 'allow', 'water-meter': 'allow', 'water-facility': 'allow', 'water-quality': 'allow', 'water-leak': 'allow' },
      layers: {
        'water-pipe-layer': { view: 'allow', edit: 'deny', delete: 'deny', export: 'allow' },
        'water-valve-layer': { view: 'allow', edit: 'deny', delete: 'deny', export: 'allow' },
        'water-hydrant-layer': { view: 'allow', edit: 'deny', delete: 'deny', export: 'inherit' },
        'water-meter-layer': { view: 'allow', edit: 'deny', delete: 'deny', export: 'inherit' },
        'water-facility-layer': { view: 'allow', edit: 'deny', delete: 'deny', export: 'inherit' },
        'water-zone-layer': { view: 'allow', edit: 'deny', delete: 'deny', export: 'inherit' },
      },
      tools: { 'measure-distance': 'allow', 'measure-area': 'allow', 'search-address': 'allow', 'print-map': 'allow', 'edit-feature': 'deny', 'edit-attribute': 'deny' },
    },
  },
  {
    id: 'water-editor',
    systemId: 'water',
    name: '상수도 편집자',
    description: '상수도 데이터 편집 가능',
    permissions: {
      menus: { 'water-pipe': 'allow', 'water-meter': 'allow', 'water-facility': 'allow', 'water-quality': 'allow', 'water-leak': 'allow' },
      layers: {
        'water-pipe-layer': { view: 'allow', edit: 'allow', delete: 'inherit', export: 'allow' },
        'water-valve-layer': { view: 'allow', edit: 'allow', delete: 'inherit', export: 'allow' },
        'water-hydrant-layer': { view: 'allow', edit: 'allow', delete: 'inherit', export: 'allow' },
        'water-meter-layer': { view: 'allow', edit: 'allow', delete: 'inherit', export: 'allow' },
        'water-facility-layer': { view: 'allow', edit: 'allow', delete: 'inherit', export: 'allow' },
        'water-zone-layer': { view: 'allow', edit: 'inherit', delete: 'deny', export: 'allow' },
      },
      tools: { 'measure-distance': 'allow', 'measure-area': 'allow', 'search-address': 'allow', 'analysis-buffer': 'allow', 'print-map': 'allow', 'edit-feature': 'allow', 'edit-attribute': 'allow' },
    },
  },
  // 하수도 역할
  {
    id: 'sewage-default',
    systemId: 'sewage',
    name: '기본 역할',
    description: '시스템 접근 시 자동 부여되는 기본 권한',
    isDefault: true,
    permissions: {
      menus: { 'sewer-pipe': 'allow', 'sewer-manhole': 'allow' },
      layers: {
        'sewer-pipe-layer': { view: 'allow', edit: 'deny', delete: 'deny', export: 'inherit' },
      },
      tools: { 'measure-distance': 'allow', 'search-address': 'allow' },
    },
  },
  {
    id: 'sewage-viewer',
    systemId: 'sewage',
    name: '하수도 조회자',
    description: '하수도 데이터 조회만 가능',
    permissions: {
      menus: { 'sewer-pipe': 'allow', 'sewer-manhole': 'allow', 'sewer-pump': 'allow', 'sewer-treatment': 'allow', 'sewer-cctv': 'allow' },
      layers: {
        'sewer-pipe-layer': { view: 'allow', edit: 'deny', delete: 'deny', export: 'allow' },
        'sewer-manhole-layer': { view: 'allow', edit: 'deny', delete: 'deny', export: 'allow' },
        'sewer-pump-layer': { view: 'allow', edit: 'deny', delete: 'deny', export: 'inherit' },
        'sewer-treatment-layer': { view: 'allow', edit: 'deny', delete: 'deny', export: 'inherit' },
        'sewer-zone-layer': { view: 'allow', edit: 'deny', delete: 'deny', export: 'inherit' },
      },
      tools: { 'measure-distance': 'allow', 'search-address': 'allow', 'print-map': 'allow' },
    },
  },
  // 공간정보 역할
  {
    id: 'gis-default',
    systemId: 'gis',
    name: '기본 역할',
    description: '시스템 접근 시 자동 부여되는 기본 권한',
    isDefault: true,
    permissions: {
      menus: { 'gis-map': 'allow' },
      layers: {
        'gis-parcel-layer': { view: 'allow', edit: 'deny', delete: 'deny', export: 'inherit' },
      },
      tools: { 'measure-distance': 'allow', 'search-address': 'allow' },
    },
  },
  {
    id: 'gis-admin',
    systemId: 'gis',
    name: 'GIS 관리자',
    description: '공간정보 전체 관리 권한',
    permissions: {
      menus: { 'gis-map': 'allow', 'gis-layer': 'allow', 'gis-data': 'allow', 'gis-analysis': 'allow', 'gis-print': 'allow' },
      layers: {
        'gis-parcel-layer': { view: 'allow', edit: 'allow', delete: 'allow', export: 'allow' },
        'gis-building-layer': { view: 'allow', edit: 'allow', delete: 'allow', export: 'allow' },
        'gis-road-layer': { view: 'allow', edit: 'allow', delete: 'allow', export: 'allow' },
        'gis-contour-layer': { view: 'allow', edit: 'allow', delete: 'allow', export: 'allow' },
        'gis-satellite-layer': { view: 'allow', edit: 'inherit', delete: 'deny', export: 'allow' },
      },
      tools: { 'measure-distance': 'allow', 'measure-area': 'allow', 'measure-coordinates': 'allow', 'search-address': 'allow', 'search-parcel': 'allow', 'search-coordinates': 'allow', 'analysis-buffer': 'allow', 'analysis-overlay': 'allow', 'print-map': 'allow', 'print-report': 'allow', 'edit-feature': 'allow', 'edit-attribute': 'allow', 'bookmark': 'allow', 'screenshot': 'allow' },
    },
  },
]

// === 사용자별 역할 배정 ===
export const mockUserRoleAssignments: UserRoleAssignment[] = [
  { userId: 'user', systemId: 'water', roleIds: ['water-viewer'] },
  { userId: 'user2', systemId: 'water', roleIds: ['water-viewer', 'water-editor'] },
  { userId: 'user3', systemId: 'sewage', roleIds: ['sewage-viewer'] },
  { userId: 'admin', systemId: 'water', roleIds: ['water-editor'] },
  { userId: 'admin', systemId: 'sewage', roleIds: ['sewage-viewer'] },
  { userId: 'admin', systemId: 'gis', roleIds: ['gis-admin'] },
]
