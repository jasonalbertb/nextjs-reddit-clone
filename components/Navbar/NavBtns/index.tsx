'use client'


import React from 'react'
import { AiOutlineAppstore } from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from '@/utils/redux/hooks';
import { setShowLoginSignup } from '@/utils/redux/loginSignupSlice';

type Props = {}

export const NavBtns = (props: Props) => {
  const dispatch = useAppDispatch();
  const {email} = useAppSelector(state=>state.user);
  
  const handleOpenModal = ()=>{
    dispatch(setShowLoginSignup(true))
  }

  if (!email) {
    return(
        <ul className='flex items-center '>
            <li>
                <button className='inline-flex items-center justify-center rounded-full text-blue-700 
                     border border-blue-500 text-sm h-8 w-24 lg:w-28  hover:bg-blue-50 
                     transition-all duration-150 ease-in mr-2'>
                    <AiOutlineAppstore className='w-6 h-6'/>
                    <span className='font-bold'>Get App</span>
                </button>
            </li>
            <li>
                <button
                    onClick={handleOpenModal}
                    className='rounded-full text-white font-bold h-8 w-24 lg:w-28 
                        bg-blue-500 text-sm px-3 py-[3px] transition-all duration-150 ease-in
                        hover:bg-blue-400'
                >Log In</button>
            </li>
        </ul>
    )
} 

  return (
    <div>
      
    </div>
  )
}

