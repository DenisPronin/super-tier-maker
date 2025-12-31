const PEOPLE_COUNT = 6
const MIN_RATING = 1
const MAX_RATING = 5

const MIN_SCORE = PEOPLE_COUNT * MIN_RATING
const MAX_SCORE = PEOPLE_COUNT * MAX_RATING

export const SCORE_CONFIG = {
  min: MIN_SCORE,
  max: MAX_SCORE,
  peopleCount: PEOPLE_COUNT,
  minRating: MIN_RATING,
  maxRating: MAX_RATING,
}

interface ScoreInterval {
  min: number
  max: number
}

export function calculateScoreIntervals(
  categoriesCount: number
): ScoreInterval[] {
  if (categoriesCount === 0) return []

  const totalRange = MAX_SCORE - MIN_SCORE + 1
  const pointsPerCategory = totalRange / categoriesCount

  const intervals: ScoreInterval[] = []

  for (let i = 0; i < categoriesCount; i++) {
    const max =
      i === 0 ? MAX_SCORE : Math.floor(MAX_SCORE - pointsPerCategory * i)
    const min =
      i === categoriesCount - 1
        ? MIN_SCORE
        : Math.ceil(MAX_SCORE - pointsPerCategory * (i + 1) + 1)

    intervals.push({ min, max })
  }

  return intervals
}

export function findCategoryIndexByScore(
  score: number,
  categoriesCount: number
): number | null {
  const intervals = calculateScoreIntervals(categoriesCount)

  const index = intervals.findIndex(
    (interval) => score >= interval.min && score <= interval.max
  )

  return index >= 0 ? index : null
}
