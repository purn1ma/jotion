"use client";

import { cn } from "@/lib/utils";
import { CreateDocumentPayload } from "@/lib/validators/document";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import { FC, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { document } from "@/types/document";
import { DropdownMenu, DropdownMenuSeparator } from "../ui/DropdownMenu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";

interface ItemProps {
  id?: string;
  documentIcon?: string;
  label: string;
  expanded?: boolean;
  onClick?: () => void;
  level?: number;
  icon: LucideIcon;
  active?: boolean;
  isSearch?: boolean;
  onExpand?: () => void;
}

const Item: FC<ItemProps> = ({
  id,
  label,
  expanded,
  level,
  active,
  isSearch,
  documentIcon,
  onClick,
  onExpand,
  icon: Icon,
}) => {
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session } = useSession();

  const [newDoc, setNewDoc] = useState<document>();

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand && onExpand();
  };

  const { mutate: onArchive } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.patch(`/api/document/archive/${id}`);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast.error("Login Required.");
        }
      }
      toast.error("Failed to Archive Note");
    },
    onSuccess: (data: string) => {
      toast.success("Note moved to trash!");
      router.refresh()
      router.push("/documents")
      queryClient.invalidateQueries(["document", "archive"])
      queryClient.invalidateQueries(["document"])
    },
  });

  const { mutate: onCreate } = useMutation({
    mutationFn: async () => {
      const payload: CreateDocumentPayload = {
        title: "Untitled",
        parentDocumentId: id,
      };
      const { data } = await axios.post("/api/document/create", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast.error("Login Required.");
        }
      }
      toast.error("Failed to create new Note");
    },
    onSuccess: (data: string) => {
      toast.success("New note created!");
      queryClient.invalidateQueries(["document"]);
      const parseData = JSON.parse(data);
      setNewDoc(parseData);
    },
  });

  // On Creating New note using Plus Icon
  const onCreateDoc = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;
    onCreate();
    console.log("Item Expanded",expanded)
    if (!expanded) {
      onExpand && onExpand();
    }
    // router.push(`/documents/${newDoc?.id}`)
  };

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
          onClick={handleExpand}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>

      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}

      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 border-black" align="start" side="right">
              <DropdownMenuItem onSelect={() => onArchive()}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by: {session?.user.name}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Plus Icon in each document used to create new Note */}
          <div
            role="button"
            onClick={onCreateDoc}
            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

export function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : "12px",
      }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
}

export default Item;
