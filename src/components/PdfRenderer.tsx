'use client'

import { ChevronDown, ChevronUp, Loader2, RotateCw, Search } from 'lucide-react'
import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { useResizeDetector } from 'react-resize-detector'
import { useForm } from 'react-hook-form'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { useToast } from './ui/use-toast'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import SimpleBar from 'simplebar-react'
import PdfFullScreen from './PdfFullScreen'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

type Props = {
  url: string
}

const PdfRenderer = ({ url }: Props) => {
  const { toast } = useToast()
  const { width, ref } = useResizeDetector()

  const [numPages, setNumPages] = useState<number>()
  const [currPage, setCurrPage] = useState<number>(1)
  const [scale, setScale] = useState<number>(1)
  const [rotation, setRotation] = useState<number>(0)

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  })

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: '1',
    },
    resolver: zodResolver(CustomPageValidator),
  })

  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    setCurrPage(Number(page))
    setValue('page', String(page))
  }

  return (
    <div className="flex w-full flex-col items-center rounded-md bg-white shadow">
      <div className="flex h-14 w-full items-center justify-between border-b border-zinc-200 px-2 ">
        <div className="flex items-center gap-1.5">
          <Button
            onClick={() => {
              setCurrPage((prev) => {
                setValue('page', prev - 1 > 1 ? String(prev - 1) : String(1))
                return prev - 1 > 1 ? prev - 1 : 1
              })
            }}
            disabled={currPage <= 1}
            variant="ghost"
            aria-label="previous-page">
            <ChevronDown className="size-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input
              {...register('page')}
              className={cn(
                'h-8 w-12',
                errors.page && 'focus-visible:ring-red-500'
              )}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit(handlePageSubmit)()
              }}
            />
            <p className="space-x-1 text-sm text-zinc-700">
              <span>/</span>
              <span>{numPages ?? 'x'}</span>
            </p>
          </div>

          <Button
            disabled={numPages === undefined || currPage === numPages}
            onClick={() =>
              setCurrPage((prev) => {
                setValue(
                  'page',
                  prev + 1 > numPages! ? String(numPages!) : String(prev + 1)
                )
                return prev + 1 > numPages! ? numPages! : prev + 1
              })
            }
            variant="ghost"
            aria-label="next-page">
            <ChevronUp className="size-4" />
          </Button>
        </div>

        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="zoom" variant="ghost" className="gap-1.5">
                <Search className="size-4" />
                {scale * 100}% <ChevronDown className="size-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            aria-label="rotate 90 degrees"
            variant="ghost"
            onClick={() => setRotation((prev) => prev + 90)}>
            <RotateCw className="size-4" />
          </Button>

          <PdfFullScreen fileUrl={url} />
        </div>
      </div>

      <div className="max-h-screen w-full flex-1">
        <SimpleBar
          autoHide={false}
          style={{ maxHeight: 'calc(100vh - 10rem)' }}>
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 size-6 animate-spin" />
                </div>
              }
              onLoadError={() => {
                toast({
                  title: 'Error loading pdf',
                  description: 'Please try again later',
                  variant: 'destructive',
                })
              }}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages)
              }}
              file={url}
              className="max-h-full">
              <Page
                width={width ? width : 1}
                scale={scale}
                rotate={rotation}
                pageNumber={currPage}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  )
}

export default PdfRenderer
