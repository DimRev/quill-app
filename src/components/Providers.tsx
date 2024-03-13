'use client'
import React, { PropsWithChildren, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc } from '@/app/_trpc/client'
import { httpBatchLink } from '@trpc/client'

const Providers = ({ children }: PropsWithChildren) => {
  let url: string
  if (process.env.NODE_ENV !== 'production') {
    url = 'http://localhost:3000/api/trpc'
  } else {
    url = 'https://quill-app-three.vercel.app/api/trpc'
  }

  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: url,
        }),
      ],
    })
  )
  return (
    <trpc.Provider client={ trpcClient } queryClient={ queryClient }>
      <QueryClientProvider client={ queryClient }>{ children }</QueryClientProvider>
    </trpc.Provider>
  )
}

export default Providers
