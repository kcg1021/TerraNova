import type { Board, BoardPost, SystemMenu } from '../types/board'

export const mockBoards: Board[] = [
  { id: 'notice', name: '공지사항', type: 'notice' },
  { id: 'free', name: '자유게시판', type: 'board' },
  { id: 'qna', name: 'Q&A', type: 'board' },
]

export const mockPosts: BoardPost[] = [
  // 공지사항
  { id: 1, boardId: 'notice', title: '시스템 정기점검 안내 (2/15 02:00~06:00)', author: '관리자', createdAt: '2026-02-07', views: 342, isNew: true, isPublic: true, content: '안녕하세요.\n\n시스템 안정화를 위한 정기점검이 아래와 같이 진행됩니다.\n\n■ 일시: 2026년 2월 15일(토) 02:00 ~ 06:00 (4시간)\n■ 대상: 전체 시스템\n■ 내용: 서버 보안 패치 및 DB 최적화\n\n점검 시간 동안 시스템 이용이 불가합니다.\n불편을 드려 죄송합니다.' },
  { id: 2, boardId: 'notice', title: '개인정보처리방침 변경 안내', author: '관리자', createdAt: '2026-02-05', views: 218, isPublic: true, content: '개인정보보호법 개정에 따라 개인정보처리방침이 2026년 3월 1일부터 변경됩니다.\n\n주요 변경사항:\n1. 개인정보 보유기간 조정\n2. 제3자 제공 동의 절차 강화\n3. 개인정보 파기 절차 명확화\n\n자세한 내용은 첨부파일을 참조하시기 바랍니다.' },
  { id: 3, boardId: 'notice', title: '2026년 1분기 업데이트 예정 사항', author: '관리자', createdAt: '2026-02-01', views: 567, content: '2026년 1분기 시스템 업데이트 예정 사항을 안내드립니다.\n\n1. 대시보드 UI 개편 (2월)\n2. 모바일 반응형 개선 (2월)\n3. 전자결재 워크플로우 기능 추가 (3월)\n4. 통계 리포트 자동 생성 기능 (3월)\n\n각 기능은 순차적으로 배포될 예정입니다.' },
  { id: 4, boardId: 'notice', title: '신규 기능 안내: 대시보드 개편', author: '관리자', createdAt: '2026-01-28', views: 431, content: '대시보드가 새롭게 개편되었습니다.\n\n■ 주요 변경사항\n- 위젯 기반 커스터마이징 지원\n- 실시간 데이터 갱신\n- 차트 종류 확대 (막대, 원형, 꺾은선, 트리맵)\n\n사용 방법은 도움말을 참고해 주세요.' },
  { id: 5, boardId: 'notice', title: '서비스 이용약관 변경 안내', author: '관리자', createdAt: '2026-01-20', views: 189, isPublic: true, content: '서비스 이용약관이 2026년 2월 1일부터 변경됩니다.\n\n주요 변경사항:\n1. 서비스 이용 범위 명확화\n2. 이용자 의무사항 추가\n3. 분쟁 해결 절차 개선\n\n변경된 약관에 동의하지 않으시는 경우 서비스 이용이 제한될 수 있습니다.' },
  { id: 16, boardId: 'notice', title: '2025년 하반기 정보보안 교육 이수 안내', author: '관리자', createdAt: '2026-01-15', views: 305, content: '2025년 하반기 정보보안 교육 미이수자를 대상으로 보충 교육을 실시합니다.\n\n■ 대상: 미이수 직원\n■ 기간: 2026.01.20 ~ 2026.01.31\n■ 방법: 온라인 교육 (e-learning)\n\n기한 내 미이수 시 인사 불이익이 있을 수 있습니다.' },
  { id: 17, boardId: 'notice', title: '구 시스템 데이터 이관 완료 안내', author: '관리자', createdAt: '2026-01-10', views: 274, isPublic: true, content: '구 시스템에서 신규 시스템으로의 데이터 이관이 완료되었습니다.\n\n이관 데이터:\n- 인사 기본정보\n- 결재 이력 (최근 3년)\n- 게시판 데이터\n\n데이터 누락이나 오류가 있을 경우 관리자에게 문의해 주세요.' },
  { id: 18, boardId: 'notice', title: '비밀번호 변경 주기 안내 (90일)', author: '관리자', createdAt: '2026-01-05', views: 412, isPublic: true, content: '정보보안 정책에 따라 비밀번호는 90일마다 변경해야 합니다.\n\n■ 비밀번호 규칙\n- 8자 이상, 영문 대/소문자 + 숫자 + 특수문자 조합\n- 이전 3회 사용한 비밀번호 재사용 불가\n- 연속된 문자/숫자 3자 이상 사용 불가\n\n변경 기한이 지나면 로그인 시 강제 변경 화면이 표시됩니다.' },

  // 자유게시판
  { id: 6, boardId: 'free', title: '새로운 보고서 양식 공유합니다', author: '김철수', createdAt: '2026-02-07', views: 45, isNew: true, hasAttachment: true, content: '안녕하세요.\n\n이번에 새로 개정된 보고서 양식을 공유드립니다.\n기존 양식 대비 주요 변경사항은 다음과 같습니다.\n\n1. 요약 섹션 추가\n2. 첨부파일 목록 양식 변경\n3. 승인 라인 표기 방식 변경\n\n첨부파일을 확인해 주세요.' },
  { id: 7, boardId: 'free', title: '이번 주 회의 일정 변경 건', author: '이영희', createdAt: '2026-02-06', views: 78, content: '이번 주 정기 회의 일정이 변경되었습니다.\n\n변경 전: 2/7(금) 14:00\n변경 후: 2/7(금) 16:00\n\n장소는 동일하게 3층 대회의실입니다.\n참석 부탁드립니다.' },
  { id: 8, boardId: 'free', title: '프로젝트 진행 현황 공유', author: '박민수', createdAt: '2026-02-05', views: 123, hasAttachment: true, content: 'TerraNova 프로젝트 진행 현황을 공유드립니다.\n\n■ 프론트엔드: 80% 완료\n■ 백엔드: 60% 완료\n■ DB 설계: 완료\n■ 테스트: 진행 중\n\n상세 일정은 첨부 문서를 참고해 주세요.' },
  { id: 9, boardId: 'free', title: '신입사원 환영합니다!', author: '정하나', createdAt: '2026-02-03', views: 234, content: '2월 신입사원 여러분 환영합니다!\n\n이번 달 입사자:\n- 개발팀 2명\n- 기획팀 1명\n\n적응하시는 데 어려움이 있으시면 언제든 말씀해 주세요.' },
  { id: 10, boardId: 'free', title: '사내 동호회 모집 안내', author: '김철수', createdAt: '2026-02-01', views: 167, content: '2026년 상반기 사내 동호회 회원을 모집합니다.\n\n■ 모집 동호회\n1. 축구 동호회 (매주 토요일)\n2. 독서 동호회 (격주 수요일)\n3. 등산 동호회 (월 1회)\n\n참여를 희망하시는 분은 2/15까지 신청해 주세요.' },

  // Q&A
  { id: 11, boardId: 'qna', title: '시스템 접속 오류 해결 방법 문의', author: '최지원', createdAt: '2026-02-07', views: 34, isNew: true, content: '시스템 접속 시 "세션이 만료되었습니다" 오류가 반복적으로 발생합니다.\n\n브라우저 캐시 삭제 후에도 동일한 현상이 발생하는데 해결 방법이 있을까요?\n\n환경: Chrome 121, Windows 11' },
  { id: 12, boardId: 'qna', title: '보고서 출력 시 레이아웃이 깨지는 현상', author: '한서연', createdAt: '2026-02-06', views: 56, content: '월간 보고서 출력 시 표가 페이지를 넘어가면서 레이아웃이 깨집니다.\n\nPDF 다운로드는 정상이지만 인쇄 미리보기에서 문제가 발생합니다.\n확인 부탁드립니다.' },
  { id: 13, boardId: 'qna', title: '권한 변경 요청은 어디서 하나요?', author: '오준호', createdAt: '2026-02-04', views: 89, content: '부서 이동으로 인해 시스템 접근 권한 변경이 필요합니다.\n\n기존: 인사팀 (일반 사용자)\n변경: 기획팀 (시스템 관리자)\n\n권한 변경 신청은 어디서 할 수 있나요?' },
  { id: 14, boardId: 'qna', title: '파일 업로드 용량 제한이 있나요?', author: '최지원', createdAt: '2026-02-02', views: 45, content: '게시판에 파일 업로드 시 용량 제한이 있나요?\n\n50MB 정도의 파일을 올리려고 하는데 업로드가 안 됩니다.' },
  { id: 15, boardId: 'qna', title: 'API 연동 관련 문의', author: '한서연', createdAt: '2026-01-30', views: 112, content: '외부 시스템과 API 연동을 위한 문서가 있을까요?\n\nREST API 엔드포인트 목록과 인증 방식에 대한 가이드가 필요합니다.' },
]

// 납품 후 관리자가 생성하는 시스템 목록 (Mock)
export const mockSystems: SystemMenu[] = [
  {
    id: 'sys-001',
    name: '인사관리 시스템',
    description: '인사 정보 및 조직 관리',
    url: '/system/sys-001',
    requiredRoles: ['USER', 'SYSTEM_ADMIN', 'SUPER_ADMIN'],
  },
  {
    id: 'sys-002',
    name: '예산회계 시스템',
    description: '예산 편성 및 집행 관리',
    url: '/system/sys-002',
    requiredRoles: ['USER', 'SYSTEM_ADMIN', 'SUPER_ADMIN'],
  },
  {
    id: 'sys-003',
    name: '민원처리 시스템',
    description: '민원 접수 및 처리 현황',
    url: '/system/sys-003',
    requiredRoles: ['USER', 'SYSTEM_ADMIN', 'SUPER_ADMIN'],
  },
  {
    id: 'sys-004',
    name: '전자결재 시스템',
    description: '기안 작성 및 결재 처리',
    url: '/system/sys-004',
    requiredRoles: ['USER', 'SYSTEM_ADMIN', 'SUPER_ADMIN'],
  },
  {
    id: 'sys-005',
    name: '자산관리 시스템',
    description: '공공 자산 및 물품 관리',
    url: '/system/sys-005',
    requiredRoles: ['SYSTEM_ADMIN', 'SUPER_ADMIN'],
  },
  {
    id: 'sys-006',
    name: '시스템 모니터링',
    description: '서버 상태 및 로그 관리',
    url: '/system/sys-006',
    requiredRoles: ['SUPER_ADMIN'],
  },
]
