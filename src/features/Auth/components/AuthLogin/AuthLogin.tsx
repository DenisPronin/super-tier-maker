import { UIText } from '@/features/UI'
import {
  Anchor,
  Button,
  Card,
  Divider,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useNavigate } from 'react-router-dom'
import { validateEmail, validatePassword } from '../../Auth.model'
import type { AuthEmailLoginRequest } from '../../Auth.types'
import { useAuthStore } from '../../store/Auth.store'

export function AuthLogin() {
  const navigate = useNavigate()
  const isLoginLoading = useAuthStore((state) => state.isLoginLoading)
  const loginError = useAuthStore((state) => state.loginError)
  const login = useAuthStore((state) => state.login)
  const signInWithGoogle = useAuthStore((state) => state.signInWithGoogle)

  const form = useForm<AuthEmailLoginRequest>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: validateEmail,
      password: validatePassword,
    },
  })

  const handleSubmit = async (values: AuthEmailLoginRequest) => {
    try {
      await login(values)
      navigate('/app/game')
    } catch {
      return
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      // OAuth redirects automatically
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
            label="Email"
            placeholder="Enter your email"
            {...form.getInputProps('email')}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            {...form.getInputProps('password')}
          />

          {loginError && (
            <UIText size="sm" c="red">
              {loginError}
            </UIText>
          )}

          <Button type="submit" loading={isLoginLoading} color="teal" fullWidth>
            Sign In
          </Button>

          <Divider label="OR" labelPosition="center" />

          <Button
            variant="outline"
            loading={isLoginLoading}
            onClick={handleGoogleSignIn}
            fullWidth
          >
            Sign in with Google
          </Button>

          <UIText ta="center" size="sm">
            Don't have an account?{' '}
            <Anchor href="/auth/register" component="a">
              Register here
            </Anchor>
          </UIText>
        </Stack>
      </form>
    </Card>
  )
}
