import { useState } from 'react'

const STORAGE_KEY = 'score_people_count'
const DEFAULT_PEOPLE_COUNT = 6

function loadPeopleCount(): number {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === null) return DEFAULT_PEOPLE_COUNT
  const parsed = parseInt(stored, 10)
  return isNaN(parsed) ? DEFAULT_PEOPLE_COUNT : parsed
}

export function usePeopleCount() {
  const [peopleCount, setPeopleCount] = useState<number>(loadPeopleCount)

  const updatePeopleCount = (value: number) => {
    setPeopleCount(value)
    localStorage.setItem(STORAGE_KEY, String(value))
  }

  return { peopleCount, updatePeopleCount }
}
