"use client"

import { document } from '@/types/document'
import { ElementRef, FC, useRef, useState } from 'react'
import { IconPicker } from './IconPicker'
import { Button } from './ui/Button'
import { ImageIcon, Smile, X } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateDocumentPayload } from '@/lib/validators/document'
import axios from 'axios'
import { toast } from 'sonner'
import TextareaAutosize from "react-textarea-autosize";
import { useCoverImage } from '@/hooks/use-cover-image'

interface ToolbarProps {
  initialData: document,
  preview?: boolean
}

const Toolbar: FC<ToolbarProps> = ({ initialData, preview }) => {
  const queryClient = useQueryClient()
  const inputRef = useRef<ElementRef<"textarea">>(null)
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);

  const coverImage = useCoverImage();

  const { mutate: updateDocument } = useMutation({
    mutationFn: async ({ icon, value }: { icon?: string | undefined, value?: string | undefined }) => {
      const payload: UpdateDocumentPayload = {
        id: initialData.id,
        title: value || "Untitled",
        icon,
      }
      const { data } = await axios.patch('/api/document/update', payload)
      return data as document
    },
    onError: () => {
      toast.error("Error occured")
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["document"])
      queryClient.invalidateQueries(["getDocument", "getById", initialData.id])
    }
  })


  const { mutate: onRemoveIcon } = useMutation({
    mutationFn: async () => {
      const payload = {
        documentId: initialData.id,
      }
      const { data } = await axios.patch('/api/document/update/removeIcon', payload)
      return data as document
    },
    onError: () => {
      toast.error("Error occured")
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["document"])
      queryClient.invalidateQueries(["getDocument", "getById", initialData.id])
    }
  })
 
  const disableInput = () => setIsEditing(false);

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };

  const onInput = (value: string) => {
    setValue(value);
    updateDocument({
      value
    });
  };

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };

  return (
    <div className="pl-[54px] group relative">
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker updateDocument={updateDocument}>
            <p className="text-6xl hover:opacity-75 transition">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={() => onRemoveIcon()}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            variant="outline"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* guest is looking it */}
      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">
          {initialData.icon}
        </p>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <IconPicker asChild updateDocument={updateDocument}>
            <Button
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
            >
              <Smile className="h-4 w-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            onClick={coverImage.onOpen}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
        >
          {initialData.title}
        </div>
      )}
    </div>
  )
}

export default Toolbar