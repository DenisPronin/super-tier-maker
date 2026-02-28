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

// Parabolic weights: center categories get more range, edges get less.
// Formula: weight[i] = N - |2i - (N-1)|
// Example for N=5: [1, 3, 5, 3, 1]
function buildParabolicWeights(categoriesCount: number): number[] {
  return Array.from({ length: categoriesCount }, (_, index) =>
    categoriesCount - Math.abs(2 * index - (categoriesCount - 1))
  )
}

export function calculateScoreIntervals(
  categoriesCount: number,
  peopleCount: number
): ScoreInterval[] {
  if (categoriesCount === 0) return []

  const minScore = peopleCount * MIN_RATING
  const maxScore = peopleCount * MAX_RATING
  const totalRange = maxScore - minScore + 1

  const weights = buildParabolicWeights(categoriesCount)
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)

  // Cumulative boundaries between categories, computed from the top
  const boundaries: number[] = []
  let cumWeight = 0
  for (let i = 0; i < categoriesCount - 1; i++) {
    cumWeight += weights[i]
    boundaries.push(maxScore - Math.round((totalRange * cumWeight) / totalWeight))
  }

  return Array.from({ length: categoriesCount }, (_, i) => ({
    max: i === 0 ? maxScore : boundaries[i - 1],
    min: i === categoriesCount - 1 ? minScore : boundaries[i] + 1,
  }))
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
