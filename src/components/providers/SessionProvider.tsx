"use client"


import { SessionProvider } from "next-auth/react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

const Providers = ({children}: {children: React.ReactNode}) => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {children}
      </SessionProvider>  
    </QueryClientProvider>
  )
}

export default Providers
