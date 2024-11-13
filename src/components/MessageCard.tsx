import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { Message } from '@/model/User'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'

import { ApiResponse } from '@/types/ApiResponse'
import { any } from 'zod'


type MessageCardProps = {
    message: Message
    onMessageDelete: (messageId : string ) => void
}
  
const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {
    const { toast } = useToast()
    const handleDeleteConfirm = async() => {
     const response =  await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`) 
     toast({
        title: response.data?.message
     })
     onMessageDelete(message._id as string)

    }
    const msg = JSON.stringify(message)
  return (
    <Card className="relative p-4">
      <CardHeader>
        <CardContent>
          <p>{message.content}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(message.createdAt).toLocaleString()}
          </p>
        </CardContent>

        {/* Positioned Delete Button */}
        <div className="absolute top-4 right-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="w-auto p-2">
                <X className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  message and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
    </Card>
  );
  
}

export default MessageCard