"use client"

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'




const Navbar = () => {
    
    const { data : session } = useSession() //data to user  ke session se milega is session me jo user h usse user ka data milega 
    const user: User = session?.user as User //now extracting user from session
  const router = useRouter()
  return (
    
      <nav className='p-4 md:p-6 shadow-md'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
          <a className='text-xl font-bold mb-4 md:mb-0' href='#'>Mystry Message</a>
          { // first check karennge ki session h ie authennticated h ya nhi 
              session ? ( <>
              <span className='mr-4'>Welcome, {user?.username || user?.email}</span><Button className='w-full md:w-auto' onClick={() => (signOut())} >Logout</Button>
              </>) 
              : ( <Button onClick={() => {router.replace('/sign-in')}}> sign in </Button>  )
          }
        </div>
      </nav>
   
  )
}

export default Navbar