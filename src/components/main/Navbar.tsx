"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MenuIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { FC, useEffect } from "react";
import Title, { TitleSkeleton } from "./Title";
import Menu, { MenuSkeleton } from "./Menu";
import Banner from "./Banner";
import Publish from "./Publish";
import { document } from "@/types/document";
import { useRouter } from "next/navigation";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

const Navbar: FC<NavbarProps> = ({ isCollapsed, onResetWidth }) => {
  const params = useParams();
  const router = useRouter()
  const { data: document } = useQuery({
    queryKey: ["getDocument", "getById", params.documentId],
    queryFn: async () => {
      const { data: rawData } = await axios.get(
        `/api/document/getDocument/getById/${params.documentId}`
      );
      return rawData as document;
    },
    cacheTime: 0
  });
  if (document === undefined) {
    return (
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center justify-between">
        <TitleSkeleton />
        <div className="flex items-center gap-x-2">
          <MenuSkeleton />
        </div>
      </nav>
    )
  }
  


  return (
    <>
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}

        <div className="flex items-center justify-between w-full">
          <Title initialData={document} />
          <div className="flex items-center gap-x-2">
            <Publish initialData={document} />
            <Menu documentId={document.id} />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document.id} />}
    </>
  );
};

export default Navbar;
