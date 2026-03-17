import { useState, useCallback, type TransitionEvent } from 'react'

export function useCollapsible(initial = false) {
  const [collapsed, setCollapsed] = useState(initial)
  const [animating, setAnimating] = useState(false)

  const showCollapsed = collapsed && !animating

  const toggle = useCallback(() => {
    setAnimating(true)
    setCollapsed(prev => !prev)
  }, [])

  const handleTransitionEnd = useCallback((e: TransitionEvent<HTMLElement>) => {
    if (e.propertyName === 'width' && e.target === e.currentTarget) {
      setAnimating(false)
    }
  }, [])

  return { collapsed, showCollapsed, animating, toggle, handleTransitionEnd }
}
