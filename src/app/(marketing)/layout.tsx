import Navbar from '@/components/marketing/Navbar'
import { getAuthSession } from '@/lib/auth'
import { FC, ReactNode } from 'react'

interface layoutProps {
  children: ReactNode
}

const MarketingLayout = async ({ children }: layoutProps) => {
  const session = await getAuthSession()
  return (
    <div className="h-full dark:bg-[#1F1F1F]">
      {/* This navbar is for marketing page */}
      <Navbar session={session} />
      <main className="h-full pt-40">
        {children}
      </main>
    </div>
  )
}

export default MarketingLayout
