"use client"

import { useCoverImage } from "@/hooks/use-cover-image"
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog"
import { SingleImageDropzone } from "../SingleImageDropzone"
import { useState } from "react"
import { useEdgeStore } from "@/lib/edgestore"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { UpdateDocumentPayload } from "@/lib/validators/document"
import { document } from '@/types/document'
import axios from "axios"
import { toast } from "sonner"

export const CoverImageModal = () => {
  const [file, setFile] = useState<File>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const coverImage = useCoverImage()
  const { edgestore } = useEdgeStore()
  const queryClient = useQueryClient()
  const params = useParams()

  const { mutate: updateDocument } = useMutation({
    mutationFn: async (coverImage: string) => {
      const payload: UpdateDocumentPayload = {
        id: params.documentId as string,
        coverImage
      }
      const { data } = await axios.patch('/api/document/update', payload)
      return data as document
    },
    onError: () => {
      toast.error("Error occured")
    },
    onSuccess: () => {
      toast.success("Image upload successfull")
      queryClient.invalidateQueries(["getDocument", "getById", params.documentId])
    }
  })

  const onClose = () => {
    setFile(undefined)
    setIsSubmitting(false)
    coverImage.onClose()
  }

  const onChange = async (file?: File) => {
    if(file) {
      setIsSubmitting(true)
      setFile(file)

      let res;

      if(coverImage.url) {
        res = await edgestore.publicFiles.upload({
          file,
          options: {
            replaceTargetUrl: coverImage.url
          }
        })
      } else {
        res = await edgestore.publicFiles.upload({
          file
        })
      }

      updateDocument(res.url)

      onClose()
    }
  }

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader className="text-center text-lg font-semibold">
          <h2>
            CoverImage
          </h2>
        </DialogHeader>
        
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  )
}