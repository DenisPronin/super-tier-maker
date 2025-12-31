import { AppShell } from '@mantine/core'
import { Outlet } from 'react-router-dom'

export function LayoutEmpty() {
  return (
    <AppShell padding="md">
      <AppShell.Main pb="xl">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
