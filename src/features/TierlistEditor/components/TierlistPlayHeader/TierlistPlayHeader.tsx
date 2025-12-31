import { Box, Text } from '@mantine/core'
import {
  selectTierlist,
  useTierlistEditorStore,
} from '../../store/TierlistEditor.store'

export function TierlistPlayHeader() {
  const tierlist = useTierlistEditorStore(selectTierlist)

  return (
    <Box p="md" bg="dark.7">
      <Text ta="center" size="xl" fw={700}>
        {tierlist.data?.title}
      </Text>
    </Box>
  )
}
