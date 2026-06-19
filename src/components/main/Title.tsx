"use client"

import { document } from '@/types/document'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { FC, useRef, useState } from 'react'
import { Button } from '../ui/Button'
import { UpdateDocumentPayload } from '@/lib/validators/document'
import { Input } from '../ui/input'
import { Skeleton } from '../ui/skeleton'

interface TitleProps {
  initialData: document
}

const Title: FC<TitleProps> = ({ initialData }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const queryClient = useQueryClient()
  const [title, setTitle] = useState(initialData.title);
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateTitle } = useMutation({
    mutationFn: async ({ id, title }: { id: string, title: string}) => {
      const payload: UpdateDocumentPayload = {
        id,
        title
      }
      const { data } = await axios.patch("/api/document/update", payload)
      return data as document
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["document"])
      queryClient.invalidateQueries(["getDocument", "getById", initialData.id])
    }
  })

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      clearTimeout(debounceRef.current);
      disableInput();
      updateTitle({ id: initialData.id, title: title || "Untitled" })
    }
  };

  const enableInput = () => {
    setTitle(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
    }, 0);
  };

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newTitle = event.target.value;
    setTitle(newTitle);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateTitle({ id: initialData.id, title: newTitle || "Untitled" });
    }, 300);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  return (
    <div className='flex items-center gap-x-1'>
      {/* Initial icon */}
      {!!initialData.icon && <p>{initialData.icon}</p>}

      {isEditing ? (
        <Input
        ref={inputRef}
        onClick={enableInput}
        onBlur={disableInput}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={title}
        className="h-7 px-2 focus-visible:ring-transparent"
      />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-normal h-auto p-1"
        >
          <span className="truncate">
            {title}
          </span>
        </Button>
      )}
    </div>
  )
}

export function TitleSkeleton() {
  return (
    <Skeleton className='h-9 w-16 rounded-md' />
  )
}

export default Title