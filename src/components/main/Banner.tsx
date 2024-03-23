"use client";

import { useParams, useRouter } from "next/navigation";
import { FC } from "react";
import { Button } from "../ui/Button";
import { ConfirmModal } from "../modals/ConfirmModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

interface BannerProps {
  documentId: string;
}

const Banner: FC<BannerProps> = ({ documentId }) => {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();

  const { mutate: onRestore } = useMutation({
    mutationFn: async () => {
      const payload = {
        documentId
      }
      await axios.patch("/api/document/archive/restoreArchive", payload);
    },
    onError: () => {
      toast.error("Failed to restore note.");
    },
    onSuccess: () => {
      toast.success("Note restored!");
      queryClient.invalidateQueries(["document", "archive"]);
      queryClient.invalidateQueries(["document"]);
      router.refresh()
    },
  });
 
  const { mutate: onRemove } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/document/delete/${documentId}`);

      if (params.documentId === documentId) {
        router.push("/documents");
      }
    },
    onError: () => {
      toast.error("Failed to delete document");
    },
    onSuccess: () => {
      toast.success("Note deleted!");
      queryClient.invalidateQueries(["document", "archive"]);
    },
  });


  return (
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
      <p>This page is in Trash.</p>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onRestore()}
        className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
      >
        Restore page
      </Button>
      <ConfirmModal onConfirm={() => onRemove()}>
        <Button
          size="sm"
          className="font-normal"
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default Banner;
