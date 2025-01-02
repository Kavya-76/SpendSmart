import React from 'react'
import { auth } from '@/auth'
import LogoutButton from '@/components/auth/logout-button'

const page = async () => {
    const session = await auth()
  return (
    <div>
      {JSON.stringify(session)}
      <LogoutButton>Logout</LogoutButton>
    </div>
  )
}

export default page
