import { Card, Image, Stack, Text } from '@mantine/core'
import type { Candidate } from '../../../TierlistEditor.types'

interface CandidateCardProps {
  candidate: Candidate
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <Card shadow="sm" padding="xs" radius="md" withBorder w={100}>
      <Card.Section>
        {candidate.preview_url ? (
          <Image
            src={candidate.preview_url}
            h={133}
            alt={candidate.title}
            fit="cover"
          />
        ) : (
          <div style={{ height: 133, backgroundColor: '#e9ecef' }} />
        )}
      </Card.Section>

      <Stack gap={4} mt="xs">
        <Text size="sm" fw={500} lineClamp={2}>
          {candidate.title}
        </Text>

        {candidate.year && (
          <Text size="xs" c="dimmed">
            {candidate.year}
          </Text>
        )}
      </Stack>
    </Card>
  )
}
