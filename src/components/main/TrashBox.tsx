"use client";

import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { FC, useState } from "react";
import { document } from "./Navigation";
import { Spinner } from "../Spinner";
import { Search, Trash, Undo } from "lucide-react";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { ConfirmModal } from "../modals/ConfirmModal";

interface TrashBoxProps {}

const TrashBox: FC<TrashBoxProps> = ({}) => {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  // Get all archive documents
  const { data: archivedDocuments } = useQuery({
    queryKey: ["document", "archive"],
    queryFn: async () => {
      const { data: archivedDocuments } = await axios.get(
        "/api/document/archive/getArchive"
      );
      return archivedDocuments as document[];
    },
  });

  // Restoring Archive documents by ID
  const { mutate: onRestore } = useMutation({
    mutationFn: async (documentId: string) => {
      const payload = {
        documentId,
      };
      await axios.patch("/api/document/archive/restoreArchive", payload);
    },
    onError: () => {
      toast.error("Failed to restore note.");
    },
    onSuccess: () => {
      toast.success("Note restored!");
      queryClient.invalidateQueries(["document", "archive"]);
      queryClient.invalidateQueries(["document"]);
    },
  });

  // Deleteing archive documents by ID
  const { mutate: onDelete } = useMutation({
    mutationFn: async (documentId: string) => {
      await axios.delete(`/api/document/delete/${documentId}`);

      // Find the way write below if statement in onSuccess
      if (params.documentId === documentId) {
        router.push("/documents");
      }
    },
    onError: () => {
      toast.error("Failed to delete note.");
    },
    onSuccess: () => {
      toast.success("Note deleted!");
      queryClient.invalidateQueries(["document", "archive"]);
    },
  });

  // searching for archived document according to user search
  const filteredArchivedDocuments = archivedDocuments?.filter((doc) => {
    return doc.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  if (archivedDocuments === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      {/* Search Bar */}
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title"
        />
      </div>

      <div className="mt-2 px-1 pb-1">
        {/* This will only be visible if it is the last element in list */}
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No documents found.
        </p>

        {/* Displaying Archived document */}
        {filteredArchivedDocuments?.map((doc) => (
          <div key={doc.id} className="flex items-center">
            <div
              role="button"
              onClick={() => onClick(doc.id)}
              className="text-sm rounded-sm w-full h-6 hover:bg-primary/5 text-primary justify-between "
            >
              <span className="truncate pl-2 items-center">{doc.title}</span>
            </div>
            {/* Undo Button */}
            <div className="flex items-center h-7">
              <div
                onClick={() => onRestore(doc.id)}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              {/* Delete Button */}
              <ConfirmModal onConfirm={() => onDelete(doc.id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrashBox;
