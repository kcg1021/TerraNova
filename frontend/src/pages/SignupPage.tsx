import { useState, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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
  const [focusedField, setFocusedField] = useState<string | null>(null)

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

  // 입력 필드 컴포넌트
  const renderField = (
    field: keyof typeof form,
    label: string,
    type: string = 'text',
    placeholder: string = ''
  ) => {
    const isFocused = focusedField === field
    const hasError = !!errors[field]
    const hasValue = !!form[field]

    return (
      <div className="relative">
        <label
          className={`
            absolute left-0 transition-all duration-200 pointer-events-none
            ${isFocused || hasValue ? '-top-6 text-xs' : 'top-3 text-sm'}
            ${hasError
              ? 'text-red-500 dark:text-red-400'
              : isFocused
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-400 dark:text-gray-500'
            }
          `}
        >
          {label}
        </label>
        <input
          type={type}
          value={form[field]}
          onChange={e => handleChange(field, e.target.value)}
          onFocus={() => setFocusedField(field)}
          onBlur={() => setFocusedField(null)}
          placeholder={isFocused ? placeholder : ''}
          className={`
            w-full py-3 bg-transparent border-b-2 text-sm
            text-gray-900 dark:text-white
            placeholder-gray-300 dark:placeholder-gray-600
            focus:outline-none transition-colors
            ${hasError
              ? 'border-red-300 dark:border-red-500'
              : isFocused
                ? 'border-gray-900 dark:border-white'
                : 'border-gray-200 dark:border-gray-700'
            }
          `}
        />
        {hasError && (
          <p className="absolute -bottom-5 left-0 text-xs text-red-500 dark:text-red-400">
            {errors[field]}
          </p>
        )}
      </div>
    )
  }

  // 성공 화면
  if (step === 'success') {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
        <div className="w-full max-w-lg">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="h-1 bg-gray-900 dark:bg-white" />

            <div className="p-12 text-center">
              <div className="relative inline-flex items-center justify-center mb-8">
                <div className="absolute w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full" />
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                가입이 완료되었습니다
              </h1>
              <p className="mt-3 text-gray-500 dark:text-gray-400 leading-relaxed">
                환영합니다, {form.name}님.<br />
                지금 바로 로그인하여 서비스를 이용해보세요.
              </p>

              <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-left">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">아이디</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{form.id}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">이메일</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{form.email}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/')}
                className="mt-8 w-full py-3.5 text-sm font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors cursor-pointer"
              >
                로그인하러 가기
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex bg-gray-50 dark:bg-gray-950">
      {/* 좌측: 폼 영역 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        <div className="w-full max-w-md">
          {/* 헤더 */}
          <div className="mb-12">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              돌아가기
            </Link>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">
              회원가입
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {step === 'terms' ? '서비스 이용을 위한 약관에 동의해주세요' : '서비스 이용을 위한 정보를 입력해주세요'}
            </p>
          </div>

          {step === 'terms' ? (
            /* 약관 동의 단계 */
            <div className="space-y-8">
              {/* 전체 동의 */}
              <div
                onClick={handleToggleAll}
                className={`flex items-center gap-4 p-5 bg-gray-100 dark:bg-gray-800 border-2 transition-colors cursor-pointer ${
                  allRead
                    ? 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className={`
                  w-6 h-6 border-2 rounded flex items-center justify-center flex-shrink-0 transition-colors
                  ${allAgreed
                    ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white'
                    : allRead
                      ? 'border-gray-400 dark:border-gray-400 bg-white dark:bg-gray-900'
                      : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800'
                  }
                `}>
                  {allAgreed && (
                    <svg className="w-4 h-4 text-white dark:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 dark:text-white">전체 동의</span>
                  {!allRead && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">모든 약관을 읽어주세요</p>
                  )}
                </div>
              </div>

              {/* 개별 약관 */}
              <div className="space-y-4">
                {mockTerms.map(term => (
                  <div
                    key={term.id}
                    className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-hidden"
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
                            ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white'
                            : readTerms[term.id]
                              ? 'border-gray-400 dark:border-gray-400 bg-white dark:bg-gray-900'
                              : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800'
                          }
                        `}>
                          {agreedTerms[term.id] && (
                            <svg className="w-3 h-3 text-white dark:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-gray-900 dark:text-white">
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
                        className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
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
                          className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap max-h-48 lg:max-h-60 overflow-y-auto scrollbar-thin"
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
                <Link
                  to="/"
                  className="flex-1 py-3.5 text-sm font-medium text-center text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  취소
                </Link>
                <button
                  onClick={() => setStep('form')}
                  disabled={!allRequiredAgreed}
                  className={`
                    flex-1 py-3.5 text-sm font-medium transition-colors
                    ${allRequiredAgreed
                      ? 'text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 cursor-pointer'
                      : 'text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 cursor-not-allowed'
                    }
                  `}
                >
                  다음
                </button>
              </div>
            </div>
          ) : (
            /* 정보 입력 단계 */
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* 계정 정보 섹션 */}
              <div>
                <h2 className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-6">
                  계정 정보
                </h2>
                <div className="space-y-8">
                  {renderField('id', '아이디', 'text', '4자 이상')}
                  {renderField('password', '비밀번호', 'password', '8자 이상')}
                  {renderField('passwordConfirm', '비밀번호 확인', 'password')}
                </div>
              </div>

              {/* 개인 정보 섹션 */}
              <div>
                <h2 className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-6">
                  개인 정보
                </h2>
                <div className="space-y-8">
                  {renderField('name', '이름', 'text')}
                  {renderField('email', '이메일', 'email', 'example@email.com')}
                  {renderField('phone', '연락처', 'tel', '010-0000-0000')}
                </div>
              </div>

              {/* 버튼 */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('terms')}
                  className="flex-1 py-3.5 text-sm font-medium text-center text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  이전
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 text-sm font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  가입하기
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* 우측: 장식 영역 */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-100 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
        <div className="max-w-sm text-center px-12">
          {/* 장식 요소 */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 border-2 border-gray-300 dark:border-gray-600 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-gray-400 dark:border-gray-500 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-900 dark:bg-white rounded-full" />
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
            간편한 가입 절차
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            약관 동의 후 필수 정보만 입력하면<br />
            바로 서비스를 이용하실 수 있습니다.
          </p>

          {/* 단계 표시 */}
          <div className="mt-10 flex items-center justify-center gap-6">
            <div className="text-center">
              <div className={`w-8 h-8 rounded-full text-xs font-medium flex items-center justify-center mb-2 ${
                step === 'terms'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
              }`}>1</div>
              <span className={`text-xs ${step === 'terms' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>약관 동의</span>
            </div>
            <div className="w-6 h-px bg-gray-300 dark:bg-gray-600" />
            <div className="text-center">
              <div className={`w-8 h-8 rounded-full text-xs font-medium flex items-center justify-center mb-2 ${
                step === 'form'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
              }`}>2</div>
              <span className={`text-xs ${step === 'form' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>정보 입력</span>
            </div>
            <div className="w-6 h-px bg-gray-300 dark:bg-gray-600" />
            <div className="text-center">
              <div className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 text-xs font-medium flex items-center justify-center mb-2">3</div>
              <span className="text-xs text-gray-400 dark:text-gray-500">가입 완료</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
