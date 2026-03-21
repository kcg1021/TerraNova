import { useState, useEffect, useRef, useCallback } from 'react'

export function useContainerSize<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  const updateSize = useCallback(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect()
      setSize(prev => (prev.width === width && prev.height === height ? prev : { width, height }))
    }
  }, [])

  useEffect(() => {
    updateSize()
    const el = ref.current
    if (!el) return

    const ro = new ResizeObserver(updateSize)
    ro.observe(el)
    return () => ro.disconnect()
  }, [updateSize])

  return { ref, ...size }
}
