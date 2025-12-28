import { TierlistList } from '@/app/imports/App.components'
import { Container } from '@mantine/core'

export function DashboardPage() {
  return (
    <Container size="xl" py="xl">
      <TierlistList />
    </Container>
  )
}
