'use client'

import React from 'react'
import {FcReddit} from "react-icons/fc";
import {useRouter} from "next/navigation";

export const LoadNotFound = () => {
  const router = useRouter();
  const handleRetryBtn = ()=>{
    router.refresh();
  }
  return (
    <div className='w-screen h-screen grid place-content-center'>
        <div className='flex items-center flex-col'>
          <FcReddit className='w-12 h-12'/>
          <div className='font-bold text-gray-400 tracking-wide my-2'>
            Sorry, there doesn't seem to be anything here.
          </div>
          <button 
            className='text-white font-bold bg-blue-500 px-4 py-1 rounded-full hover:bg-blue-400'
            onClick={handleRetryBtn}
          >
            Retry
        </button>
        </div>
    </div>
  )
}
