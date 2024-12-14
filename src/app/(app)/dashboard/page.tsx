'use client'
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Message } from '@/model/User'
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import { Separator } from '@radix-ui/react-separator'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
// watch event This method will watch specified inputs and return their values. It is useful to render input value and for determining what to render by condition.\
const Dashboard = () => 
{
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const {toast} = useToast()

  const handleDeleteMessage = (messageId : string) => {
    // facebook engineer approach to show the changes at the frontend first even if the channges has not been done on the backend 
    setMessages(messages.filter((message) => message._id !== messageId)) // only changed the frontend to not to show the messages which message id has been given to it  
    // a filter function has been applied in the setMessages messages is the state variable that is been channging 
}
 const {data: session} = useSession() // it is the way of getting a session 
 console.log(session)
 const form = useForm({
  resolver: zodResolver(AcceptMessageSchema) // since we want the form to only show the isAccepting or not that is why we use accepot messages schema 

 })
 const {register, watch, setValue} = form // destructuring the form 

 const acceptMessages = watch('acceptMessages') // watch is a function that watches acceptmessages
 // setvalue watch ki immdeiate value set kar deta h UI ke liye 


 // function to fetch is accepting messages or not 
 const fetchAcceptMessage  = useCallback(async () => { // we know what  a useCallback is 
  setIsSwitchLoading(true)
// BE interaction 
try {
 const response = await axios.get('/api/accept-msg')
 setValue('acceptMessages', response.data.isAcceptingMessage)
} catch (error) {
  const axiosError = error as AxiosError<ApiResponse> // we can console.log axios error 
  toast({
    title: "Error",
    description: axiosError.response?.data.message || "Failed to fetch message settings",
    variant: "destructive"
  })
} finally{
  setIsSwitchLoading(false)  // the switch is loading is set to be false 
}


 }, [setValue, toast]) // when the setValue is changes useCallback consider the funciuton to be changed


// function to fetch all the messages of the user useCallback is basically used to define in for a function

const fetchMessages = useCallback ( async(refresh : boolean = false) => {
  setIsLoading(true)
  setIsSwitchLoading(false)
  try {
    const response = await axios.get<ApiResponse>('/api/get-messages')
   setMessages(response.data?.messages || [] ) // assume if we donnt get any messages so it is empty but we have set the messags to be an array so we have to write or an empty array
   if (refresh) {
    toast({
      title: 'Refreshed Messages',
      description: 'Showing latest messages'
    })
   }
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse> // we can console.log axios error 
    toast({
      title: "Error",
      description: axiosError.response?.data.message || "Failed to fetch message settings",
      variant: "destructive"
    })

  } finally{
    setIsLoading(false)
    setIsSwitchLoading(false)  // the switch is loading is set to be false 
  } 
}, [setIsLoading, setMessages, toast])

// we cannot store useEffect in a variable just like useCallback
useEffect(() => {
  if(!session || !session.user) return

  fetchMessages() // fetching all the messges 
  fetchAcceptMessage()  // fetch the isAccepting messages or not 
  

},[session, setValue, fetchMessages, fetchAcceptMessage])

//handle switch change
const handleSwitchChange = async() => {
  try {
   const response = await axios.post<ApiResponse>('/api/accept-msg', {
      acceptMessages: !acceptMessages // reverse of accept messages for switch
    })
    setValue('acceptMessages', !acceptMessages) // actually changing the value when the value is changed in the backend

    toast({
      title: response.data.message,
      variant: 'default'
    })
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse> // we can console.log axios error 
    toast({
      title: "Error",
      description: axiosError.response?.data.message || "Failed to fetch message settings",
      variant: "destructive"
    })

  }
}
 
const user: User = session?.user as User

// construct host URL
// do more research to get the base url
// since we are using a client component we can find out the window object

const baseUrl = `${window.location.protocol}//${window.location.host}`
console.log('base url',baseUrl)
const profileUrl = `${baseUrl}/u/${user?.username}` // created the profile url
console.log(profileUrl)
// copy to clip board
const copyToClipBoard = () => {
  navigator.clipboard.writeText(profileUrl)  // only work in client component 
  toast({
    title: 'URL copied',
    description: "Profile URL has been copied to clipboard"
  })
}


if(!session || !session.user){
  return <div className='flex flex-col justify-center h-screen'>
    <div className='flex justify-center font-bold text-4xl'>Please Login</div>
    </div>
}

return ( 
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
      <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>
      <div className='mb-4'>
        <h2 className='text-lg font-semibold mb-2'>Unique Link</h2>{' '}
        <div className='flex items-center'>
          <input type='text'
          value={profileUrl} // hardcoded value remain only the value
          disabled
          className='input input-borderd w-full p-2 mr-2'/>
          <Button onClick={copyToClipBoard}>Copy</Button>
        </div>
      </div>
      
      <div className='mb-4'>
        <Switch  // this is the main work what happens when the swirch changes destructure the form,
        {...register('acceptMessages')}
        checked={acceptMessages}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitchLoading}
        />
        <span className='ml-2'>
          Accept Messages: {acceptMessages ? 'on': 'off'}
        </span>
    </div>
    <Separator />
    <Button className='mt-4'
    variant='outline'
    onClick={(e) => {
      e.preventDefault();
      fetchMessages(true)
    }}>
      {isLoading ? 
      (<Loader2 className='h-4 w-4 animate-spin' />) : 
      (<RefreshCcw className='h-4 w-4' />)}
      </Button>  
      
      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {messages.length > 0 ? (
          messages.map((message, index) => {
            return <MessageCard key={message._id as number} message={message} onMessageDelete={handleDeleteMessage} /> 
          })
        ) : (
          <p>No messages to display</p>
        )}

      </div>
    </div>
  )
}

export default Dashboard