"use client"
import React from 'react'
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const DashboardHeader = () => {
    const handleLogout = () => {
        signOut({ callbackUrl: '/' }); // Redirect to home page after logout
      };
    
  return (
    <div className='p-5 shadow-sm border-b flex justify-between'>
        <div>
            Search Bar
        </div>
        <div>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    </div>
  )
}

export default DashboardHeader
