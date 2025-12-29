import { Button, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { IconFileImport, IconPlus } from '@tabler/icons-react'
import { useShallow } from 'zustand/react/shallow'
import {
  selectUnplacedCandidates,
  useTierlistEditorStore,
} from '../../../store/TierlistEditor.store'
import { CandidateCard } from '../CandidateCard/CandidateCard'

export function UnplacedCandidatesList() {
  const unplacedCandidates = useTierlistEditorStore(
    useShallow(selectUnplacedCandidates)
  )
  const openCandidateModal = useTierlistEditorStore(
    (state) => state.openCandidateModal
  )
  const openBulkImportModal = useTierlistEditorStore(
    (state) => state.openBulkImportModal
  )

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Group gap="xs">
          <Title order={4}>Candidates</Title>
          <Text size="sm" c="dimmed">
            ({unplacedCandidates.length})
          </Text>
        </Group>

        <Group gap="xs">
          <Button
            leftSection={<IconFileImport size={18} />}
            onClick={() => openBulkImportModal()}
            size="sm"
            variant="light"
          >
            Import JSON
          </Button>

          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => openCandidateModal()}
            size="sm"
          >
            Add Candidate
          </Button>
        </Group>
      </Group>

      {unplacedCandidates.length > 0 ? (
        <SimpleGrid cols={{ base: 3, sm: 4, md: 6, lg: 8 }} spacing="sm">
          {unplacedCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </SimpleGrid>
      ) : (
        <Text c="dimmed" ta="center" py="xl">
          No unplaced candidates
        </Text>
      )}
    </Stack>
  )
}
