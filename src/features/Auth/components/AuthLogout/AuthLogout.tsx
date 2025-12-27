import { Button } from '@mantine/core'
import { logout } from '../../store/Auth.store'

export function AuthLogout() {
  return <Button onClick={logout}>Logout</Button>
}
