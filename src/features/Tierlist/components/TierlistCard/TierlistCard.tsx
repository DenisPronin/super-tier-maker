import { type MouseEvent } from 'react'
import {
  ActionIcon,
  Card,
  Center,
  Group,
  Image,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core'
import { IconEdit, IconPlayerPlay } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { getPreviewUrl } from '../../Tierlist.model'
import type { TierList } from '../../Tierlist.types'
import { TierlistDeleteControl } from '../TierlistDeleteControl/TierlistDeleteControl'

interface TierlistCardProps {
  tierlist: TierList
}

export function TierlistCard({ tierlist }: TierlistCardProps) {
  const navigate = useNavigate()
  const theme = useMantineTheme()

  const previewUrl = getPreviewUrl(
    tierlist.preview_path,
    tierlist.preview_updated_at
  )

  const handleEdit = () => {
    navigate(`/app/tierlist/${tierlist.id}/edit`)
  }

  const handlePlay = (e: MouseEvent) => {
    e.stopPropagation()
    navigate(`/app/tierlist/${tierlist.id}/play`)
  }

  const handleEditClick = (e: MouseEvent) => {
    e.stopPropagation()
    handleEdit()
  }

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ cursor: 'pointer' }}
      onClick={handleEdit}
    >
      <Stack gap="xs">
        <Card.Section>
          {previewUrl ? (
            <Image src={previewUrl} h={160} alt={tierlist.title} fit="cover" />
          ) : (
            <Center
              h={160}
              style={{
                background: `linear-gradient(135deg, ${theme.colors.blue[6]} 0%, ${theme.colors.cyan[6]} 100%)`,
              }}
            >
              <Text size="64px" fw={700} c="white">
                {tierlist.title.charAt(0).toUpperCase()}
              </Text>
            </Center>
          )}
        </Card.Section>

        <Group justify="space-between" align="flex-start">
          <Text fw={600} size="lg">
            {tierlist.title}
          </Text>
          <Group gap="xs">
            <ActionIcon variant="subtle" onClick={handlePlay}>
              <IconPlayerPlay size={18} />
            </ActionIcon>
            <ActionIcon variant="subtle" onClick={handleEditClick}>
              <IconEdit size={18} />
            </ActionIcon>
            <TierlistDeleteControl
              tierlistId={tierlist.id}
              tierlistTitle={tierlist.title}
            />
          </Group>
        </Group>

        {tierlist.meta.description && (
          <Text size="sm" c="dimmed" lineClamp={2}>
            {tierlist.meta.description}
          </Text>
        )}
      </Stack>
    </Card>
  )
}
