import { createContext, useState } from 'react'
import { useToast } from '../ui/use-toast'
import { useMutation } from '@tanstack/react-query'

type StreamResponse = {
  addMessage: () => void
  message: string
  handleInputChange: (ev: React.ChangeEvent<HTMLTextAreaElement>) => void
  isLoading: boolean
}

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => { },
  message: '',
  handleInputChange: () => { },
  isLoading: false,
})

type Props = {
  fileId: string
  children: React.ReactNode
}

export const ChatContextProvider = ({ fileId, children }: Props) => {
  const [message, setMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { toast } = useToast()

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch('/api/message', {
        method: 'POST',
        body: JSON.stringify({
          fileId,
          message,
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      return response.body
    },
  })

  const addMessage = () => sendMessage({ message })

  const handleInputChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(ev.target.value)
  }

  return (
    <ChatContext.Provider
      value={ {
        addMessage,
        handleInputChange,
        isLoading,
        message,
      } }>
      { children }
    </ChatContext.Provider>
  )
}
