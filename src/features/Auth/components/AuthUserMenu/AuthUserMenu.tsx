import { ActionIcon, Avatar, Menu } from '@mantine/core'
import { IconUser } from '@tabler/icons-react'
import { logout } from '../../store/Auth.store'

export function AuthUserMenu() {
  const handleLogout = async () => {
    await logout()
  }

  return (
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
  )
}
