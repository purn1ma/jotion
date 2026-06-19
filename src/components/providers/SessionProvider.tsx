"use client"


import { SessionProvider } from "next-auth/react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { useState } from "react"

const Providers = ({children}: {children: React.ReactNode}) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,       // cached data is fresh for 1 min — no refetch on focus/remount
        cacheTime: 5 * 60 * 1000,   // keep unused data in cache for 5 min (fast back-navigation)
        refetchOnWindowFocus: false, // don't hammer the API when user tabs back in
        retry: 1,
      },
    },
  }))
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {children}
      </SessionProvider>  
    </QueryClientProvider>
  )
}

export default Providers
