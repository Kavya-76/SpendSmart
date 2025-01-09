import React from 'react'
import UserButton from '@/app/_components/user-button'
import { Toggle } from "@/components/ui/toggle"
import { useSidebar } from "@/components/ui/sidebar"

function DashboardHeader() {
  const { toggleSidebar } = useSidebar()
  return (
    <div className='w-full p-5 shadow-sm border-b flex justify-between'>
        <div>
        <button onClick={toggleSidebar}><Toggle>↔</Toggle>
        </button>
        </div>
        <div>
            <UserButton/>
        </div>
       
    </div>
  )
}

export default DashboardHeader
