"use client"

import Toolbar from '@/components/Toolbar'
import { Cover } from '@/components/cover'
import { CoverSkeleton } from '@/components/cover'
import { Skeleton } from '@/components/ui/skeleton'
import { UpdateDocumentPayload } from '@/lib/validators/document'
import { document as DocumentType } from '@/types/document'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { FC } from 'react'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false })

interface DocumentEditorProps {
  params: { documentId: string }
  initialData: DocumentType
}

const DocumentEditor: FC<DocumentEditorProps> = ({ params, initialData }) => {
  const queryClient = useQueryClient()

  const { data: doc } = useQuery<DocumentType>({
    queryKey: ["getDocument", "getById", params.documentId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/document/getDocument/getById/${params.documentId}`)
      return data as DocumentType
    },
    initialData,
    staleTime: 30 * 1000,
  })

  const { mutate: updateContent } = useMutation({
    mutationFn: async (content: string) => {
      const payload: UpdateDocumentPayload = {
        id: initialData.id,
        content,
      }
      const { data } = await axios.patch('/api/document/update', payload)
      return data as DocumentType
    },
    onError: () => {
      toast.error("Error occured")
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["getDocument", "getById", params.documentId], updated)
    },
  })

  if (!doc) {
    return (
      <div>
        <CoverSkeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Cover url={doc.coverImage || ""} />
      <div>
        <Toolbar initialData={doc} />
        <Editor
          updateContent={updateContent}
          initialContent={doc.content}
        />
      </div>
    </div>
  )
}

export default DocumentEditor
