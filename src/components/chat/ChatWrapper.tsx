'use client'
import React from 'react'
import Messages from './Messages'
import ChatInput from './ChatInput'
import { ChevronLeft, Loader2, XCircle } from 'lucide-react'
import { trpc } from '@/app/_trpc/client'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'

type Props = {
  fileId: string
}

const ChatWrapper = ({ fileId }: Props) => {
  const { data: fileUploadStatus, isLoading } =
    trpc.getFileUploadStatus.useQuery(
      { fileId },
      {
        refetchInterval: (res) =>
          res.state.data?.status === 'SUCCESS' ||
          res.state.data?.status === 'FAILED'
            ? false
            : 5000,
      }
    )

  if (isLoading)
    return (
      <div className="bh-zinc-50 relative flex min-h-full justify-between gap-2 divide-y divide-zinc-200">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-8 animate-spin text-blue-500" />
            <h3 className="text-xl font-semibold">Loading...</h3>
            <p className="text-sm text-zinc-500">
              We&apos;re preparing your PDF
            </p>
          </div>
        </div>
        <ChatInput isDisabled />
      </div>
    )

  if (fileUploadStatus?.status === 'PROCESSING')
    return (
      <div className="bh-zinc-50 relative flex min-h-full justify-between gap-2 divide-y divide-zinc-200">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-8 animate-spin text-blue-500" />
            <h3 className="text-xl font-semibold">Loading...</h3>
            <p className="text-sm text-zinc-500">This won&apos;t take long.</p>
          </div>
        </div>
        <ChatInput isDisabled />
      </div>
    )

  if (fileUploadStatus?.status === 'FAILED')
    return (
      <div className="bh-zinc-50 relative flex min-h-full justify-between gap-2 divide-y divide-zinc-200">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="size-8 text-red-500" />
            <h3 className="text-xl font-semibold">To many pages in PDF</h3>
            <p className="text-sm text-zinc-500">
              Your <span className="font-medium">Free</span> plan supports up to
              5 pages per PDF.
            </p>
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: 'secondary',
                className: 'mt-4',
              })}>
              <ChevronLeft className="mr-1.5 size-3" />
              Back
            </Link>
          </div>
        </div>
        <ChatInput isDisabled />
      </div>
    )

  return (
    <div className="relative flex min-h-full justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
      <div className="mb-28 flex flex-1 flex-col justify-between">
        <Messages />
      </div>

      <ChatInput />
    </div>
  )
}

export default ChatWrapper
