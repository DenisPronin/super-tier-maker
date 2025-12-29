import { Anchor, Breadcrumbs, Button, Group, Title } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import {
  selectTierlist,
  useTierlistEditorStore,
} from '../../store/TierlistEditor.store'

export function TierlistHeader() {
  const tierlist = useTierlistEditorStore(selectTierlist)
  const openMetaModal = useTierlistEditorStore((state) => state.openMetaModal)

  if (!tierlist) return null

  const breadcrumbItems = [
    { title: 'Dashboard', href: '/app/dashboard' },
    { title: tierlist.title, href: null },
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

        <Title order={2}>{tierlist.title}</Title>
      </div>

      <Button leftSection={<IconEdit size={18} />} onClick={openMetaModal}>
        Edit
      </Button>
    </Group>
  )
}
