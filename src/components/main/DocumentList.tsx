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
  initialDocuments?: document[];
}

const DocumentList: FC<DocumentListProps> = ({
  parentDocumentId,
  level = 0,
  initialDocuments,
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

  const { data: documents, error } = useQuery({
    queryKey: ["document", parentDocumentId ?? null],
    queryFn: async () => {
      try {
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
        const data = doc?.data;
        if (!Array.isArray(data)) {
          console.warn("[DocumentList] Expected array from API, got:", typeof data, data);
          return [] as document[];
        }
        return data as document[];
      } catch (err) {
        console.error("[DocumentList] Failed to fetch documents:", err);
        return [] as document[];
      }
    },
    // Use server-prefetched data on first render (root list only)
    initialData: level === 0 && !parentDocumentId ? initialDocuments : undefined,
    staleTime: 30 * 1000,
  });

  const onRedirect = (doc: { id: string; slug: string | null }) => {
    router.push(`/documents/${doc.slug ?? doc.id}`);
  };

  if (!documents || !Array.isArray(documents)) {
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
  if (error) {
    console.error("[DocumentList] Query error:", error);
  }

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
                onRedirect(document);
                queryClient.invalidateQueries([
                  "getDocument",
                  "getById",
                  document.slug ?? document.id,
                ]);
              }}
              label={document.title}
              icon={FileIcon}
              documentIcon={document.icon || ""}
              active={params.documentId === (document.slug ?? document.id)}
              level={level}
              onExpand={() => onExpand(document.id)}
              expanded={expanded[document.id]}
            />
            {!!expanded[document.id] && (
              <DocumentList parentDocumentId={document.id} level={level + 1} />
            )}
          </div>
        ))}
    </>
  );
};

export default DocumentList;
