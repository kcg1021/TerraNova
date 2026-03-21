import { useState, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input, Button, IconBadge, Icons } from '@/shared/components/ui-kit'

// Mock: 실제로는 API에서 약관 목록을 가져옴
interface Term {
  id: string
  title: string
  content: string
  required: boolean
}

const mockTerms: Term[] = [
  {
    id: 'service',
    title: '서비스 이용약관',
    content: `제1조 (목적)
이 약관은 본 서비스의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "서비스"라 함은 회사가 제공하는 모든 서비스를 의미합니다.
2. "회원"이라 함은 서비스에 접속하여 본 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.

제3조 (약관의 효력 및 변경)
1. 본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.
2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.`,
    required: true,
  },
  {
    id: 'privacy',
    title: '개인정보 수집 및 이용 동의',
    content: `1. 수집하는 개인정보 항목
- 필수항목: 아이디, 비밀번호, 이름, 이메일, 연락처

2. 개인정보의 수집 및 이용목적
- 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산
- 회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인식별

3. 개인정보의 보유 및 이용기간
- 회원 탈퇴 시까지 (단, 관계법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보존)`,
    required: true,
  },
]

export default function SignupPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'terms' | 'form' | 'success'>('terms')

  // 약관 동의 상태
  const [agreedTerms, setAgreedTerms] = useState<Record<string, boolean>>({})
  const [expandedTerms, setExpandedTerms] = useState<string[]>([])
  const [readTerms, setReadTerms] = useState<Record<string, boolean>>({})

  // 폼 상태
  const [form, setForm] = useState({
    id: '',
    password: '',
    passwordConfirm: '',
    name: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // 모든 필수 약관에 동의했는지 확인
  const allRequiredAgreed = useMemo(() => {
    return mockTerms
      .filter(t => t.required)
      .every(t => agreedTerms[t.id])
  }, [agreedTerms])

  // 전체 동의 체크
  const allAgreed = useMemo(() => {
    return mockTerms.every(t => agreedTerms[t.id])
  }, [agreedTerms])

  // 모든 약관을 읽었는지 확인
  const allRead = useMemo(() => {
    return mockTerms.every(t => readTerms[t.id])
  }, [readTerms])

  const handleToggleAll = () => {
    if (allAgreed) {
      setAgreedTerms({})
      setExpandedTerms([])
    } else if (allRead) {
      // 모두 읽었을 때만 전체 동의 가능
      const all: Record<string, boolean> = {}
      mockTerms.forEach(t => { all[t.id] = true })
      setAgreedTerms(all)
    } else {
      // 읽지 않은 약관이 있으면 모두 펼치기
      setExpandedTerms(mockTerms.map(t => t.id))
    }
  }

  const handleToggleTerm = (id: string) => {
    const isCurrentlyAgreed = agreedTerms[id]

    if (!isCurrentlyAgreed && !readTerms[id]) {
      // 읽지 않은 약관은 체크 불가, 대신 펼치기
      setExpandedTerms(prev => prev.includes(id) ? prev : [...prev, id])
      return
    }

    setAgreedTerms(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleToggleExpand = (id: string) => {
    setExpandedTerms(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  const handleScroll = (id: string, e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 10

    if (isAtBottom && !readTerms[id]) {
      setReadTerms(prev => ({ ...prev, [id]: true }))
    }
  }

  // 스크롤이 필요없는 짧은 약관은 자동으로 읽음 처리
  const handleContentRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el && !readTerms[id]) {
      const needsScroll = el.scrollHeight > el.clientHeight
      if (!needsScroll) {
        setReadTerms(prev => ({ ...prev, [id]: true }))
      }
    }
  }, [readTerms])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!form.id.trim()) {
      newErrors.id = '아이디를 입력해주세요.'
    } else if (form.id.length < 4) {
      newErrors.id = '아이디는 4자 이상이어야 합니다.'
    }

    if (!form.password) {
      newErrors.password = '비밀번호를 입력해주세요.'
    } else if (form.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.'
    }

    if (!form.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호 확인을 입력해주세요.'
    } else if (form.password !== form.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.'
    }

    if (!form.name.trim()) {
      newErrors.name = '이름을 입력해주세요.'
    }

    if (!form.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.'
    }

    if (!form.phone.trim()) {
      newErrors.phone = '연락처를 입력해주세요.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    if (form.id === 'admin' || form.id === 'user') {
      setErrors({ id: '이미 사용 중인 아이디입니다.' })
      return
    }

    setStep('success')
  }


  // 성공 화면
  if (step === 'success') {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="w-full max-w-lg">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-12 text-center">
              <div className="flex justify-center mb-6">
                <IconBadge icon={Icons.check} color="emerald" animate />
              </div>

              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
                가입이 완료되었습니다
              </h1>
              <p className="mt-3 text-slate-500 dark:text-slate-400 leading-relaxed">
                환영합니다, {form.name}님.<br />
                지금 바로 로그인하여 서비스를 이용해보세요.
              </p>

              <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-left">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-sm text-slate-500 dark:text-slate-400">아이디</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{form.id}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">이메일</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{form.email}</span>
                </div>
              </div>

              <div className="mt-8">
                <Button onClick={() => navigate('/')} fullWidth>
                  로그인하러 가기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex bg-slate-50 dark:bg-slate-950">
      {/* 폼 영역 */}
      <div className="w-full flex items-center justify-center p-6 lg:p-12 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md">
          {/* 헤더 */}
          <div className="mb-12">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-8"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              돌아가기
            </Link>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
              회원가입
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {step === 'terms' ? '서비스 이용을 위한 약관에 동의해주세요' : '서비스 이용을 위한 정보를 입력해주세요'}
            </p>
          </div>

          {step === 'terms' ? (
            /* 약관 동의 단계 */
            <div className="space-y-8">
              {/* 전체 동의 */}
              <div
                onClick={handleToggleAll}
                className={`flex items-center gap-4 p-5 bg-slate-100 dark:bg-slate-800 border-2 transition-colors cursor-pointer ${
                  allRead
                    ? 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className={`
                  w-6 h-6 border-2 rounded flex items-center justify-center flex-shrink-0 transition-colors
                  ${allAgreed
                    ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white'
                    : allRead
                      ? 'border-slate-400 dark:border-slate-400 bg-white dark:bg-slate-900'
                      : 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800'
                  }
                `}>
                  {allAgreed && (
                    <svg className="w-4 h-4 text-white dark:text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-slate-900 dark:text-white">전체 동의</span>
                  {!allRead && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">모든 약관을 읽어주세요</p>
                  )}
                </div>
              </div>

              {/* 개별 약관 */}
              <div className="space-y-4">
                {mockTerms.map(term => (
                  <div
                    key={term.id}
                    className="border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 overflow-hidden"
                  >
                    {/* 약관 헤더 */}
                    <div className="flex items-center justify-between p-4">
                      <div
                        onClick={() => handleToggleTerm(term.id)}
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                      >
                        <div className={`
                          w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 transition-colors
                          ${agreedTerms[term.id]
                            ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white'
                            : readTerms[term.id]
                              ? 'border-slate-400 dark:border-slate-400 bg-white dark:bg-slate-900'
                              : 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800'
                          }
                        `}>
                          {agreedTerms[term.id] && (
                            <svg className="w-3 h-3 text-white dark:text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-slate-900 dark:text-white">
                            {term.title}
                            {term.required && (
                              <span className="ml-1.5 text-red-500 dark:text-red-400 font-medium">(필수)</span>
                            )}
                          </span>
                          {!readTerms[term.id] && (
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">내용을 끝까지 읽어주세요</p>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleExpand(term.id)}
                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                      >
                        <svg
                          className={`w-5 h-5 transition-transform ${expandedTerms.includes(term.id) ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {/* 약관 내용 */}
                    {expandedTerms.includes(term.id) && (
                      <div className="px-4 pb-4">
                        <div
                          ref={(el) => handleContentRef(term.id, el)}
                          onScroll={(e) => handleScroll(term.id, e)}
                          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap max-h-48 lg:max-h-60 overflow-y-auto scrollbar-thin"
                        >
                          {term.content}
                        </div>
                        {!readTerms[term.id] && (
                          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                            스크롤하여 끝까지 읽어주세요
                          </p>
                        )}
                        {readTerms[term.id] && !agreedTerms[term.id] && (
                          <p className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            읽기 완료 - 체크박스를 클릭하세요
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 버튼 */}
              <div className="pt-2 flex gap-3">
                <Link to="/" className="flex-1">
                  <Button variant="secondary" fullWidth>
                    취소
                  </Button>
                </Link>
                <Button
                  onClick={() => setStep('form')}
                  disabled={!allRequiredAgreed}
                  className="flex-1"
                >
                  다음
                </Button>
              </div>
            </div>
          ) : (
            /* 정보 입력 단계 */
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* 계정 정보 섹션 */}
              <div>
                <h2 className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-6">
                  계정 정보
                </h2>
                <div className="space-y-8">
                  <Input
                    variant="floating"
                    label="아이디"
                    type="text"
                    value={form.id}
                    onChange={e => handleChange('id', e.target.value)}
                    placeholder="4자 이상"
                    error={errors.id}
                  />
                  <Input
                    variant="floating"
                    label="비밀번호"
                    type="password"
                    value={form.password}
                    onChange={e => handleChange('password', e.target.value)}
                    placeholder="8자 이상"
                    error={errors.password}
                  />
                  <Input
                    variant="floating"
                    label="비밀번호 확인"
                    type="password"
                    value={form.passwordConfirm}
                    onChange={e => handleChange('passwordConfirm', e.target.value)}
                    error={errors.passwordConfirm}
                  />
                </div>
              </div>

              {/* 개인 정보 섹션 */}
              <div>
                <h2 className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-6">
                  개인 정보
                </h2>
                <div className="space-y-8">
                  <Input
                    variant="floating"
                    label="이름"
                    type="text"
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    error={errors.name}
                  />
                  <Input
                    variant="floating"
                    label="이메일"
                    type="email"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    placeholder="example@email.com"
                    error={errors.email}
                  />
                  <Input
                    variant="floating"
                    label="연락처"
                    type="tel"
                    value={form.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    placeholder="010-0000-0000"
                    error={errors.phone}
                  />
                </div>
              </div>

              {/* 버튼 */}
              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep('terms')}
                  className="flex-1"
                >
                  이전
                </Button>
                <Button type="submit" className="flex-1">
                  가입하기
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
