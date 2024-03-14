import { getAuthSession } from '@/lib/auth'
import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import Navigation from '@/components/main/Navigation'
import { Spinner } from '@/components/Spinner'
import SearchCommand from '@/components/main/SearchCommand'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = async ({ children }: MainLayoutProps) => {
  const session = await getAuthSession()

  
  if(!session?.user) {
    return redirect('/')
  }
  return (
    <div className='h-full flex dark:bg-[#1F1F1F]'>
      <Navigation />
      <main className='flex-1 h-full overflow-y-auto'>
        <SearchCommand />
        {children}
      </main>
    </div>
  )
}

export default MainLayout
