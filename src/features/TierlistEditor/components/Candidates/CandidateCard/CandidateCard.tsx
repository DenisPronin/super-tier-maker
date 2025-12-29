import { Card, Image, Stack, Text } from '@mantine/core'
import type { Candidate } from '../../../TierlistEditor.types'

interface CandidateCardProps {
  candidate: Candidate
  size?: 'small' | 'normal'
}

export function CandidateCard({
  candidate,
  size = 'normal',
}: CandidateCardProps) {
  const isSmall = size === 'small'
  const cardWidth = isSmall ? 100 : 120
  const cardHeight = isSmall ? 133 : 160

  return (
    <Card shadow="sm" padding="xs" radius="md" withBorder w={cardWidth}>
      <Card.Section>
        {candidate.preview_url ? (
          <Image
            src={candidate.preview_url}
            h={cardHeight}
            alt={candidate.title}
            fit="cover"
          />
        ) : (
          <div style={{ height: cardHeight, backgroundColor: '#e9ecef' }} />
        )}
      </Card.Section>

      <Stack gap={4} mt="xs">
        <Text size="sm" fw={500} truncate lineClamp={1}>
          {candidate.title}
        </Text>

        {candidate.year && (
          <Text size="xs" c="dimmed" lineClamp={1}>
            {candidate.comment}, {candidate.year}
          </Text>
        )}
      </Stack>
    </Card>
  )
}
