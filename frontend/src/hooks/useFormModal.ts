import { useState, useCallback } from 'react'

interface UseFormModalReturn<T> {
  result: T | null
  error: string
  isLoading: boolean
  setResult: (value: T | null) => void
  setError: (message: string) => void
  setIsLoading: (loading: boolean) => void
  handleClose: () => void
  submit: (action: () => Promise<T>) => Promise<void>
}

export function useFormModal<T = string>(onClose: () => void): UseFormModalReturn<T> {
  const [result, setResult] = useState<T | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleClose = useCallback(() => {
    setResult(null)
    setError('')
    setIsLoading(false)
    onClose()
  }, [onClose])

  const submit = useCallback(async (action: () => Promise<T>) => {
    setIsLoading(true)
    setError('')
    try {
      const value = await action()
      setResult(value)
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { result, error, isLoading, setResult, setError, setIsLoading, handleClose, submit }
}
