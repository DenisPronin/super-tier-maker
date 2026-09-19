import { type CSSProperties } from 'react'

export const HEADER_THEME_ID = {
  LOL: 'lol',
  SERIES: 'series',
  CARTOONS: 'cartoons',
} as const

export type HeaderThemeId =
  (typeof HEADER_THEME_ID)[keyof typeof HEADER_THEME_ID]

export const SIDE_IMAGES_SOURCE = {
  STATIC: 'static',
  CANDIDATES: 'candidates',
} as const

export interface StaticSideImages {
  type: typeof SIDE_IMAGES_SOURCE.STATIC
  left: string[]
  right: string[]
}

// Uses preview_url of the tierlist candidates instead of bundled assets.
export interface CandidateSideImages {
  type: typeof SIDE_IMAGES_SOURCE.CANDIDATES
}

export type SideImages = StaticSideImages | CandidateSideImages

export interface HeaderTheme {
  id: HeaderThemeId
  label: string
  titleStyle: CSSProperties
  titleOverride?: string
  sideImages: SideImages
  marquee: boolean
}
