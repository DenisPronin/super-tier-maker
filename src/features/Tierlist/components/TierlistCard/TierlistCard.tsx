import { Card, Stack, Text } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import type { TierList } from '../../Tierlist.types'

interface TierlistCardProps {
  tierlist: TierList
}

export function TierlistCard({ tierlist }: TierlistCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/app/tierlist/${tierlist.id}/edit`)
  }

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ cursor: 'pointer' }}
      onClick={handleClick}
    >
      <Stack gap="xs">
        <Text fw={600} size="lg">
          {tierlist.title}
        </Text>

        {tierlist.meta.description && (
          <Text size="sm" c="dimmed" lineClamp={2}>
            {tierlist.meta.description}
          </Text>
        )}
      </Stack>
    </Card>
  )
}
