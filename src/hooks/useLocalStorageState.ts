import { useEffect, useState } from 'react'

export function useLocalStorageState<T>(key: string, fallbackValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return fallbackValue
    }

    const stored = window.localStorage.getItem(key)
    if (!stored) {
      return fallbackValue
    }

    try {
      return JSON.parse(stored) as T
    } catch {
      return fallbackValue
    }
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}
