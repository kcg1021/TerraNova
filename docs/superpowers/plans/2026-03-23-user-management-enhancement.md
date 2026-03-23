# 사용자 관리 기능 강화 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 가입 승인/거절, 역할 권한 요청, 소프트 삭제, 비밀번호 초기화 기능을 구현한다.

**Architecture:** MockAccount 타입을 status/registeredAt/requirePasswordChange로 확장하고, AuthContext 로그인 로직에 상태 검증을 추가한다. 관리자 UI는 기존 UserManagementPanel/SystemUserPanel을 확장하고, 모달 컴포넌트(삭제, 비밀번호 초기화)를 새로 생성한다. 사용자 측 권한 신청은 RoleRequestModal로 구현한다.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, TanStack Query, React Router v7

**Spec:** `docs/superpowers/specs/2026-03-23-user-management-enhancement-design.md`

---

## Task 1: 타입 및 Mock 데이터 기반 확장

**Files:**
- Modify: `frontend/src/shared/types/auth.ts`
- Modify: `frontend/src/shared/mocks/accounts.ts`
- Modify: `frontend/src/features/admin/types/index.ts`
- Modify: `frontend/src/features/admin/mocks/adminData.ts`
- Delete: `frontend/src/features/auth/mocks/accounts.ts`

- [ ] **Step 1: `auth.ts` — User 타입, LoginResult 확장**

```typescript
// shared/types/auth.ts
export type UserRole = 'SUPER_ADMIN' | 'SYSTEM_ADMIN' | 'USER'
export type UserStatus = 'pending' | 'active' | 'rejected' | 'deleted'

export interface User {
  id: string
  name: string
  role: UserRole
  email?: string
  status: UserStatus
  requirePasswordChange?: boolean
}

export interface LoginResult {
  success: boolean
  error?: string
  blockedReason?: 'pending' | 'rejected' | 'deleted'
  requirePasswordChange?: boolean
}

// AuthState, SiteConfig는 기존 유지
```

- [ ] **Step 2: `accounts.ts` — MockAccount에 status, registeredAt, phone, requirePasswordChange 추가**

모든 기존 사용자에 `status: 'active'`, `registeredAt: '2025-01-01'` 추가.
테스트용 데이터 추가:
- pending 3명: `{ id: 'pending1', name: '신입일', status: 'pending', registeredAt: '2026-03-20' }` 등
- rejected 1명: `{ id: 'rejected1', name: '거절자', status: 'rejected' }`
- deleted 1명: `{ id: 'deleted1', name: '삭제자', status: 'deleted' }`

- [ ] **Step 3: `admin/types/index.ts` — RoleRequest 타입 추가**

```typescript
export interface RoleRequest {
  id: string
  userId: string
  systemId: string
  roleIds: string[]
  status: 'pending' | 'approved' | 'rejected'
  reason?: string
  requestedAt: string
  processedAt?: string
  processedBy?: string
  rejectionReason?: string
}
```

- [ ] **Step 4: `adminData.ts` — mockRoleRequests 추가**

pending 2~3건, approved 1건, rejected 1건 mock 데이터 추가.

- [ ] **Step 5: `features/auth/mocks/accounts.ts` 삭제**

이 파일을 삭제하고, 이 파일을 import하는 곳(`FindPasswordModal.tsx` 등)을 `@/shared/mocks/accounts.ts`로 변경.

- [ ] **Step 6: 커밋**

```
feat: 사용자 상태 모델 및 RoleRequest 타입 추가
```

---

## Task 2: AuthContext 로그인 로직 변경

**Files:**
- Modify: `frontend/src/shared/contexts/AuthContext.tsx`

- [ ] **Step 1: LoginResult 타입을 auth.ts에서 import하도록 변경**

기존 AuthContext 내 `LoginResult` 인터페이스 제거, `@/shared/types/auth.ts`에서 import.

- [ ] **Step 2: login 함수에 상태 검증 추가**

```typescript
const login = useCallback((id: string, password: string): LoginResult => {
  const account = mockAccounts.find(a => a.id === id && a.password === password)
  if (!account) {
    return { success: false, error: '아이디 또는 비밀번호가 일치하지 않습니다.' }
  }

  // 상태 검증
  if (account.status !== 'active') {
    return { success: false, blockedReason: account.status as 'pending' | 'rejected' | 'deleted' }
  }

  setUser({
    id: account.id,
    name: account.name,
    role: account.role,
    email: account.email,
    status: account.status,
    requirePasswordChange: account.requirePasswordChange,
  })
  setSessionExpiry(new Date(Date.now() + SESSION_DURATION_MS))

  return {
    success: true,
    requirePasswordChange: account.requirePasswordChange,
  }
}, [])
```

- [ ] **Step 3: User 상태에 email, status, requirePasswordChange 포함**

`setUser` 호출 시 확장된 User 타입의 모든 필드 포함.

- [ ] **Step 4: 커밋**

```
feat: AuthContext 로그인 시 사용자 상태 검증 추가
```

---

## Task 3: 로그인 차단 모달 + 비밀번호 강제 변경

**Files:**
- Modify: `frontend/src/features/auth/components/LoginForm.tsx`
- Create: `frontend/src/features/auth/pages/ChangePasswordPage.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: LoginForm에 상태별 차단 모달 추가**

`login()` 호출 결과에서 `blockedReason`이 있으면 모달 표시:
- `pending`: "가입 승인 대기 중입니다. 관리자 승인 후 로그인이 가능합니다."
- `rejected`: "가입이 거절되었습니다. 관리자에게 문의해주세요."
- `deleted`: "삭제된 계정입니다. 관리자에게 문의해주세요."

기존 `Modal` 컴포넌트 사용. `IconBadge` 아이콘으로 시각적 구분.

- [ ] **Step 2: LoginForm에 requirePasswordChange 리다이렉트 추가**

`login()` 성공 후 `requirePasswordChange`가 true이면 `navigate('/change-password')`.

- [ ] **Step 3: ChangePasswordPage 생성**

`frontend/src/features/auth/pages/ChangePasswordPage.tsx`:
- 새 비밀번호 입력 + 확인 입력
- 비밀번호 규칙: 8자 이상, 임시 비밀번호와 동일 불가
- 변경 완료 → `requirePasswordChange: false` + 메인 페이지로 이동
- 레이아웃: 중앙 정렬 카드 형태 (로그인 페이지와 유사)

- [ ] **Step 4: App.tsx에 `/change-password` 라우트 추가**

```tsx
<Route path="/change-password" element={<ChangePasswordPage />} />
```

Layout 내부에 배치.

- [ ] **Step 4-1: Layout.tsx에 requirePasswordChange 라우트 가드 추가**

`frontend/src/shared/components/layout/Layout.tsx`에서:
- `useAuth()`로 user를 가져옴
- `user?.requirePasswordChange === true`이고 현재 경로가 `/change-password`가 아니면 `<Navigate to="/change-password" replace />` 반환
- 이렇게 하면 임시 비밀번호 상태에서 다른 모든 페이지 접근이 차단됨

- [ ] **Step 5: features/auth/index.ts에서 ChangePasswordPage export 추가**

- [ ] **Step 6: 커밋**

```
feat: 로그인 차단 모달 및 비밀번호 강제 변경 페이지 구현
```

---

## Task 4: 가입 플로우 변경 (pending 상태로 생성)

**Files:**
- Modify: `frontend/src/features/auth/pages/SignupPage.tsx`

- [ ] **Step 1: 가입 성공 시 mockAccounts에 pending 상태로 추가**

가입 폼 제출 로직에서:
```typescript
mockAccounts.push({
  id: formData.id,
  password: formData.password,
  name: formData.name,
  role: 'USER',
  email: formData.email,
  phone: formData.phone,
  orgId: undefined,
  status: 'pending',
  registeredAt: new Date().toISOString().slice(0, 10),
})
```

- [ ] **Step 2: ID 중복 체크를 모든 상태 포함으로 변경**

기존 중복 체크가 `active` 사용자만 확인하는지 확인하고, 모든 상태(`pending`, `rejected`, `deleted` 포함)의 ID를 체크하도록 수정.

- [ ] **Step 3: 가입 성공 화면 안내 문구 변경**

기존 "가입이 완료되었습니다" → "가입 신청이 완료되었습니다. 관리자 승인 후 로그인이 가능합니다."

- [ ] **Step 4: 커밋**

```
feat: 회원가입 시 pending 상태로 생성 및 안내 변경
```

---

## Task 5: 비밀번호 찾기 모달 변경

**Files:**
- Modify: `frontend/src/features/auth/components/FindPasswordModal.tsx`

- [ ] **Step 1: 임시 비밀번호 생성 공통 유틸 생성**

`frontend/src/shared/utils/password.ts` 생성:

```typescript
export function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
```

FindPasswordModal과 PasswordResetModal(Task 8)에서 공통 import.

- [ ] **Step 2: 본인 확인 로직 변경**

아이디 + 이메일로 `mockAccounts`에서 `active` 상태 사용자만 검색.
찾으면 임시 비밀번호 생성 → `account.password` 변경 + `account.requirePasswordChange = true` 설정.
찾지 못하면 "해당 계정을 찾을 수 없습니다" 에러.

- [ ] **Step 3: 성공 화면 변경**

기존 "비밀번호 재설정 링크" 안내 → "임시 비밀번호를 이메일로 발송했습니다" 안내.
Mock 환경이므로 Toast로 임시 비밀번호도 함께 표시: `"임시 비밀번호: XXXXXXXX"`.

- [ ] **Step 4: 커밋**

```
feat: 비밀번호 찾기를 임시 비밀번호 발급 방식으로 변경
```

---

## Task 6: 관리자 — UserManagementPanel 상태 필터 및 승인/거절

**Files:**
- Modify: `frontend/src/features/admin/components/UserManagementPanel.tsx`

- [ ] **Step 1: 상태별 필터 탭 추가**

사용자 목록 상단 (PanelHeader 아래, ListDetailLayout 위)에 FilterChip 또는 간단한 탭 버튼으로:
`전체` | `대기 중` | `활성` | `거절` | `삭제됨`

필터 상태: `const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all')`

`filteredUsers`에 상태 필터 적용 (기존 검색 필터와 조합).

- [ ] **Step 2: 사용자 목록 항목에 상태 Badge 추가**

각 사용자 항목에 역할 Badge 옆에 상태 Badge 추가:
- pending: `<Badge color="amber">대기 중</Badge>`
- active: `<Badge color="emerald">활성</Badge>`
- rejected: `<Badge color="red">거절</Badge>`
- deleted: `<Badge color="slate">삭제됨</Badge>` + 목록 항목에 `opacity-50` 적용

- [ ] **Step 3: 사용자 상세 패널에 상태별 액션 버튼 추가**

SUPER_ADMIN만 표시:
- `pending` 사용자: "승인" (emerald) + "거절" (red) + "삭제" (ghost red)
- `active` 사용자: "사용자 삭제" + "비밀번호 초기화" (기존 정보 수정 옆)
- `rejected` 사용자: "계정 복구" (emerald) + "삭제" (ghost red)
- `deleted` 사용자: "계정 복구" (emerald)

승인/거절/복구는 mock 수준에서 `account.status` 직접 변경 + Toast 알림.

- [ ] **Step 4: 커밋**

```
feat: 사용자 관리 패널에 상태 필터, 승인/거절, 계정 복구 추가
```

---

## Task 7: 관리자 — 사용자 삭제 모달

**Files:**
- Create: `frontend/src/features/admin/components/UserDeleteModal.tsx`
- Modify: `frontend/src/features/admin/components/UserManagementPanel.tsx`

- [ ] **Step 1: UserDeleteModal 생성**

```typescript
interface UserDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  userName: string
  onConfirm: () => void
}
```

기존 `Modal` 컴포넌트 사용. 확인 모달:
- 아이콘: `IconBadge` red
- 메시지: "정말 삭제하시겠습니까? 삭제된 사용자는 로그인할 수 없습니다."
- 사용자 이름 표시
- "취소" / "삭제" 버튼 (삭제는 red 색상)

- [ ] **Step 2: UserManagementPanel에서 삭제 모달 연결**

"사용자 삭제" 버튼 클릭 → 모달 열기 → 확인 시:
- `account.status = 'deleted'`
- `mockUserRoleAssignments`에서 해당 userId의 항목 모두 제거 (시스템 접근 권한 비활성화)
- Toast + 선택 해제.

- [ ] **Step 3: 커밋**

```
feat: 사용자 삭제 확인 모달 구현
```

---

## Task 8: 관리자 — 비밀번호 초기화 모달

**Files:**
- Create: `frontend/src/features/admin/components/PasswordResetModal.tsx`
- Modify: `frontend/src/features/admin/components/UserManagementPanel.tsx`

- [ ] **Step 1: PasswordResetModal 생성**

```typescript
interface PasswordResetModalProps {
  isOpen: boolean
  onClose: () => void
  userName: string
  userEmail?: string
  onConfirm: (password: string, sendEmail: boolean) => void
}
```

모달 내용:
- 비밀번호 방식 선택: Radio 컴포넌트 사용 ("랜덤 생성" / "직접 입력")
- 직접 입력 선택 시 Input 필드 표시
- "이메일로 발송" Checkbox (기본 체크, `accentColor="emerald"`)
- "초기화" 버튼
- 완료 시: 생성된 비밀번호를 모달 내에 표시 + 복사 가능

`generateTempPassword()`는 Task 5에서 생성한 `@/shared/utils/password.ts`에서 import.

- [ ] **Step 2: UserManagementPanel에서 비밀번호 초기화 모달 연결**

"비밀번호 초기화" 버튼 → 모달 열기 → 확인 시:
- `account.password = newPassword`
- `account.requirePasswordChange = true`
- Toast: "비밀번호가 초기화되었습니다"

- [ ] **Step 3: 커밋**

```
feat: 관리자 비밀번호 초기화 모달 구현
```

---

## Task 9: Admin API 및 쿼리 확장

**Files:**
- Modify: `frontend/src/features/admin/api/index.ts`
- Modify: `frontend/src/features/admin/api/queries.ts`

- [ ] **Step 1: API에 역할 요청 관련 함수 추가**

```typescript
export async function fetchRoleRequests(systemId?: string): Promise<RoleRequest[]> {
  if (systemId) return mockRoleRequests.filter(r => r.systemId === systemId)
  return mockRoleRequests
}
```

- [ ] **Step 2: queries.ts에 useRoleRequests 훅 추가**

```typescript
export function useRoleRequests(systemId?: string) {
  return useQuery({
    queryKey: ['admin', 'roleRequests', systemId],
    queryFn: () => fetchRoleRequests(systemId),
  })
}
```

- [ ] **Step 3: 커밋**

```
feat: 역할 요청 API 및 쿼리 훅 추가
```

---

## Task 10: 사용자 측 — 권한 신청 모달

**Depends on:** Task 9 (useRoleRequests 훅)

**Files:**
- Create: `frontend/src/features/board/components/RoleRequestModal.tsx`
- Modify: `frontend/src/features/board/pages/MainPage.tsx`

- [ ] **Step 1: RoleRequestModal 생성**

```typescript
interface RoleRequestModalProps {
  isOpen: boolean
  onClose: () => void
}
```

모달 내용:
- 시스템 목록 (mockAdminSystems에서 가져옴)
- 이미 접근 권한 있는 시스템: "접근 중" Badge, 선택 불가
- 이미 pending 요청 중인 시스템: "신청 중" Badge, 선택 불가
- 시스템 선택 시 해당 시스템의 역할 목록 표시 (Checkbox, `accentColor="emerald"`)
- 요청 사유 Input (선택)
- "신청" 버튼 → `mockRoleRequests`에 push + Toast + 모달 닫기

시스템 목록은 `useAdminSystems()`, 사용자의 기존 접근 권한은 `useUserRoleAssignments()`, 기존 요청은 `useRoleRequests()`에서 가져옴.

- [ ] **Step 2: MainPage 우상단에 "권한 신청" 버튼 추가**

로그인된 사용자(`active` 상태)에게만 표시. 시스템 목록 영역 상단에 배치.
`<Button color="emerald" size="sm">권한 신청</Button>` → 모달 열기.

- [ ] **Step 3: 커밋**

```
feat: 사용자 측 권한 신청 모달 구현
```

---

## Task 11: 관리자 — SystemUserPanel 권한 요청 처리

**Files:**
- Modify: `frontend/src/features/admin/components/SystemUserPanel.tsx`

- [ ] **Step 1: 사용자 목록에 대기 중 요청 표시**

`useRoleRequests(systemId)`로 해당 시스템의 pending 요청을 가져옴.
기존 사용자 목록 위 또는 별도 섹션에 "권한 요청 N건" 표시.
요청 항목: 요청자 아바타 + 이름 + "요청" amber Badge.

- [ ] **Step 2: 요청 선택 시 상세 패널에 승인/반려 UI**

요청 선택 시 우측 패널에:
- 요청자 정보 (이름, ID, 이메일)
- 요청한 역할 목록
- 요청 사유 (있으면 표시)
- "승인" (emerald) / "반려" (red) 버튼
- 반려 시 사유 입력 Input 표시

승인 → `request.status = 'approved'` + `mockUserRoleAssignments`에 역할 추가
반려 → `request.status = 'rejected'` + `rejectionReason` 설정

승인/반려 버튼 표시 권한:
- SUPER_ADMIN: 모든 시스템의 요청 처리 가능
- SYSTEM_ADMIN: `mockSystemAdminPermissions`에서 자신의 `systemIds`에 포함된 시스템만 처리 가능. 그 외 시스템 요청은 버튼 숨김.

- [ ] **Step 3: 커밋**

```
feat: 시스템 사용자 관리에 권한 요청 승인/반려 기능 추가
```

---

## Task 12: 최종 정리 및 검증

**Files:**
- 전체 프로젝트

- [ ] **Step 1: `features/auth/mocks/accounts.ts` 삭제 확인**

이 파일이 삭제되었고, 이를 참조하는 import가 모두 `@/shared/mocks/accounts.ts`로 변경되었는지 grep으로 확인.

- [ ] **Step 2: TypeScript 빌드 검증**

```bash
cd frontend && npm run type-check
```

타입 에러 없는지 확인.

- [ ] **Step 3: 전체 플로우 수동 테스트**

브라우저에서 확인:
1. 회원가입 → pending 상태로 생성 확인
2. pending 사용자 로그인 → 차단 모달 확인
3. 관리자 로그인 → 사용자 관리 → 상태 필터 확인
4. 대기 중 사용자 승인 → active 변경 확인
5. 승인된 사용자 로그인 → 정상 로그인 확인
6. 사용자 삭제 → deleted 상태 + 목록 표시 확인
7. 비밀번호 초기화 → 임시 비밀번호 → 강제 변경 화면 확인
8. 비밀번호 찾기 → 임시 비밀번호 발급 확인
9. 권한 신청 → 모달에서 요청 → 관리자 패널에서 승인/반려 확인

- [ ] **Step 4: 최종 커밋**

```
chore: 사용자 관리 기능 강화 최종 정리
```
