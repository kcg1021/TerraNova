# UI-KIT 컴포넌트 가이드

TerraNova 프론트엔드에서 사용하는 재사용 가능한 UI 컴포넌트 모음입니다.

## 설치 경로

```
frontend/src/components/ui-kit/
├── Input.tsx         # 입력 필드 (아이콘 지원)
├── FloatingInput.tsx # 입력 필드 (플로팅 라벨)
├── Button.tsx        # 버튼
├── Alert.tsx         # 알림 메시지
├── IconBadge.tsx     # 아이콘 배지
└── index.ts          # 배럴 export
```

## Import 방법

```tsx
import { Input, FloatingInput, Button, Alert, IconBadge, Icons } from '../components/ui-kit'
```

---

## Input

아이콘을 지원하는 입력 필드 컴포넌트입니다.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | 입력 필드 상단 라벨 |
| `icon` | `ReactNode` | - | 입력 필드 좌측 아이콘 |
| `error` | `string` | - | 에러 메시지 (하단 표시) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 입력 필드 크기 |
| `variant` | `'default' \| 'filled'` | `'filled'` | 스타일 변형 |
| `accentColor` | `'primary' \| 'amber'` | `'primary'` | 포커스 시 강조 색상 |

> 기본 `<input>` 태그의 모든 속성(placeholder, type, value, onChange 등)을 지원합니다.

### 사용 예시

```tsx
// 기본 사용
<Input
  label="이메일"
  type="email"
  placeholder="example@email.com"
/>

// 아이콘 포함
<Input
  label="아이디"
  icon={Icons.user}
  placeholder="아이디를 입력하세요"
/>

// 에러 표시
<Input
  label="비밀번호"
  type="password"
  error="비밀번호가 일치하지 않습니다."
/>

// 엠버 색상 테마
<Input
  label="검색"
  icon={Icons.search}
  accentColor="amber"
  size="lg"
/>
```

---

## FloatingInput

플로팅 라벨과 언더라인 스타일의 미니멀한 입력 필드입니다.
회원가입 등 폼이 많은 페이지에 적합합니다.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | 플로팅 라벨 텍스트 (필수) |
| `error` | `string` | - | 에러 메시지 (하단 표시) |

> 기본 `<input>` 태그의 모든 속성(placeholder, type, value, onChange 등)을 지원합니다.

### 특징

- **플로팅 라벨**: 입력 시 라벨이 위로 올라가는 애니메이션
- **언더라인 스타일**: border-bottom만 사용하는 미니멀 디자인
- **포커스 상태**: 라벨과 언더라인 색상 변경

### 사용 예시

```tsx
// 기본 사용
<FloatingInput
  label="아이디"
  type="text"
  value={id}
  onChange={e => setId(e.target.value)}
/>

// placeholder 포함
<FloatingInput
  label="이메일"
  type="email"
  value={email}
  onChange={e => setEmail(e.target.value)}
  placeholder="example@email.com"
/>

// 에러 표시
<FloatingInput
  label="비밀번호"
  type="password"
  value={password}
  onChange={e => setPassword(e.target.value)}
  error="비밀번호는 8자 이상이어야 합니다."
/>

// 회원가입 폼 예시
<form className="space-y-8">
  <FloatingInput label="아이디" value={form.id} onChange={...} error={errors.id} />
  <FloatingInput label="비밀번호" type="password" value={form.password} onChange={...} />
  <FloatingInput label="이메일" type="email" value={form.email} onChange={...} />
</form>
```

---

## Button

다양한 스타일과 로딩 상태를 지원하는 버튼 컴포넌트입니다.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | 버튼 스타일 |
| `color` | `'blue' \| 'amber' \| 'gray'` | `'blue'` | 버튼 색상 (primary만 적용) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 버튼 크기 |
| `loading` | `boolean` | `false` | 로딩 상태 |
| `loadingText` | `string` | - | 로딩 중 표시 텍스트 |
| `fullWidth` | `boolean` | `false` | 전체 너비 사용 |
| `icon` | `ReactNode` | - | 버튼 좌측 아이콘 |

### Variant 스타일

- **primary**: 단색 배경, 흰색 텍스트, 그림자 효과
- **secondary**: 회색 배경, 호버 시 색상 변경
- **ghost**: 투명 배경, 호버 시 배경색 표시

### 사용 예시

```tsx
// Primary 버튼 (기본)
<Button onClick={handleClick}>
  확인
</Button>

// Secondary 버튼
<Button variant="secondary" onClick={handleCancel}>
  취소
</Button>

// 로딩 상태
<Button loading loadingText="처리 중...">
  제출
</Button>

// 전체 너비 + 엠버 색상
<Button color="amber" fullWidth>
  비밀번호 변경
</Button>

// 아이콘 포함
<Button
  variant="secondary"
  icon={
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12..." />
    </svg>
  }
>
  목록보기
</Button>

// 폼에서 사용
<div className="flex gap-3">
  <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
    취소
  </Button>
  <Button type="submit" loading={isLoading} className="flex-1">
    저장
  </Button>
</div>
```

---

## Alert

다양한 타입의 알림 메시지를 표시하는 컴포넌트입니다.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'error' \| 'info' \| 'success' \| 'warning'` | `'error'` | 알림 타입 |
| `title` | `string` | - | 알림 제목 (선택) |
| `children` | `ReactNode` | - | 알림 내용 |
| `className` | `string` | - | 추가 CSS 클래스 |

### 타입별 스타일

- **error**: 빨간색 계열 (에러 상황)
- **info**: 파란색 계열 (정보 안내)
- **success**: 초록색 계열 (성공 메시지)
- **warning**: 주황색 계열 (경고)

### 사용 예시

```tsx
// 에러 알림 (기본)
<Alert type="error">
  아이디 또는 비밀번호가 일치하지 않습니다.
</Alert>

// 제목 포함 정보 알림
<Alert type="info" title="이메일을 확인해주세요">
  <p className="text-xs">
    비밀번호 재설정 링크가 포함된 이메일을 발송했습니다.
    링크는 24시간 동안 유효합니다.
  </p>
</Alert>

// 성공 알림
<Alert type="success" title="저장 완료">
  변경사항이 성공적으로 저장되었습니다.
</Alert>

// 경고 알림
<Alert type="warning">
  5분 후 자동 로그아웃됩니다.
</Alert>

// 조건부 렌더링
{error && <Alert type="error">{error}</Alert>}
```

---

## IconBadge

모달 헤더 등에 사용되는 아이콘 배지 컴포넌트입니다.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | - | 메인 아이콘 |
| `color` | `'blue' \| 'amber' \| 'emerald' \| 'red' \| 'slate'` | `'blue'` | 배경 그라데이션 색상 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'lg'` | 배지 크기 |
| `badge` | `ReactNode` | - | 우측 하단 작은 배지 아이콘 |
| `badgeColor` | `'blue' \| 'amber' \| 'emerald' \| 'red' \| 'white'` | `'white'` | 배지 배경 색상 |
| `animate` | `boolean` | `false` | 성공 애니메이션 적용 |

### 사용 예시

```tsx
// 기본 사용
<IconBadge icon={Icons.user} color="blue" />

// 작은 배지 포함
<IconBadge
  icon={Icons.user}
  color="blue"
  badge={Icons.search}
  badgeColor="white"
/>

// 성공 애니메이션
<IconBadge
  icon={Icons.check}
  color="emerald"
  animate
/>

// 비밀번호 찾기 (엠버 테마)
<IconBadge
  icon={Icons.lock}
  color="amber"
  badge={Icons.key}
  badgeColor="white"
/>

// 이메일 발송 완료
<IconBadge
  icon={Icons.email}
  color="blue"
  badge={Icons.check}
  badgeColor="emerald"
  animate
/>
```

---

## Icons

자주 사용되는 미리 정의된 SVG 아이콘 모음입니다.

### 사용 가능한 아이콘

| 이름 | 용도 |
|------|------|
| `Icons.user` | 사용자, 아이디 |
| `Icons.lock` | 비밀번호, 보안 |
| `Icons.email` | 이메일 |
| `Icons.check` | 체크, 완료 |
| `Icons.search` | 검색 |
| `Icons.key` | 키, 비밀번호 재설정 |
| `Icons.megaphone` | 공지사항, 알림 |
| `Icons.list` | 목록 |

### 사용 예시

```tsx
import { Icons } from '../components/ui-kit'

// Input 아이콘으로 사용
<Input icon={Icons.user} placeholder="아이디" />
<Input icon={Icons.email} placeholder="이메일" />
<Input icon={Icons.search} placeholder="검색어" />

// IconBadge에서 사용
<IconBadge icon={Icons.megaphone} color="blue" />
```

---

## CSS 애니메이션

UI-KIT 컴포넌트와 함께 사용할 수 있는 CSS 애니메이션입니다.
`frontend/src/index.css`에 정의되어 있습니다.

| 클래스 | 설명 |
|--------|------|
| `.modal-overlay` | 모달 배경 페이드인 |
| `.modal-content` | 모달 컨텐츠 슬라이드업 |
| `.success-icon-animate` | 성공 아이콘 팝 효과 |
| `.checkmark-animate` | 체크마크 그리기 효과 |

---

## 실제 사용 예시

### 아이디 찾기 모달

```tsx
import Modal from '../common/Modal'
import { Input, Button, Alert, IconBadge, Icons } from '../ui-kit'

function FindIdModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="아이디 찾기"
      subtitle="가입 시 등록한 정보를 입력해주세요"
      icon={
        <IconBadge
          icon={Icons.user}
          color="blue"
          badge={Icons.search}
          badgeColor="white"
        />
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="이름"
          icon={Icons.user}
          placeholder="실명을 입력하세요"
          size="lg"
        />
        <Input
          label="이메일"
          type="email"
          icon={Icons.email}
          placeholder="example@email.com"
          size="lg"
        />

        {error && <Alert type="error">{error}</Alert>}

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            취소
          </Button>
          <Button type="submit" loading={isLoading} className="flex-1">
            아이디 찾기
          </Button>
        </div>
      </form>
    </Modal>
  )
}
```

---

## 다크 모드 지원

모든 UI-KIT 컴포넌트는 Tailwind의 `dark:` 프리픽스를 사용하여 다크 모드를 자동 지원합니다.
별도의 설정 없이 시스템 또는 사용자 테마 설정에 따라 자동으로 스타일이 변경됩니다.
