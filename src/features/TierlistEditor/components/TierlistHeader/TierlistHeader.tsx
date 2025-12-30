import { Anchor, Breadcrumbs, Button, Group, Title } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import {
  selectTierlist,
  useTierlistEditorStore,
} from '../../store/TierlistEditor.store'
import { TierlistResetControl } from '../TierlistResetControl/TierlistResetControl'

export function TierlistHeader() {
  const tierlist = useTierlistEditorStore(selectTierlist)
  const openMetaModal = useTierlistEditorStore((state) => state.openMetaModal)

  if (!tierlist.data) return null

  const breadcrumbItems = [
    { title: 'Dashboard', href: '/app/dashboard' },
    { title: tierlist.data.title, href: null },
  ]

  return (
    <Group justify="space-between" align="flex-start">
      <div>
        <Breadcrumbs mb="xs">
          {breadcrumbItems.map((item, index) =>
            item.href ? (
              <Anchor key={index} component={Link} to={item.href}>
                {item.title}
              </Anchor>
            ) : (
              <span key={index}>{item.title}</span>
            )
          )}
        </Breadcrumbs>

        <Title order={2}>{tierlist.data.title}</Title>
      </div>

      <Group gap="xs">
        <TierlistResetControl />

        <Button leftSection={<IconEdit size={18} />} onClick={openMetaModal}>
          Edit
        </Button>
      </Group>
    </Group>
  )
}
