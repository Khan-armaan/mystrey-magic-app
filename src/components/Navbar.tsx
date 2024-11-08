"use client"

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
useSession
const Navbar = () => {
    
    const { data : session } = useSession()
    
  return (
    <div>Navbar</div>
  )
}

export default Navbar