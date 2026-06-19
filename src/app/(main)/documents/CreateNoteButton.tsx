"use client"

import { Button } from '@/components/ui/Button'
import { CreateDocumentPayload } from '@/lib/validators/document'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { PlusCircle } from 'lucide-react'
import { toast } from 'sonner'

const CreateNoteButton = () => {
  const queryClient = useQueryClient()

  const { mutate: onCreate, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateDocumentPayload = { title: "" }
      const { data } = await axios.post('/api/document/create', payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast.error("Login Required.")
        }
      }
      toast.error("Failed to create new Note")
    },
    onSuccess: () => {
      toast.success("New note created!")
      queryClient.invalidateQueries(["document"])
    },
  })

  return (
    <Button onClick={() => onCreate()} isLoading={isLoading}>
      <PlusCircle className='h-4 w-4 mr-2' />
      Create a note
    </Button>
  )
}

export default CreateNoteButton
