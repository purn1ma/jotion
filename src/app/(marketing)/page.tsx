import { redirect } from 'next/navigation'
import Footer from '@/components/marketing/Footer'
import Heading from '@/components/marketing/Heading'
import Heroes from '@/components/marketing/Heroes'
import { getAuthSession } from '@/lib/auth'

const MarketingPage = async () => {
  const session = await getAuthSession()
  if (session?.user) redirect('/documents')

  return (
    <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
      <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
        <Heading />
        <Heroes />
      </div>
      <Footer />
    </div>
  )
}

export default MarketingPage;
