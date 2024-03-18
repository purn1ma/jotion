"use client"

import { useTheme } from 'next-themes'
import { FC } from 'react'
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { useEdgeStore } from '@/lib/edgestore';
import "@blocknote/core/style.css";

interface EditorProps {
  updateContent: (content: string) => void
  initialContent?: string | null
  editable?: boolean
}
 
const Editor: FC<EditorProps> = ({ updateContent, initialContent, editable }) => {
  const { resolvedTheme } = useTheme()
  const { edgestore } = useEdgeStore()

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({
      file
    })

    return response.url
  }

  const editor = useBlockNote({
    editable,
    initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
    onEditorContentChange: (editor) => {
      updateContent(JSON.stringify(editor.topLevelBlocks, null, 2))
    },
    uploadFile: handleUpload
  })
  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  )
}

export default Editor