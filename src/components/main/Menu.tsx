import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '../ui/DropdownMenu'
import { FC } from 'react'
import { Button } from '../ui/Button'
import { MoreHorizontal, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { Skeleton } from '../ui/skeleton'


interface MenuProps {
  documentId: string
}

const Menu: FC<MenuProps> = ({ documentId }) => {
  const router = useRouter()
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const { mutate: onArchive } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.patch(`/api/document/archive/${documentId}`);
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
      queryClient.invalidateQueries(["document", "archive"])
      queryClient.invalidateQueries(["document"])
      router.push('/documents')
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-60" 
        align="end" 
        alignOffset={8} 
        forceMount
      >
        <DropdownMenuItem onClick={() => onArchive()}>
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="text-xs text-muted-foreground p-2">
          Last edited by: {session?.user.name}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function MenuSkeleton() {
  return (
    <Skeleton className="h-10 w-10" />
  )
}

export default Menu