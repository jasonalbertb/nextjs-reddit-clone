import { ROUTES } from '@/utils/constants/routes'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {}

export const Logo = (props: Props) => {
  return (
    <Link href={ROUTES.DASHBOARD} className='flex items-center flex-none outline-none my-1'>
        <Image src='/images/reddit-icon.png' alt='reddit-icon' width={32} height={32}
            className='mr-2' />
        <Image src='/images/reddit-label.png' alt='reddit-label' className='hidden lg:block mr-4' height={32} width={60}/>
    </Link>
  )
}