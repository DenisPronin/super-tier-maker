import { Flex } from '@mantine/core'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <Flex mih="100vh" justify="center" align="center">
      <Outlet />
    </Flex>
  )
}
