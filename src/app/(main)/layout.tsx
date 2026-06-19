import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import Navigation from '@/components/main/Navigation'
import SearchCommand from '@/components/main/SearchCommand'
import type { document } from '@/types/document'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = async ({ children }: MainLayoutProps) => {
  const session = await getAuthSession()

  if (!session?.user) {
    redirect('/sign-in')
  }

  // Kick off the document prefetch immediately — session is already resolved above
  const initialDocuments = await db.document.findMany({
    where: {
      userId: session.user.id,
      parentDocumentId: null,
      isArchived: false,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      userId: true,
      parentDocumentId: true,
      isArchived: true,
      coverImage: true,
      icon: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const user = {
    name: session.user.name ?? '',
    email: session.user.email ?? '',
    image: session.user.image ?? '',
  }


  return (
    <div className='h-full flex dark:bg-[#1F1F1F]'>
      <Navigation
        initialDocuments={initialDocuments as document[]}
        user={user}
      />
      <main className='flex-1 h-full overflow-y-auto'>
        <SearchCommand />
        {children}
      </main>
    </div>
  )
}

export default MainLayout
