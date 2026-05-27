import { useCallback, useEffect, useState } from 'react'
import type { Meal, MealsApiResponse } from '../types'

const API_URL = 'https://api.freeapi.app/api/v1/public/meals'
const PAGE_SIZE = 24

const loadMealsPage = async (page: number, signal?: AbortSignal) => {
  const response = await fetch(`${API_URL}?page=${page}&limit=${PAGE_SIZE}`, { signal })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  const payload = (await response.json()) as MealsApiResponse
  return payload.data
}

export function useMealsCatalog() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [totalMeals, setTotalMeals] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reloadIndex, setReloadIndex] = useState(0)

  const refetch = useCallback(() => {
    setReloadIndex((index) => index + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    const run = async () => {
      setError(null)
      setMeals([])
      setIsLoading(true)
      setIsSyncing(false)

      try {
        const firstPage = await loadMealsPage(1, controller.signal)

        if (!active) {
          return
        }

        setMeals(firstPage.data)
        setTotalMeals(firstPage.totalItems)
        setIsLoading(false)
        setIsSyncing(firstPage.totalPages > 1)

        for (let page = 2; page <= firstPage.totalPages; page += 1) {
          const nextPage = await loadMealsPage(page, controller.signal)

          if (!active) {
            return
          }

          setMeals((current) => [...current, ...nextPage.data])
        }

        if (active) {
          setIsSyncing(false)
        }
      } catch (cause) {
        if (!active) {
          return
        }

        setError(cause instanceof Error ? cause.message : 'Unable to load meals.')
        setIsLoading(false)
        setIsSyncing(false)
      }
    }

    void run()

    return () => {
      active = false
      controller.abort()
    }
  }, [reloadIndex])

  return {
    meals,
    totalMeals,
    isLoading,
    isSyncing,
    error,
    refetch,
  }
}
