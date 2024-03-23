"use client"

import { useSearch } from '@/hooks/use-search'
// import { document } from '@/types/document'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { useSession } from 'next-auth/react'
import { File } from 'lucide-react'

type document = {
  id: string
  title: string
  userId: string
  parentDocumentId: string | null
  isArchived: boolean 
  content: string | null
  coverImage: string | null 
  icon: string | null 
  isPublished: boolean 
}

const SearchCommand = () => {
  const router = useRouter()
  const { data: session } = useSession()

  const [isMounted, setIsMounted] = useState(false)

  const toggle = useSearch((store) => store.toggle)
  const isOpen = useSearch((store) => store.isOpen)
  const onClose = useSearch((store) => store.onClose)

  const { data: searchDocuments } = useQuery({
    queryKey: ["document", "getDocument", "searchDocument"],
    queryFn: async () => {
      const { data } = await axios.get("/api/document/getDocument/search")
      return data as document[]
    }
  })

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if(e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle])

  const onSelect = (id: string) => {
    router.push(`/documents/${id}`);
    onClose();
  };

  if(!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput
        placeholder={`Search ${session?.user.name}'s Jotion...`}
      />

      <CommandList>
        {/* If no record found */}
        <CommandEmpty>No result found.</CommandEmpty>
        <CommandGroup>
          {searchDocuments?.map((doc: any) => (
            // File Icon
            <CommandItem
              key={doc.id}
              value={`${doc.id}-${doc.title}`}
              title={doc.title}
              onSelect={() => onSelect(doc.id)}
            >
              {doc.icon ? (
                <p>
                  {doc.icon}
                </p>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}

              {/* Icon */}
              <span>{doc.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

export default SearchCommand