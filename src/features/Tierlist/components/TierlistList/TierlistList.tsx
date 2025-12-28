import { useAuthStore } from '@/app/imports/App.store'
import { Button, Grid, Group, Loader, Stack, Text, Title } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useEffect } from 'react'
import { selectTierlists, useTierlistStore } from '../../store/Tierlist.store'
import { TierlistCard } from '../TierlistCard/TierlistCard'
import { TierlistCreateModal } from '../TierlistCreateModal/TierlistCreateModal'

export function TierlistList() {
  const user = useAuthStore((state) => state.user)
  const tierlists = useTierlistStore(selectTierlists)
  const fetchTierLists = useTierlistStore((state) => state.fetchTierLists)
  const openCreateModal = useTierlistStore((state) => state.openCreateModal)

  useEffect(() => {
    if (user) {
      fetchTierLists(user.id)
    }
  }, [user?.id, fetchTierLists])

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <Title order={1}>My Tier Lists</Title>
        <Button leftSection={<IconPlus size={18} />} onClick={openCreateModal}>
          Create Tier List
        </Button>
      </Group>

      {tierlists.isLoading && (
        <Group justify="center" py="xl">
          <Loader size="lg" />
        </Group>
      )}

      {!tierlists.isLoading &&
        (!tierlists.data || tierlists.data.length === 0) && (
          <Stack align="center" py="xl">
            <Text size="lg" c="dimmed">
              No tier lists yet. Create your first one!
            </Text>
          </Stack>
        )}

      {!tierlists.isLoading && tierlists.data && tierlists.data.length > 0 && (
        <Grid>
          {tierlists.data.map((tierlist) => (
            <Grid.Col
              key={tierlist.id}
              span={{ base: 12, sm: 6, md: 4, lg: 3 }}
            >
              <TierlistCard tierlist={tierlist} />
            </Grid.Col>
          ))}
        </Grid>
      )}

      <TierlistCreateModal />
    </Stack>
  )
}
