import { Stack, Text, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { type ReactNode, useEffect, useState } from 'react'
import { validateTitle } from '../../Tierlist.model'
import { TierlistPreviewUpload } from '../TierlistPreviewUpload/TierlistPreviewUpload'

interface TierlistMetaFormValues {
  title: string
  description: string
}

interface TierlistMetaFormProps {
  initialValues?: Partial<TierlistMetaFormValues>
  currentPreviewUrl?: string | null
  tierlistId?: string
  onSubmit: (
    values: TierlistMetaFormValues,
    previewFile: File | null
  ) => void | Promise<void>
  isLoading?: boolean
  error?: string | null
  children?: ReactNode
}

export function TierlistMetaForm({
  initialValues,
  currentPreviewUrl = null,
  tierlistId = 'temp',
  onSubmit,
  isLoading = false,
  error = null,
  children,
}: TierlistMetaFormProps) {
  const [previewFile, setPreviewFile] = useState<File | null>(null)

  const form = useForm<TierlistMetaFormValues>({
    initialValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
    },
    validate: {
      title: validateTitle,
    },
  })

  useEffect(() => {
    if (initialValues) {
      form.setValues({
        title: initialValues.title || '',
        description: initialValues.description || '',
      })
    }
  }, [initialValues])

  const handleSubmit = async (values: TierlistMetaFormValues) => {
    await onSubmit(values, previewFile)
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Title"
          placeholder="Enter tier list title"
          required
          {...form.getInputProps('title')}
        />

        <Textarea
          label="Description"
          placeholder="Enter description (optional)"
          minRows={3}
          {...form.getInputProps('description')}
        />

        <TierlistPreviewUpload
          tierlistId={tierlistId}
          currentPreviewUrl={currentPreviewUrl}
          onUpload={setPreviewFile}
          isLoading={isLoading}
          error={null}
        />

        {error && (
          <Text size="sm" c="red">
            {error}
          </Text>
        )}

        {children}
      </Stack>
    </form>
  )
}
