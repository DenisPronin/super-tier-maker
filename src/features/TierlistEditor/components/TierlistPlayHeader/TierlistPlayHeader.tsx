import {
  type HeaderTheme,
  SIDE_IMAGES_SOURCE,
} from '@/features/Tierlist/themes/HeaderTheme.types'
import { getHeaderTheme } from '@/features/Tierlist/themes/HeaderThemes'
import { isDecember } from '@/utils/date'
import { Flex, Image, Text } from '@mantine/core'
import { type CSSProperties, useMemo } from 'react'
import {
  selectCandidates,
  selectTierlist,
  useTierlistEditorStore,
} from '../../store/TierlistEditor.store'
import type { Candidate } from '../../TierlistEditor.types'
import './TierlistPlayHeader.css'

const IMAGE_HEIGHT = 80
const MARQUEE_SECONDS_PER_IMAGE = 2
const MARQUEE_MIN_SECONDS = 20

// Seasonal override applied on top of any theme.
const CHRISTMAS_TITLE_STYLE: CSSProperties = {
  fontFamily: 'PWChristmas, sans-serif',
  background: 'linear-gradient(90deg, #e11d48, #16a34a)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

type StripDirection = 'left' | 'right'

interface SideImageLists {
  left: string[]
  right: string[]
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const swapped = result[index]
    result[index] = result[swapIndex]
    result[swapIndex] = swapped
  }

  return result
}

function resolveSideImages(
  theme: HeaderTheme,
  candidates: Candidate[]
): SideImageLists {
  if (theme.sideImages.type === SIDE_IMAGES_SOURCE.STATIC) {
    return { left: theme.sideImages.left, right: theme.sideImages.right }
  }

  const posters = shuffle(
    candidates
      .map((candidate) => candidate.preview_url)
      .filter((previewUrl): previewUrl is string => Boolean(previewUrl))
  )
  const half = Math.ceil(posters.length / 2)

  return { left: posters.slice(0, half), right: posters.slice(half) }
}

interface HeaderImageStripProps {
  images: string[]
  direction: StripDirection
  marquee: boolean
}

function HeaderImageStrip({
  images,
  direction,
  marquee,
}: HeaderImageStripProps) {
  if (images.length === 0) return null

  const renderCopy = (copyKey: string) => (
    <div className="play-header-strip__copy" key={copyKey}>
      {images.map((src, index) => (
        <Image
          key={`${src}-${index}`}
          src={src}
          height={IMAGE_HEIGHT}
          fit="contain"
          radius="sm"
          style={{ width: 'auto' }}
        />
      ))}
    </div>
  )

  const durationSeconds = Math.max(
    MARQUEE_MIN_SECONDS,
    images.length * MARQUEE_SECONDS_PER_IMAGE
  )

  return (
    <div
      className="play-header-strip"
      data-direction={direction}
      data-marquee={marquee}
      style={{ '--marquee-duration': `${durationSeconds}s` } as CSSProperties}
    >
      <div className="play-header-strip__track">
        {renderCopy('first')}
        {marquee && renderCopy('second')}
      </div>
    </div>
  )
}

export function TierlistPlayHeader() {
  const tierlist = useTierlistEditorStore(selectTierlist)
  const candidates = useTierlistEditorStore(selectCandidates)
  const december = isDecember()

  const theme = getHeaderTheme(tierlist.data?.meta.theme)
  const titleStyle = december ? CHRISTMAS_TITLE_STYLE : theme.titleStyle
  const title = theme.titleOverride ?? tierlist.data?.title

  // Depends on the store array reference so the shuffled order survives re-renders.
  const candidateList = candidates.data
  const sideImages = useMemo(
    () => resolveSideImages(theme, candidateList ?? []),
    [theme, candidateList]
  )

  return (
    <Flex
      justify="center"
      align="center"
      gap="sm"
      h={`${IMAGE_HEIGHT}px`}
      mt="lg"
      style={{ overflow: 'hidden' }}
    >
      <HeaderImageStrip
        images={sideImages.left}
        direction="left"
        marquee={theme.marquee}
      />

      <Text
        size="xl"
        style={{
          fontSize: '4rem',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          marginLeft: '16px',
          marginRight: '16px',
          ...titleStyle,
        }}
      >
        {title}
      </Text>

      <HeaderImageStrip
        images={sideImages.right}
        direction="right"
        marquee={theme.marquee}
      />
    </Flex>
  )
}
