export function createSeededRandom(seed: number) {
  let state = seed

  return function random() {
    state = (state * 9301 + 49297) % 233280
    return state / 233280
  }
}

export function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const random = createSeededRandom(seed)
  const shuffled = [...array]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}

export function generateSeed(): number {
  return Math.floor(Math.random() * 1000000)
}
