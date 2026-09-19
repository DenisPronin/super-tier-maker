// Stored in the category color column instead of a hex value.
export const RAINBOW_COLOR = 'rainbow'

// Saturated stops keep white text readable, pastel ones wash it out on yellow and green.
export const RAINBOW_GRADIENT =
  'linear-gradient(90deg, #e53935 0%, #fb8c00 20%, #fdd835 40%, #43a047 60%, #1e88e5 80%, #8e24aa 100%)'

export function isRainbowColor(color: string | null | undefined): boolean {
  return color === RAINBOW_COLOR
}

// Returns a CSS background value: the gradient for rainbow, the color itself for hex.
export function getCategoryBackground(
  color: string | null | undefined,
  fallback: string
): string {
  if (!color) return fallback
  if (isRainbowColor(color)) return RAINBOW_GRADIENT
  return color
}
