'use client'
import React, { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import AuthCallback from '@/components/auth-callback/AuthCallback'

const Page = () => {
  return (
    <Suspense
      fallback={<Loader2 className="size-8 animate-spin text-zinc-800" />}>
      <AuthCallback />
    </Suspense>
  )
}

export default Page
