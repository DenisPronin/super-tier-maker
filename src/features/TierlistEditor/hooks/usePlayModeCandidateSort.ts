import { useEffect, useMemo, useState } from 'react'
import type { Candidate } from '../TierlistEditor.types'
import { generateSeed, shuffleWithSeed } from '../utils/seeded-random'

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

export function usePlayModeCandidateSort({
  candidates,
  tierlistId,
  enabled,
}: UsePlayModeCandidateSortProps) {
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  const [randomSeed, setRandomSeed] = useState<number>(generateSeed())

  useEffect(() => {
    if (!tierlistId || !enabled) return

    const storageKey = `tierlist-${tierlistId}-playmode-sort`
    const saved = localStorage.getItem(storageKey)

    if (saved) {
      try {
        const { sortBy: savedSort, seed } = JSON.parse(saved)
        setSortBy(savedSort)
        if (seed) setRandomSeed(seed)
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
      JSON.stringify({ sortBy, seed: randomSeed })
    )
  }, [tierlistId, sortBy, randomSeed, enabled])

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
      case 'random':
        return shuffleWithSeed(sorted, randomSeed)
      default:
        return sorted
    }
  }, [candidates, sortBy, randomSeed])

  const handleSortChange = (value: string | null) => {
    if (value) {
      setSortBy(value as SortOption)
      if (value === 'random' && sortBy !== 'random') {
        setRandomSeed(generateSeed())
      }
    }
  }

  const handleRegenerateRandom = () => {
    setRandomSeed(generateSeed())
  }

  return {
    sortedCandidates,
    sortBy,
    handleSortChange,
    handleRegenerateRandom,
  }
}
