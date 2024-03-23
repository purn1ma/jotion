"use client";

import { document } from "@/types/document";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { FC, useState } from "react";
import Item, { ItemSkeleton } from "./Item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface DocumentListProps {
  parentDocumentId?: string | null;
  level?: number;
  data?: document[];
}

const DocumentList: FC<DocumentListProps> = ({
  parentDocumentId,
  level = 0,
}) => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [documentId]: !prev[documentId],
    }));
  };

  const { data: documents, isLoading } = useQuery({
    queryKey: ["document"],
    queryFn: async () => {
      let doc;
      if (!!parentDocumentId && parentDocumentId !== null) {
        doc = await axios.get(
          `/api/document/getDocument/getByParentId/${parentDocumentId}`
        );
      } else if (
        (parentDocumentId === null || parentDocumentId === undefined) &&
        level === 0
      ) {
        doc = await axios.get("/api/document/getDocument");
      }
      if (doc === undefined) {
        return [] as document[];
      }
      return doc?.data as document[];
    },
  });

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  if (documents === undefined) {
    return (
      <>
        <ItemSkeleton level={level} />
        {level === 0 && (
          <>
            <ItemSkeleton level={level} />
            <ItemSkeleton level={level} />
          </>
        )}
      </>
    );
  }
  console.log("Document", documents.length);
  console.log("ParentDocumentIdType", parentDocumentId);
  console.log("Expanded", expanded)

  return (
    <>
      {documents.length === 0 && (
        <p
          style={{
            paddingLeft: level ? `${level * 12 + 25}px` : undefined,
          }}
          className={cn(
            "hidden text-sm font-medium text-muted-foreground/80",
            expanded && "last:block",
            level === 0 && "hidden"
          )}
        >
          No pages inside
        </p>
      )}
      {documents.length > 0 &&
        documents.map((document) => (
          <div key={document.id}>
            <Item
              id={document.id}
              onClick={() => {
                onRedirect(document.id);
                queryClient.invalidateQueries([
                  "getDocument",
                  "getById",
                  document.id,
                ]);
              }}
              label={document.title}
              icon={FileIcon}
              documentIcon={document.icon || ""}
              active={params.documentId === document.id}
              level={level}
              onExpand={() => onExpand(document.id)}
              expanded={expanded[document.id]}
            />
            {/* {!!expanded[document.id] && (
              <DocumentList parentDocumentId={document.id} level={level + 1} />
            )} */}
          </div>
        ))}
    </>
  );
};

export default DocumentList;
