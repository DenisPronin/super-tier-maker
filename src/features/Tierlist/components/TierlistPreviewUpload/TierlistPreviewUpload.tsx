import { useState } from 'react'
import { Button, FileButton, Group, Image, Stack, Text } from '@mantine/core'
import { IconPhoto, IconUpload } from '@tabler/icons-react'

interface TierlistPreviewUploadProps {
  tierlistId: string
  currentPreviewUrl: string | null
  onUpload: (file: File | null) => void
  isLoading?: boolean
  error?: string | null
}

const MAX_FILE_SIZE = 10 * 1024 * 1024

export function TierlistPreviewUpload({
  tierlistId,
  currentPreviewUrl,
  onUpload,
  isLoading,
  error,
}: TierlistPreviewUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const isCreateMode = tierlistId === 'temp'

  const handleFileSelect = (file: File | null) => {
    setValidationError(null)

    if (!file) {
      setSelectedFile(null)
      setPreviewUrl(null)
      if (isCreateMode) {
        onUpload(null)
      }
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setValidationError('File size must be less than 10MB')
      setSelectedFile(null)
      setPreviewUrl(null)
      if (isCreateMode) {
        onUpload(null)
      }
      return
    }

    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    if (isCreateMode) {
      onUpload(file)
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile)
      setSelectedFile(null)
      setPreviewUrl(null)
    }
  }

  const displayUrl = previewUrl || currentPreviewUrl

  return (
    <Stack gap="sm">
      {displayUrl && (
        <Image src={displayUrl} alt="Preview" h={200} fit="cover" radius="md" />
      )}

      <Group gap="xs">
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

        {!isCreateMode && selectedFile && (
          <Button
            leftSection={<IconUpload size={18} />}
            onClick={handleUpload}
            loading={isLoading}
          >
            Upload Preview
          </Button>
        )}
      </Group>

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
