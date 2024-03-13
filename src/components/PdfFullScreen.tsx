import React, { useState } from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Button } from './ui/button'
import { Expand, Loader2 } from 'lucide-react'
import SimpleBar from 'simplebar-react'
import { Document, Page } from 'react-pdf'
import { useToast } from './ui/use-toast'
import { useResizeDetector } from 'react-resize-detector'

type Props = {
  fileUrl: string
}

const PdfFullScreen = ({ fileUrl }: Props) => {
  const [numPages, setNumPages] = useState<number>()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { width, ref } = useResizeDetector()
  const { toast } = useToast()
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v)
        }
      }}>
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button variant="ghost" className="gap-1.5" aria-label="fullscreen">
          <Expand className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="flex h-full w-full max-w-7xl flex-col justify-center">
        <SimpleBar autoHide={false} style={{ maxHeight: 'calc(100vh - 5rem)' }}>
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
              file={fileUrl}
              className="max-h-full">
              {new Array(numPages).fill(0).map((_, idx) => (
                <Page
                  key={idx}
                  width={width ? width : 1}
                  pageNumber={idx + 1}
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  )
}

export default PdfFullScreen
