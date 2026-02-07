import { createContext, useContext, useState, type ReactNode } from 'react'
import type { SiteConfig } from '../types/auth'

interface SiteConfigContextType {
  config: SiteConfig
  updateConfig: (config: Partial<SiteConfig>) => void
}

const defaultConfig: SiteConfig = {
  logoUrl: '/logo.svg',
  slogan: '',
  title: 'TerraNova',
  theme: 'system',
  displayBoards: ['free', 'qna'],
}

const SiteConfigContext = createContext<SiteConfigContextType | null>(null)

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig)

  const updateConfig = (partial: Partial<SiteConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }))
  }

  return (
    <SiteConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </SiteConfigContext.Provider>
  )
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext)
  if (!context) {
    throw new Error('useSiteConfig must be used within SiteConfigProvider')
  }
  return context
}
