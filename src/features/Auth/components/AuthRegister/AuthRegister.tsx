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
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from '../../Auth.model'
import type { AuthRegisterRequest } from '../../Auth.types'
import { useAuthStore } from '../../store/Auth.store'

export function AuthRegister() {
  const navigate = useNavigate()
  const isLoginLoading = useAuthStore((state) => state.isLoginLoading)
  const loginError = useAuthStore((state) => state.loginError)
  const signUp = useAuthStore((state) => state.signUp)
  const signInWithGoogle = useAuthStore((state) => state.signInWithGoogle)

  const form = useForm<AuthRegisterRequest>({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      email: validateEmail,
      password: validatePassword,
      confirmPassword: (value, values) =>
        validateConfirmPassword(values.password, value),
    },
  })

  const handleSubmit = async (values: AuthRegisterRequest) => {
    try {
      await signUp(values)
      // Navigate to login or show success message
      navigate('/auth/login')
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
        Register
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

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            {...form.getInputProps('confirmPassword')}
          />

          {loginError && (
            <UIText size="sm" c="red">
              {loginError}
            </UIText>
          )}

          <Button type="submit" loading={isLoginLoading} color="teal" fullWidth>
            Register
          </Button>

          <Divider label="OR" labelPosition="center" />

          <Button
            variant="outline"
            loading={isLoginLoading}
            onClick={handleGoogleSignIn}
            fullWidth
          >
            Sign up with Google
          </Button>

          <UIText ta="center" size="sm">
            Already have an account?{' '}
            <Anchor href="/auth/login" component="a">
              Login here
            </Anchor>
          </UIText>
        </Stack>
      </form>
    </Card>
  )
}
