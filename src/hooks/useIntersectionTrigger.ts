import { useEffect, useRef } from 'react'

export function useIntersectionTrigger(onTrigger: () => void, disabled = false) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const element = ref.current

    if (!element || disabled) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onTrigger()
        }
      },
      { rootMargin: '240px 0px' },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [disabled, onTrigger])

  return ref
}
