import { isDecember } from '@/utils/date'
import { Flex, Image, Text } from '@mantine/core'
import { useMemo } from 'react'
import {
  selectTierlist,
  useTierlistEditorStore,
} from '../../store/TierlistEditor.store'
import './TierlistPlayHeader.css'

export function TierlistPlayHeader() {
  const tierlist = useTierlistEditorStore(selectTierlist)
  const december = isDecember()

  const titleStyle = useMemo(() => {
    if (december) {
      return {
        fontFamily: 'PWChristmas, sans-serif',
        background: 'linear-gradient(90deg, #e11d48, #16a34a)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }
    }

    return {
      fontFamily: 'LolBold, sans-serif',
      background:
        'linear-gradient(180deg, #F0E6B2 0%, #C8AA6E 45%, #785A28 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      WebkitTextStroke: '1px #1C1004',
      filter: 'drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.8))',
    }
  }, [december])

  const leftImages = [
    '/lol/teemo.webp',
    '/lol/teemo.webp',
    '/lol/teemo.webp',
    '/lol/teemo.webp',
    '/lol/teemo.webp',
    '/lol/teemo.webp',
    '/lol/teemo.webp',
    '/lol/teemo.webp',
    '/lol/teemo.webp',
    '/lol/teemo.webp',
    '/lol/teemo.webp',
    '/lol/teemo.webp',
    '/lol/teemo.webp',
  ]

  const rightImages = [
    '/lol/teemo.webp',
    '/lol/teemo.webp',
    '/lol/teemo.webp',
    '/lol/teemo.webp',
    '/lol/teemo.webp',
    '/lol/teemo.webp',
    '/lol/teemo.webp',
    '/lol/teemo.webp',
    '/lol/teemo.webp',
    '/lol/teemo.webp',
    '/lol/teemo.webp',
    '/lol/teemo.webp',
    '/lol/teemo.webp',
  ]

  const renderImages = (images: string[]) =>
    images.map((src, index) => (
      <Image
        key={`${src}-${index}`}
        src={src}
        height={80}
        fit="contain"
        style={{ width: 'auto' }}
      />
    ))

  return (
    <Flex
      justify="center"
      align="center"
      gap="sm"
      h="80px"
      mt="lg"
      style={{ overflow: 'hidden' }}
    >
      <Flex gap="sm" style={{ overflow: 'hidden', flexShrink: 1 }}>
        {renderImages(leftImages)}
      </Flex>

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
        {tierlist.data?.title}
      </Text>

      <Flex gap="sm" style={{ overflow: 'hidden', flexShrink: 1 }}>
        {renderImages(rightImages)}
      </Flex>
    </Flex>
  )
}
