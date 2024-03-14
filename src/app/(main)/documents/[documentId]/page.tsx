"use client"

import Editor from '@/components/Editor'
import Toolbar from '@/components/Toolbar'
import { Cover, CoverSkeleton } from '@/components/cover'
import { Skeleton } from '@/components/ui/skeleton'
import { UpdateDocumentPayload } from '@/lib/validators/document'
import { document } from '@/types/document'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { FC, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'


interface pageProps {
  params: {
    documentId: string
  }
}

const Page: FC<pageProps> = ({ params }) => {

  const editor = useMemo(() => dynamic(() => import("@/components/Editor"), { ssr: false }), [])

  const { data: document } = useQuery({
    queryKey: ["getDocument", "getById", params.documentId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/document/getDocument/getById/${params.documentId}`)
      return data as document
    }
  })

  const { mutate: updateContent } = useMutation({
    mutationFn: async (content: string) => {
      const payload: UpdateDocumentPayload = {
        id: params.documentId,
        content,
      }
      const { data } = await axios.patch('/api/document/update', payload)
      return data as document
    },
    onError: () => {
      toast.error("Error occured")
    },
    onSuccess: () => {
      // queryClient.invalidateQueries(["document"])
    }
  })

  if (document === undefined) {
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
    );
  }

  return (
    <div>
      <Cover url={document.coverImage || ""} />
      <div>
        <Toolbar initialData={document} />
        <Editor
          updateContent={updateContent}
          initialContent={document.content}
        />
      </div>
    </div>
  )
}

export default Page