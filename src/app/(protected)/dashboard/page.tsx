"use client"
import React from 'react'
import { useCurrentUser } from '@/hooks/use-current-user'
import LogoutButton from '@/components/auth/logout-button'
const Dashboard = () => {
  const user = useCurrentUser();
  return (
    <div>
      {JSON.stringify(user)}
      Dashboard
      <LogoutButton>Logout</LogoutButton>
    </div>
  )
}

export default Dashboard
