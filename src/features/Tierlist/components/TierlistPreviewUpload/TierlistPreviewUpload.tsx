import { useState } from 'react'
import { Button, FileButton, Image, Stack, Text } from '@mantine/core'
import { IconPhoto } from '@tabler/icons-react'

interface TierlistPreviewUploadProps {
  tierlistId: string
  currentPreviewUrl: string | null
  onUpload: (file: File | null) => void
  isLoading?: boolean
  error?: string | null
}

const MAX_FILE_SIZE = 10 * 1024 * 1024

export function TierlistPreviewUpload({
  currentPreviewUrl,
  onUpload,
  error,
}: TierlistPreviewUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleFileSelect = (file: File | null) => {
    setValidationError(null)

    if (!file) {
      setSelectedFile(null)
      setPreviewUrl(null)
      onUpload(null)
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setValidationError('File size must be less than 10MB')
      setSelectedFile(null)
      setPreviewUrl(null)
      onUpload(null)
      return
    }

    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    onUpload(file)
  }

  const displayUrl = previewUrl || currentPreviewUrl

  return (
    <Stack gap="sm">
      {displayUrl && (
        <Image src={displayUrl} alt="Preview" h={200} fit="cover" radius="md" />
      )}

      <FileButton onChange={handleFileSelect} accept="image/*">
        {(props) => (
          <Button
            {...props}
            leftSection={<IconPhoto size={18} />}
            variant="light"
          >
            Select Image
          </Button>
        )}
      </FileButton>

      {selectedFile && (
        <Text size="xs" c="dimmed">
          {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
        </Text>
      )}

      {(validationError || error) && (
        <Text size="sm" c="red">
          {validationError || error}
        </Text>
      )}
    </Stack>
  )
}
