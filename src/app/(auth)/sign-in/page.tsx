import { redirect } from 'next/navigation'
import SignIn from '@/components/auth/SignIn'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { getAuthSession } from '@/lib/auth'


const page = async () => {
  const session = await getAuthSession()
  if (session?.user) redirect('/documents')

  return (
    <div className="absolute inset-0">
      <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-4">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "self-start -mt-20"
          )}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Home
        </Link>
        {/* SignIn Component */}
        <SignIn />
      </div>
    </div>
  )
}

export default page
