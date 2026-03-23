# 사용자 관리 기능 강화 설계

## 개요

TerraNova 관리자 페이지의 사용자 관리 기능을 강화한다. 가입 승인 워크플로우, 역할 권한 요청, 사용자 삭제(소프트 삭제), 비밀번호 초기화를 구현한다.

## 1. 사용자 상태 모델

### 상태 값

```
'pending' | 'active' | 'rejected' | 'deleted'
```

- `pending`: 가입 신청 후 승인 대기. 로그인 불가.
- `active`: 승인 완료, 로그인 가능.
- `rejected`: 가입 거절됨. 로그인 불가.
- `deleted`: 소프트 삭제. 데이터 보존, 로그인 불가.

### 상태 전이 다이어그램

```
[가입] → pending
  pending → active    (관리자 승인)
  pending → rejected  (관리자 거절)
  pending → deleted   (관리자 삭제 — 허용)
  active  → deleted   (관리자 삭제)
  rejected → active   (관리자 계정 복구)
  deleted  → active   (관리자 계정 복구)
```

- `rejected` → `active` 복구 시: 시스템 접근 권한 없이 기본 상태로 복구 (역할 재부여 필요)
- `deleted` → `active` 복구 시: 이전 시스템 접근 권한은 비활성화된 상태. 관리자가 재부여 필요.
- 동일 ID로 재가입은 불가 (가입 폼에서 모든 상태의 기존 ID를 중복 체크)

### MockAccount 확장

```typescript
interface MockAccount {
  id: string
  password: string
  name: string
  role: UserRole              // 글로벌 역할 (SUPER_ADMIN, SYSTEM_ADMIN, USER)
  orgId?: string
  email?: string
  phone?: string
  status: 'pending' | 'active' | 'rejected' | 'deleted'
  registeredAt: string        // ISO 날짜 문자열
  requirePasswordChange?: boolean
}
```

- 기존 사용자는 `status: 'active'`로 마이그레이션
- 글로벌 `role` 필드는 관리자 페이지 접근 권한을 결정 (SUPER_ADMIN, SYSTEM_ADMIN)
- 시스템별 세부 역할은 기존 `UserRoleAssignment`로 관리 (별개)
- `features/auth/mocks/accounts.ts` 파일은 제거하고 `shared/mocks/accounts.ts`로 통합

### User 타입 확장

```typescript
interface User {
  id: string
  name: string
  role: UserRole
  email?: string
  status: 'pending' | 'active' | 'rejected' | 'deleted'
  requirePasswordChange?: boolean
}
```

### LoginResult 인터페이스

```typescript
interface LoginResult {
  success: boolean
  error?: string
  blockedReason?: 'pending' | 'rejected' | 'deleted'
  requirePasswordChange?: boolean
}
```

## 2. 가입 승인/거절

### 권한

- SUPER_ADMIN: 모든 사용자 승인/거절 가능
- SYSTEM_ADMIN: 승인/거절 불가 (사용자 목록 조회만 가능)

### 가입 흐름

1. 사용자가 회원가입 완료 → `status: 'pending'`으로 저장
2. 가입 성공 화면에서 "관리자 승인 후 로그인이 가능합니다" 안내
3. 관리자가 UserManagementPanel에서 승인(`active`) 또는 거절(`rejected`)

### 로그인 차단

`pending`, `rejected`, `deleted` 상태 사용자가 로그인 시도 시:
- 인증 처리하지 않음 (로그인 실패)
- 상태에 따른 모달 표시:
  - `pending`: "가입 승인 대기 중입니다. 관리자 승인 후 로그인이 가능합니다."
  - `rejected`: "가입이 거절되었습니다. 관리자에게 문의해주세요."
  - `deleted`: "삭제된 계정입니다. 관리자에게 문의해주세요."

### 관리자 UI (UserManagementPanel)

- 사용자 목록 상단에 상태별 필터 탭: 전체 / 대기 중 / 활성 / 거절 / 삭제됨
- 각 사용자 항목에 상태 Badge 표시
  - pending: amber "대기 중"
  - active: emerald "활성"
  - rejected: red "거절"
  - deleted: slate "삭제됨" + 목록 항목 opacity 처리
- 대기 중 사용자 상세 패널: "승인" / "거절" 버튼
- 거절/삭제 사용자 상세 패널: "계정 복구" 버튼 (→ active, 시스템 권한 없이 복구)

## 3. 역할 권한 요청

### 요청 데이터 모델

```typescript
interface RoleRequest {
  id: string
  userId: string
  systemId: string
  roleIds: string[]
  status: 'pending' | 'approved' | 'rejected'
  reason?: string             // 사용자 요청 사유
  requestedAt: string
  processedAt?: string
  processedBy?: string        // 처리한 관리자 ID
  rejectionReason?: string    // 반려 사유
}
```

### 사용자 측 (메인 페이지)

- 메인 페이지(시스템 목록) 우상단에 "권한 신청" 버튼
- 클릭 시 모달:
  - 시스템 목록 표시 (접근 권한 있는 시스템은 "접근 중" 표시, 선택 불가)
  - 시스템 선택 → 해당 시스템의 역할 목록 체크박스
  - 요청 사유 텍스트 입력 (선택)
  - "신청" 버튼으로 요청 제출
- 이미 pending 요청 중인 시스템은 "신청 중" 표시, 중복 요청 방지
- `active` 상태 사용자만 요청 가능

### 관리자 측 (SystemUserPanel)

- 각 시스템 > 사용자 관리에서 대기 중인 권한 요청 표시
- 요청 목록을 기존 사용자 목록과 함께 표시 (요청 Badge)
- 요청 선택 시 상세 패널에서:
  - 요청자 정보, 요청한 역할 목록, 요청 사유
  - "승인" / "반려" 버튼 (반려 시 사유 입력)
- 처리 권한:
  - SUPER_ADMIN: 모든 시스템의 요청 처리 가능
  - SYSTEM_ADMIN: 자신이 관리하는 시스템의 요청만 처리 가능

## 4. 사용자 삭제 (소프트 삭제)

### 권한

SUPER_ADMIN만 가능. 모든 상태(pending, active, rejected)의 사용자를 삭제 가능.

### 동작

- UserManagementPanel 사용자 상세에 "사용자 삭제" 버튼
- 확인 모달: "정말 삭제하시겠습니까? 삭제된 사용자는 로그인할 수 없습니다."
- 삭제 시 `status: 'deleted'`로 변경 (DB ROW 유지)
- 시스템 접근 권한 자동 비활성화
- 목록에서 흐리게 표시 + "삭제됨" 배지
- "계정 복구" 버튼으로 `active` 복구 가능 (시스템 권한은 재부여 필요)

## 5. 비밀번호 초기화

### 경로 1: 사용자 셀프 서비스

- 로그인 페이지 > "비밀번호 찾기" 버튼
- 아이디 + 이메일 입력 → 본인 확인
- `active` 상태 사용자만 가능. 그 외 상태는 "해당 계정을 찾을 수 없습니다" 안내.
- 랜덤 임시 비밀번호 자동 생성
- 이메일로 임시 비밀번호 발송 (mock: Toast로 "임시 비밀번호: XXXX" 표시)
- `requirePasswordChange: true` 설정
- 화면에 "이메일로 임시 비밀번호를 발송했습니다" 안내

### 경로 2: 관리자 강제 초기화

- UserManagementPanel 사용자 상세에 "비밀번호 초기화" 버튼 (SUPER_ADMIN 전용)
- `active` 상태 사용자에 대해서만 표시
- 모달:
  - 비밀번호 방식 선택: "랜덤 생성" / "직접 입력"
  - 직접 입력 시 비밀번호 입력 필드 표시
  - "이메일로 발송" 체크박스 (기본 체크)
  - "초기화" 버튼
- 완료 시 설정된 비밀번호를 화면에 표시 (mock 환경 한정. 운영 환경에서는 이메일로만 전달)
- `requirePasswordChange: true` 설정

### 임시 비밀번호 로그인 후 강제 변경

- `requirePasswordChange: true`인 사용자가 로그인 성공 시
- 즉시 `/change-password` 페이지로 강제 리다이렉트
- 라우트 가드: `requirePasswordChange`가 true일 때 다른 모든 페이지 접근 시 `/change-password`로 리다이렉트
- 새 비밀번호 입력 + 확인 입력
- 비밀번호 규칙: 8자 이상 (가입 폼과 동일). 임시 비밀번호와 동일한 값 불가.
- 변경 완료 후 `requirePasswordChange: false` + 정상 로그인 상태로 전환

## 6. 영향 범위

### 수정 파일

| 파일 | 변경 내용 |
|------|----------|
| `frontend/src/shared/mocks/accounts.ts` | MockAccount에 status, registeredAt, requirePasswordChange, phone 추가 |
| `frontend/src/shared/types/auth.ts` | User 타입에 email, status, requirePasswordChange 추가. LoginResult 확장. |
| `frontend/src/shared/contexts/AuthContext.tsx` | 로그인 시 상태 검증, blockedReason 반환, requirePasswordChange 체크 |
| `frontend/src/features/auth/pages/SignupPage.tsx` | 가입 시 pending 상태로 생성, 완료 안내 변경 |
| `frontend/src/features/auth/components/LoginForm.tsx` | 상태별 모달 안내 추가, requirePasswordChange 리다이렉트 |
| `frontend/src/features/auth/components/FindPasswordModal.tsx` | 임시 비밀번호 생성 + 이메일 발송 로직으로 변경 |
| `frontend/src/features/admin/types/index.ts` | RoleRequest 타입 추가 |
| `frontend/src/features/admin/mocks/adminData.ts` | 권한 요청 mock 데이터, pending/rejected/deleted 사용자 mock 추가 |
| `frontend/src/features/admin/api/queries.ts` | 권한 요청 관련 쿼리 추가 |
| `frontend/src/features/admin/components/UserManagementPanel.tsx` | 상태 필터, 승인/거절, 삭제, 비밀번호 초기화, 계정 복구 UI |
| `frontend/src/features/admin/components/SystemUserPanel.tsx` | 권한 요청 목록 + 승인/반려 UI |
| `frontend/src/App.tsx` | `/change-password` 라우트 추가, 라우트 가드 |

### 신규 파일

| 파일 | 내용 |
|------|------|
| `frontend/src/features/auth/pages/ChangePasswordPage.tsx` | 임시 비밀번호 강제 변경 페이지 |
| `frontend/src/features/board/components/RoleRequestModal.tsx` | 메인 페이지 권한 신청 모달 |
| `frontend/src/features/admin/components/PasswordResetModal.tsx` | 관리자 비밀번호 초기화 모달 |
| `frontend/src/features/admin/components/UserDeleteModal.tsx` | 사용자 삭제 확인 모달 |

### 삭제 파일

| 파일 | 사유 |
|------|------|
| `frontend/src/features/auth/mocks/accounts.ts` | `shared/mocks/accounts.ts`로 통합 |

## 7. Mock 데이터

기존 사용자 외 테스트용 데이터 추가:

### 사용자

- pending 상태 2~3명 (가입 승인 대기 테스트)
- rejected 상태 1명 (거절 표시 테스트)
- deleted 상태 1명 (삭제됨 표시 + 복구 테스트)

### 역할 요청

- pending 상태 요청 2~3건 (서로 다른 시스템, 서로 다른 사용자)
- approved 1건, rejected 1건 (이력 표시용)
