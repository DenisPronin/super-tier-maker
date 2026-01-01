import { useEffect, useMemo, useState } from 'react'
import type { Candidate } from '../TierlistEditor.types'

type SortOption = 'name-asc' | 'name-desc' | 'year-asc' | 'year-desc' | 'random'

export const sortOptions = [
  { value: 'name-asc', label: 'По имени (А-Я)' },
  { value: 'name-desc', label: 'По имени (Я-А)' },
  { value: 'year-asc', label: 'По году (старые)' },
  { value: 'year-desc', label: 'По году (новые)' },
  { value: 'random', label: 'Случайно' },
]

interface UsePlayModeCandidateSortProps {
  candidates: Candidate[]
  tierlistId: string | undefined
  enabled: boolean
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function usePlayModeCandidateSort({
  candidates,
  tierlistId,
  enabled,
}: UsePlayModeCandidateSortProps) {
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  const [randomOrder, setRandomOrder] = useState<string[]>([])

  useEffect(() => {
    if (!tierlistId || !enabled) return

    const storageKey = `tierlist-${tierlistId}-playmode-sort`
    const saved = localStorage.getItem(storageKey)

    if (saved) {
      try {
        const { sortBy: savedSort, randomOrder: savedOrder } = JSON.parse(saved)
        setSortBy(savedSort)
        if (savedOrder) setRandomOrder(savedOrder)
      } catch {
        // ignore
      }
    }
  }, [tierlistId, enabled])

  useEffect(() => {
    if (!tierlistId || !enabled) return

    const storageKey = `tierlist-${tierlistId}-playmode-sort`
    localStorage.setItem(
      storageKey,
      JSON.stringify({ sortBy, randomOrder })
    )
  }, [tierlistId, sortBy, randomOrder, enabled])

  const sortedCandidates = useMemo(() => {
    const sorted = [...candidates]

    switch (sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title))
      case 'name-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title))
      case 'year-asc':
        return sorted.sort((a, b) => {
          const yearA = a.year || 0
          const yearB = b.year || 0
          return yearA - yearB
        })
      case 'year-desc':
        return sorted.sort((a, b) => {
          const yearA = a.year || 0
          const yearB = b.year || 0
          return yearB - yearA
        })
      case 'random': {
        const candidateIds = candidates.map((c) => c.id)

        const validOrder = randomOrder.filter((id) =>
          candidateIds.includes(id)
        )

        const newIds = candidateIds.filter((id) => !validOrder.includes(id))

        const finalOrder = [...validOrder, ...newIds]

        return sorted.sort(
          (a, b) => finalOrder.indexOf(a.id) - finalOrder.indexOf(b.id)
        )
      }
      default:
        return sorted
    }
  }, [candidates, sortBy, randomOrder])

  const handleSortChange = (value: string | null) => {
    if (value) {
      setSortBy(value as SortOption)
      if (value === 'random' && sortBy !== 'random') {
        const candidateIds = candidates.map((c) => c.id)
        setRandomOrder(shuffleArray(candidateIds))
      }
    }
  }

  const handleRegenerateRandom = () => {
    const candidateIds = candidates.map((c) => c.id)
    setRandomOrder(shuffleArray(candidateIds))
  }

  return {
    sortedCandidates,
    sortBy,
    handleSortChange,
    handleRegenerateRandom,
  }
}
