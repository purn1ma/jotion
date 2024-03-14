"use client"

import Image from 'next/image'
import { getAuthSession } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { PlusCircle } from 'lucide-react'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateDocumentPayload } from '@/lib/validators/document'

const Page = () => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  // spliting username = ["Pratham", "Sahu"]
  const username = session?.user.name?.split(" ")

  const { mutate: onCreate, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateDocumentPayload = {
        title: ""
      }
      const { data } = await axios.post('/api/document/create', payload)
      return data as string
    },
    onError: (err) => {
      if(err instanceof AxiosError) {
        if(err.response?.status === 401) {
          return toast.error("Login Required.")
        }
      }
      toast.error("Failed to create new Note")
    },
    onSuccess: () => {
      toast.success("New note created!")
      queryClient.invalidateQueries(["document"])
    }
  })
  
  return (
    <div className='h-full flex flex-col items-center justify-center space-y-4'>
      {/* For Light Mode */}
      <Image
        src="/empty.png"
        alt="Empty"
        height={300}
        width={300}
        className='dark:hidden'
      />

      {/* For Dark Mode */}
      <Image
        src="/empty-dark.png"
        alt="Empty"
        height={300}
        width={300}
        className='hidden dark:block'
      />

      <h2 className='text-lg font-med'>
        Welcome to {username && username[0]}&apos;s Jotion
      </h2>

      <Button onClick={() => onCreate()} isLoading={isLoading}>
        <PlusCircle className='h-4 w-4 mr-2' />
        Create a note
      </Button>
    </div>
  )
}

export default Page