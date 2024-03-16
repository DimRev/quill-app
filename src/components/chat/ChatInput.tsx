'use client'
import React, { useContext, useRef } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Send } from 'lucide-react'
import { ChatContext } from './ChatContext'

type Props = {
  isDisabled?: boolean
}

const ChatInput = ({ isDisabled }: Props) => {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className=" relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex w-full flex-grow flex-col p-4">
            <div className="relative">
              <Textarea
                autoFocus
                rows={1}
                ref={textAreaRef}
                maxRows={4}
                onChange={handleInputChange}
                value={message}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' && !ev.shiftKey) {
                    ev.preventDefault()
                    addMessage()
                    textAreaRef.current?.focus()
                  }
                }}
                placeholder="Enter your question..."
                className="scrollbar-w-2 scrollbar-track-blue-lighter scrollbar-thumb-blue scrollbar-thumb-rounded resize-none py-3 pr-12 text-base"
              />
              <Button
                disabled={isLoading || isDisabled}
                aria-label="send-message"
                className="absolute bottom-1.5 right-[8px]"
                size="icon"
                onClick={() => {
                  addMessage()
                  textAreaRef.current?.focus()
                }}>
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInput
