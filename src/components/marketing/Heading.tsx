import { FC } from 'react'
import { Button, buttonVariants } from '../ui/Button'
import { ArrowRight } from 'lucide-react'
import { Session } from 'next-auth'
import { getAuthSession } from '@/lib/auth'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const Heading = async () => {
  const session = await getAuthSession()

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">Your Ideas, Documents, & Plans. Unified. Welcome to <span className="underline">Jotion</span></h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Jotion is the connected workspace where <br />
        better, faster work happens.
      </h3>
      {session?.user ? (
          <Link href="/documents" className={cn(buttonVariants({ variant: "default"}))}>
            Enter Jotion
            <ArrowRight className='h-4 w-4 ml-2' />
          </Link>

      ) : (
        <>
          <Link
            href="/sign-in"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Sign In
          </Link>
        </>
      )}
    </div>
  )
}

export default Heading