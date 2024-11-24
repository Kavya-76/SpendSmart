import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import {IconBrandGithub, IconBrandGoogle} from "@tabler/icons-react"

function Signin() {
  return (
    <div className='mt-10 max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white border border-[#121212] dark:bg-black'>
      <form className='my-8'>
        <Label htmlFor='email'>Email Address</Label>
        <Input id='email' placeholder='johndoe@gmail.com' type='email' name='email' />

        <Label htmlFor='password'>Password</Label>
        <Input id='password' placeholder='**********' type='password' name='password'></Input>

        <button className='border border-black bg-black text-white'>Login &rarr;</button>

        <p className='text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300'>
        Don't have account? <Link href="/signup">Register</Link></p>

        <section className='flex flex-col spate-y-4'>
          <form>
            <button className='border border-black bg-white'>
              <IconBrandGithub className='h-4 w-4 text-neutral-800 dark:text-neutral-300'/>
              <span className='text-neutral-700 dark:text-neutral-300 text-sm'>Github</span>
            </button>

            <button className='border border-black bg-white'>
              <IconBrandGoogle className='h-4 w-4 text-neutral-800 dark:text-neutral-300'/>
              <span className='text-neutral-700 dark:text-neutral-300 text-sm'>Google</span>
            </button>
          </form>
        </section>
      </form>  
    </div>
  )
}

export default Signin
