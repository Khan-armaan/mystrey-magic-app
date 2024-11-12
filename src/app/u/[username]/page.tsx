"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import { Loader2, User } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useCallback, useState } from 'react';

const UserPage = () => {
  const params = useParams();
  const username = params.username; // Extract the 'username' from the URL
  const [message, setMessage] = useState('')
  const [response,setResponse] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isUserAcceptingMsg, setisUserAcceptingMsg ] = useState(true)
  const { toast } = useToast()

  // function to check the status of the user if he is accepting the messages or not 
  const status = useCallback(async() => {
   const response = await axios.get(`/api/status?username=${username}`)
   setisUserAcceptingMsg(response.data.isAcceptingMessage)
  },[message])
  
  //funciton to send message
  const sendMsg = async() => {
   status()
    if(!isUserAcceptingMsg){
      toast({
        title: "User not Active",
        description: "User is not accepting messges at this moment"
      })  
    }
    else{
      setIsSending(true)
      try {
        const res  = await axios.post('/api/send-message', {
          username: username,
          content: message
        })
        setResponse(res.data.message )
        toast({
          title: 'response',
          description: res.data.message
        })
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast({
          title: 'error',
          description: axiosError.response?.data.message || "Failed to fetch message settings",
          variant: "destructive"
        })
      }finally{
        setIsSending(false)
      }
    }
}



  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl text-center'>
      <h1 className='text-4xl font-bold mb-4'>Public Profile Link</h1>
      <div className='mb-4'>
      <h2 className='text-lg font-semibold mb-2'>Send Anonymous message to {username}</h2>{' '}
      <Input className='mt-10 h-16' onChange={(e) => {
        setMessage(e.target.value)
      }}/>
      </div>
      <div className='flex justify-center mt-16'>
        <Button  className='px-5' onClick={sendMsg}>
          {isSending ? (<Loader2 className='h-4 w-4 animate-spin'/>) : ("Send Message")  }
          </Button>
        </div>
      
    </div>
  );
};

export default UserPage;
