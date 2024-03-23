import { ChevronsLeftRight, LogOut } from "lucide-react";

import {
  Avatar,
  AvatarImage
} from "@/components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { redirect } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/Button";

interface UserItemProps {
  
}

const UserItem = ({}) => {

  const { data: session } = useSession()

  // if session is not there then redirect them to marketing page
  // if(!session) {
  //   return redirect('/')
  // }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div role="button" className="flex items-center text-sm p-3 w-full hover:bg-primary/5">
          <div className="gap-x-2 flex items-center max-w-[150px]">
            <Avatar className="h-5 w-5">
              <AvatarImage src={session?.user.image ?? ""} /> 
            </Avatar>
            <span className="text-start font-medium line-clamp-1">
              {session?.user.name}&apos;s Jotion
            </span>
          </div>
          <ChevronsLeftRight className="rotate-90 ml-2 text-muted-foreground h-4 w-4" />
        </div>
      </DropdownMenuTrigger>

      {/* Dropdown menu content */}
      <DropdownMenuContent
        className="w-80"
        align="start"
        alignOffset={11}
        forceMount
      >
        <div className="flex flex-col space-y-4 p-2">
          <p className="text-xs font-medium leading-none text-muted-foreground">
            {session?.user.email}
          </p>
          <div className="flex items-center gap-x-2">
            <div className="rounded-md bg-secondary p-1"> 
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user.image || ""} />
              </Avatar>
            </div>
            <div className="space-y-1">
              <p className="text-sm line-clamp-1">
                {session?.user.name}&apos;s Jotion
              </p>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="w-full cursor-pointer text-muted-foreground">
          <Button
            variant="ghost"
            onClick={(e) => {
              e.preventDefault()
              signOut({
                callbackUrl: `${window.location.origin}`
              })
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserItem