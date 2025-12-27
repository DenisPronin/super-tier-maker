import { AuthUserMenu } from '@/app/imports/App.components'
import { AppShell, Flex, Title } from '@mantine/core'
import { Outlet } from 'react-router-dom'

export function LayoutMain() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header p="xs">
        <Flex justify="space-between" align="center" h="100%">
          <Title order={2}>TierMaker</Title>
          <AuthUserMenu />
        </Flex>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
