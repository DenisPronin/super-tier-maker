const MIN_RATING = 1
const MAX_RATING = 5
const MID_RATING = (MIN_RATING + MAX_RATING) / 2

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

// bucketSize = peopleCount ensures "all vote 3" lands in the center of the middle bucket.
// Edge buckets are naturally clipped to [minScore, maxScore].
export function calculateScoreIntervals(
  categoriesCount: number,
  peopleCount: number
): ScoreInterval[] {
  if (categoriesCount === 0) return []

  const minScore = peopleCount * MIN_RATING
  const maxScore = peopleCount * MAX_RATING
  const bucketSize = peopleCount
  const averageScore = peopleCount * MID_RATING
  const middleIndex = (categoriesCount - 1) / 2
  const offset = Math.round(
    averageScore - middleIndex * bucketSize - (bucketSize - 1) / 2
  )

  return Array.from({ length: categoriesCount }, (_, i) => {
    const bucketFromBottom = categoriesCount - 1 - i
    const theoreticalMin = offset + bucketFromBottom * bucketSize
    const theoreticalMax = offset + (bucketFromBottom + 1) * bucketSize - 1

    return {
      min: Math.max(theoreticalMin, minScore),
      max: Math.min(theoreticalMax, maxScore),
    }
  })
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
