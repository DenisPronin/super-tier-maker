import { Flex, Image, Text } from '@mantine/core'
import {
  selectTierlist,
  useTierlistEditorStore,
} from '../../store/TierlistEditor.store'

export function TierlistPlayHeader() {
  const tierlist = useTierlistEditorStore(selectTierlist)

  const leftImages = [
    '/alf.gif',
    '/brooklyn.gif',
    '/sabrina.gif',
    '/danger.gif',
    '/danger.gif',
    '/danger.gif',
    '/danger.gif',
    '/danger.gif',
  ]

  const rightImages = [
    '/danger.gif',
    '/danger.gif',
    '/danger.gif',
    '/danger.gif',
    '/danger.gif',
    '/danger.gif',
    '/danger.gif',
    '/danger.gif',
  ]

  const renderImages = (images: string[]) =>
    images.map((src, index) => (
      <Image
        key={`${src}-${index}`}
        src={src}
        height={60}
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
      style={{ overflow: 'hidden' }}
      mb="md"
      mt="md"
    >
      <Flex gap="sm" style={{ overflow: 'hidden', flexShrink: 1 }}>
        {renderImages(leftImages)}
      </Flex>

      <Text
        size="xl"
        style={{
          fontSize: '3rem',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          fontWeight: 700,
          marginLeft: '16px',
          marginRight: '16px',
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
