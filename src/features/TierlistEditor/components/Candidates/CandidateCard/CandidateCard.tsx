import { ActionIcon, Card, Image, Stack, Text } from '@mantine/core'
import { IconPlayerPlay } from '@tabler/icons-react'
import { useState } from 'react'
import type { Candidate } from '../../../TierlistEditor.types'

interface CandidateCardProps {
  candidate: Candidate
  size?: 'small' | 'normal'
  onClick?: (candidate: Candidate) => void
  onPlayClick?: (candidate: Candidate) => void
}

export function CandidateCard({
  candidate,
  size = 'normal',
  onClick,
  onPlayClick,
}: CandidateCardProps) {
  const isSmall = size === 'small'
  const cardWidth = isSmall ? 100 : 120
  const cardHeight = isSmall ? 133 : 160

  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    onClick?.(candidate)
  }

  const handlePlayClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (onPlayClick) {
      onPlayClick(candidate)
    }
  }

  return (
    <Card
      shadow="sm"
      padding="xs"
      radius="md"
      withBorder
      w={cardWidth}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.2s ease-in-out',
        position: 'relative',
      }}
    >
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

        {isHovered && candidate.url && onPlayClick && (
          <ActionIcon
            onClick={handlePlayClick}
            size="lg"
            radius="xl"
            variant="filled"
            color="dark"
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
            }}
          >
            <IconPlayerPlay size={20} />
          </ActionIcon>
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
