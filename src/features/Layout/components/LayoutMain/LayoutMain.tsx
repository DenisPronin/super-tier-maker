import { logout } from '@/features/Auth/store/Auth.store'
import { ActionIcon, AppShell, Avatar, Flex, Menu, Title } from '@mantine/core'
import { IconUser } from '@tabler/icons-react'
import { Outlet } from 'react-router-dom'

export function LayoutMain() {
  const handleLogout = async () => {
    await logout()
  }

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header p="xs">
        <Flex justify="space-between" align="center" h="100%">
          <Title order={2}>TierMaker</Title>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" size="lg" radius="xl">
                <Avatar size="sm" radius="xl">
                  <IconUser size={20} />
                </Avatar>
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={handleLogout}>Log Out</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
