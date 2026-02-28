const MIN_RATING = 1
const MAX_RATING = 5

export function getScoreConfig(peopleCount: number) {
  return {
    min: peopleCount * MIN_RATING,
    max: peopleCount * MAX_RATING,
    peopleCount,
    minRating: MIN_RATING,
    maxRating: MAX_RATING,
  }
}

interface ScoreInterval {
  min: number
  max: number
}

export function calculateScoreIntervals(
  categoriesCount: number,
  peopleCount: number
): ScoreInterval[] {
  if (categoriesCount === 0) return []

  const minScore = peopleCount * MIN_RATING
  const maxScore = peopleCount * MAX_RATING
  const totalRange = maxScore - minScore + 1
  const pointsPerCategory = totalRange / categoriesCount

  const intervals: ScoreInterval[] = []

  for (let i = 0; i < categoriesCount; i++) {
    const max =
      i === 0 ? maxScore : Math.floor(maxScore - pointsPerCategory * i)
    const min =
      i === categoriesCount - 1
        ? minScore
        : Math.ceil(maxScore - pointsPerCategory * (i + 1) + 1)

    intervals.push({ min, max })
  }

  return intervals
}

export function findCategoryIndexByScore(
  score: number,
  categoriesCount: number,
  peopleCount: number
): number | null {
  const intervals = calculateScoreIntervals(categoriesCount, peopleCount)

  const index = intervals.findIndex(
    (interval) => score >= interval.min && score <= interval.max
  )

  return index >= 0 ? index : null
}
