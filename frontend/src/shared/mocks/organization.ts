export interface OrgUnit {
  id: string
  name: string
  parentId: string | null
}

export const mockOrganization: OrgUnit[] = [
  { id: 'city', name: '시청', parentId: null },
  { id: 'water-dept', name: '상수도과', parentId: 'city' },
  { id: 'water-pipe-team', name: '관로팀', parentId: 'water-dept' },
  { id: 'water-facility-team', name: '시설팀', parentId: 'water-dept' },
  { id: 'sewage-dept', name: '하수도과', parentId: 'city' },
  { id: 'sewage-pipe-team', name: '관거팀', parentId: 'sewage-dept' },
  { id: 'sewage-treatment-team', name: '처리팀', parentId: 'sewage-dept' },
  { id: 'road-dept', name: '도로과', parentId: 'city' },
  { id: 'road-mgmt-team', name: '도로관리팀', parentId: 'road-dept' },
  { id: 'road-safety-team', name: '안전관리팀', parentId: 'road-dept' },
  { id: 'facility-dept', name: '시설관리과', parentId: 'city' },
  { id: 'facility-mgmt-team', name: '시설관리팀', parentId: 'facility-dept' },
  { id: 'facility-inspect-team', name: '점검팀', parentId: 'facility-dept' },
  { id: 'it-dept', name: '정보화팀', parentId: 'city' },
  { id: 'planning-dept', name: '기획팀', parentId: 'city' },
]
