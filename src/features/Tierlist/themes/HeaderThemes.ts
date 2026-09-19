import {
  HEADER_THEME_ID,
  type HeaderTheme,
  type HeaderThemeId,
  SIDE_IMAGES_SOURCE,
} from './HeaderTheme.types'

const TEEMO_IMAGE = '/lol/teemo.webp'
const TEEMO_COUNT = 13

const lolTheme: HeaderTheme = {
  id: HEADER_THEME_ID.LOL,
  label: 'League of Teemo',
  titleStyle: {
    fontFamily: 'LolBold, sans-serif',
    background:
      'linear-gradient(180deg, #F0E6B2 0%, #C8AA6E 45%, #785A28 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    WebkitTextStroke: '1px #1C1004',
    filter: 'drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.8))',
  },
  sideImages: {
    type: SIDE_IMAGES_SOURCE.STATIC,
    left: Array.from({ length: TEEMO_COUNT }, () => TEEMO_IMAGE),
    right: Array.from({ length: TEEMO_COUNT }, () => TEEMO_IMAGE),
  },
  marquee: false,
}

const seriesTheme: HeaderTheme = {
  id: HEADER_THEME_ID.SERIES,
  label: 'Series',
  titleStyle: {
    fontFamily: 'PWChristmas, sans-serif',
    background: 'linear-gradient(90deg, #e11d48, #16a34a)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  sideImages: {
    type: SIDE_IMAGES_SOURCE.STATIC,
    left: [
      '/alf.gif',
      '/brooklyn.gif',
      '/sabrina.gif',
      '/joe.gif',
      '/turkey.gif',
      '/khaleesi.gif',
      '/super.gif',
      '/office.gif',
    ],
    right: [
      '/scrubs.gif',
      '/lily.gif',
      '/omens.gif',
      '/bazinga2.gif',
      '/shelby.gif',
      '/billy.gif',
      '/lasso.gif',
      '/danger.gif',
    ],
  },
  marquee: false,
}

const cartoonsTheme: HeaderTheme = {
  id: HEADER_THEME_ID.CARTOONS,
  label: 'Multiki',
  titleOverride: 'MULTIKI',
  titleStyle: {
    fontFamily: 'Waltograph, sans-serif',
    background:
      'linear-gradient(180deg, #FFFFFF 0%, #BFE3FF 55%, #4F9BE8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    WebkitTextStroke: '1px #0B2A6F',
    filter: 'drop-shadow(0px 0px 12px rgba(79, 155, 232, 0.6))',
  },
  sideImages: { type: SIDE_IMAGES_SOURCE.CANDIDATES },
  marquee: true,
}

const HEADER_THEMES: Record<HeaderThemeId, HeaderTheme> = {
  [HEADER_THEME_ID.LOL]: lolTheme,
  [HEADER_THEME_ID.SERIES]: seriesTheme,
  [HEADER_THEME_ID.CARTOONS]: cartoonsTheme,
}

// Tierlists created before themes existed have no meta.theme and keep the LoL look.
export const DEFAULT_HEADER_THEME_ID: HeaderThemeId = HEADER_THEME_ID.LOL

export function getHeaderTheme(
  themeId: HeaderThemeId | undefined
): HeaderTheme {
  const theme: HeaderTheme | undefined =
    HEADER_THEMES[themeId ?? DEFAULT_HEADER_THEME_ID]

  return theme ?? HEADER_THEMES[DEFAULT_HEADER_THEME_ID]
}

export const HEADER_THEME_OPTIONS = Object.values(HEADER_THEMES).map(
  (theme) => ({
    value: theme.id,
    label: theme.label,
  })
)
