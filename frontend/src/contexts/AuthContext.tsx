import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User, AuthState } from '../types/auth'
import { mockAccounts } from '../mocks/accounts'

const SESSION_DURATION_MS = 30 * 60 * 1000 // 30분

interface LoginResult {
  success: boolean
  error?: string
}

interface AuthContextType extends AuthState {
  login: (id: string, password: string) => LoginResult
  logout: () => void
  extendSession: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null)

  const login = useCallback((id: string, password: string): LoginResult => {
    const account = mockAccounts.find(a => a.id === id && a.password === password)
    if (!account) {
      return { success: false, error: '아이디 또는 비밀번호가 일치하지 않습니다.' }
    }
    setUser({ name: account.name, role: account.role })
    setSessionExpiry(new Date(Date.now() + SESSION_DURATION_MS))
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setSessionExpiry(null)
  }, [])

  const extendSession = useCallback(() => {
    if (user) {
      setSessionExpiry(new Date(Date.now() + SESSION_DURATION_MS))
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, sessionExpiry, login, logout, extendSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
