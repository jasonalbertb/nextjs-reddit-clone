import { ROUTES } from '@/utils/constants/routes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { BsImage, BsLink45Deg } from 'react-icons/bs';
import { FaReddit } from 'react-icons/fa';

type Props = {
    username ?: string, 
    email ?: string,
    communityID? : string
}

export const DashboardCreatePost = ({username, email, communityID=''}: Props) => {
    const navigate = useRouter();
    

    const handleCreatePostInputClick = ()=>{
        navigate.push(ROUTES.CREATE_POST(communityID))
    }
 
    if (!email || !username) {
      return <></>
    }
  
    return (
      <div className='bg-white border p-2 w-full flex items-center mb-4'>
        <Link href={ROUTES.PROFILE(username)} className='mr-2'>
            <FaReddit className='w-10 h-10 text-gray-300 border-2 border-gray-200 rounded-full'/>
        </Link>
        <input 
            onClick={handleCreatePostInputClick}
            placeholder='Create Post' className='flex-1 outline-none text-sm bg-gray-50 px-4 py-2 border 
            rounded-md hover:bg-white hover:border-blue-500'
        />
        <div className='flex items-center'>
        <Link href={{
            pathname: ROUTES.CREATE_POST(communityID),
            query: { media: true },
        }}
          className='hover:bg-gray-200 rounded-md h-9 aspect-square grid place-content-center mx-2'
        >
          <BsImage className='m-2 w-5 h-5 text-gray-400'/>
        </Link>
        <Link href={{
            pathname: ROUTES.CREATE_POST(communityID),
            query: { url: true },
        }}
          className='hover:bg-gray-200 rounded-md h-9 aspect-square grid place-content-center'
        > 
            <BsLink45Deg className='w-6 h-6 text-gray-400'/>
        </Link>
        </div>
      </div>
    ) 
}