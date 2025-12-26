import { UIText } from '@/features/UI'
import {
  Button,
  Card,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useNavigate } from 'react-router-dom'
import { validatePassword, validateUserNameOrEmail } from '../../Auth.model'
import type { AuthLoginRequest } from '../../Auth.types'
import { useAuthStore } from '../../store/Auth.store'

export function AuthLogin() {
  const navigate = useNavigate()
  const isLoginLoading = useAuthStore((state) => state.isLoginLoading)
  const loginError = useAuthStore((state) => state.loginError)
  const login = useAuthStore((state) => state.login)

  const form = useForm<AuthLoginRequest>({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: validateUserNameOrEmail,
      password: validatePassword,
    },
  })

  const handleSubmit = async (values: AuthLoginRequest) => {
    try {
      await login(values)
      navigate('/app/game')
    } catch {
      return
    }
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder miw={360}>
      <Title order={2} ta="center" mb="md">
        Login
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Email / Username"
            placeholder="Enter email or username"
            {...form.getInputProps('username')}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter password"
            {...form.getInputProps('password')}
          />

          <UIText size="sm" c="red">
            {loginError}
          </UIText>

          <Button type="submit" loading={isLoginLoading} color="teal" fullWidth>
            Sign In
          </Button>
        </Stack>
      </form>
    </Card>
  )
}
