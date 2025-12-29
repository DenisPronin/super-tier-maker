import {
  Alert,
  Button,
  Modal,
  Stack,
  Table,
  Text,
  Textarea,
} from '@mantine/core'
import { useState } from 'react'
import {
  selectIsBulkImportModalOpen,
  useTierlistEditorStore,
} from '../../../store/TierlistEditor.store'
import type { CreateCandidateRequest } from '../../../TierlistEditor.types'

export function CandidateBulkImportModal() {
  const isOpen = useTierlistEditorStore(selectIsBulkImportModalOpen)
  const closeBulkImportModal = useTierlistEditorStore(
    (state) => state.closeBulkImportModal
  )
  const bulkCreateCandidates = useTierlistEditorStore(
    (state) => state.bulkCreateCandidates
  )

  const [jsonInput, setJsonInput] = useState('')
  const [parsedCandidates, setParsedCandidates] = useState<
    CreateCandidateRequest[]
  >([])
  const [error, setError] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  const handleParse = () => {
    try {
      const parsed = JSON.parse(jsonInput)

      if (!Array.isArray(parsed)) {
        setError('JSON must be an array')
        setParsedCandidates([])
        return
      }

      const candidates: CreateCandidateRequest[] = parsed.map(
        (item, index) => {
          if (!item.title) {
            throw new Error(`Item at index ${index} missing required field: title`)
          }

          return {
            title: item.title,
            comment: item.comment || undefined,
            year: item.year || undefined,
            preview_url: item.preview_url || undefined,
            url: item.url || undefined,
          }
        }
      )

      setParsedCandidates(candidates)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      setParsedCandidates([])
    }
  }

  const handleImport = async () => {
    if (parsedCandidates.length === 0) return

    setIsImporting(true)
    try {
      await bulkCreateCandidates(parsedCandidates)
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed')
    } finally {
      setIsImporting(false)
    }
  }

  const handleClose = () => {
    closeBulkImportModal()
    setJsonInput('')
    setParsedCandidates([])
    setError(null)
  }

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title="Bulk Import Candidates"
      size="xl"
    >
      <Stack>
        <Textarea
          label="Paste JSON array"
          placeholder='[{"title": "Item 1", "year": 2024, ...}, ...]'
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          rows={10}
          disabled={isImporting}
        />

        <Button onClick={handleParse} disabled={!jsonInput || isImporting}>
          Parse JSON
        </Button>

        {error && (
          <Alert color="red" title="Error">
            {error}
          </Alert>
        )}

        {parsedCandidates.length > 0 && (
          <>
            <Text size="sm" fw={500}>
              Preview ({parsedCandidates.length} candidates):
            </Text>

            <Table striped highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Title</Table.Th>
                  <Table.Th>Year</Table.Th>
                  <Table.Th>Comment</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {parsedCandidates.slice(0, 5).map((candidate, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>{candidate.title}</Table.Td>
                    <Table.Td>{candidate.year || '-'}</Table.Td>
                    <Table.Td>{candidate.comment || '-'}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            {parsedCandidates.length > 5 && (
              <Text size="xs" c="dimmed">
                ... and {parsedCandidates.length - 5} more
              </Text>
            )}

            <Button
              onClick={handleImport}
              loading={isImporting}
              fullWidth
              color="green"
            >
              Import {parsedCandidates.length} Candidates
            </Button>
          </>
        )}
      </Stack>
    </Modal>
  )
}
