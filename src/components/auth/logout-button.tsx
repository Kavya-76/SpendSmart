"use client"
import React from 'react'
import { logout } from '@/actions/logout'

interface LogoutButtonProps {
    children?: React.ReactNode
}

const LogoutButton = ({children}: LogoutButtonProps) => {
    const onClick = () => {
        logout();
    }

    return (
        <span onClick={onClick} className='cursor-pointer bg-black text-white p-2 m-2 rounded-md '>
            {children}
        </span>
    )
}

export default LogoutButton
