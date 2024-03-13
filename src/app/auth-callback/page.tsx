'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect } from 'react'
import { trpc } from '../_trpc/client'
import { Loader2 } from 'lucide-react'

type Props = {}

const Page = (props: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const origin = searchParams.get('origin')

  const { data, error, isSuccess, isError } = trpc.authCallback.useQuery(
    undefined,
    {
      retry: true,
      retryDelay: 500,
    }
  )

  useEffect(() => {
    if (isSuccess) {
      const success = data.success
      if (success) router.push(origin ? `/${origin}` : 'dashboard')
    } else if (isError) {
      const err = error
      if (err.data?.code === 'UNAUTHORIZED') router.push('/sign-in')
    }
  }, [isSuccess, isError, data, error, origin, router])

  return (
    <Suspense>
      <div className="mt-24 flex w-full justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-8 animate-spin text-zinc-800" />
          <h3 className="text-xl font-semibold">Setting up your account...</h3>
          <p>You will be redirected automatically</p>
        </div>
      </div>
    </Suspense>
  )
}

export default Page
