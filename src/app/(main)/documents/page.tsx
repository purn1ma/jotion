import Image from 'next/image'
import { getAuthSession } from '@/lib/auth'
import CreateNoteButton from './CreateNoteButton'

const Page = async () => {
  const session = await getAuthSession()
  const firstName = session?.user.name?.split(" ")[0] ?? "Your"

  return (
    <div className='h-full flex flex-col items-center justify-center space-y-4'>
      <Image
        src="/empty.png"
        alt="Empty"
        height={300}
        width={300}
        className='dark:hidden'
      />
      <Image
        src="/empty-dark.png"
        alt="Empty"
        height={300}
        width={300}
        className='hidden dark:block'
      />
      <h2 className='text-lg font-med'>
        Welcome to {firstName}&apos;s Jotion
      </h2>
      <CreateNoteButton />
    </div>
  )
}

export default Page
