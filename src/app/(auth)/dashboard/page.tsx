import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table'
import React from 'react'

function Dashboard() {
  return (
    <div className='flex min-h-screen'>
        <div className="flex-1 bg-gray-100 dark:bg-gray-950">
            <div className="p-6 grid gap-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$45,324.58</div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>+20.1% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$45,324.58</div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>+20.1% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$45,324.58</div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>+20.1% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$45,324.58</div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>+20.1% from last month</p>
                        </CardContent>
                    </Card>
                </div>

                <div className='grid gap-6'>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between pb-2'>
                            <CardTitle className='text-sm font-medium'>Recent Signups</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Plan</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>John Doe</TableCell>
                                        <TableCell>john@example.com</TableCell>
                                        <TableCell>Pro</TableCell>
                                        <TableCell>2024-02-12</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>John Doe</TableCell>
                                        <TableCell>john@example.com</TableCell>
                                        <TableCell>Pro</TableCell>
                                        <TableCell>2024-02-12</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>John Doe</TableCell>
                                        <TableCell>john@example.com</TableCell>
                                        <TableCell>Pro</TableCell>
                                        <TableCell>2024-02-12</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>John Doe</TableCell>
                                        <TableCell>john@example.com</TableCell>
                                        <TableCell>Pro</TableCell>
                                        <TableCell>2024-02-12</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>John Doe</TableCell>
                                        <TableCell>john@example.com</TableCell>
                                        <TableCell>Pro</TableCell>
                                        <TableCell>2024-02-12</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default Dashboard
