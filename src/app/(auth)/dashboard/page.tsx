"use client"
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table'
import React from 'react'

function Dashboard() {
    const router = useRouter();

  const handleLogout = () => {
    signOut({ callbackUrl: '/' }); // Redirect to home page after logout
  };

  return (
    <div>
        Dashboard
        <Button onClick={handleLogout}>Logout</Button>
    </div>
  )
}

export default Dashboard
