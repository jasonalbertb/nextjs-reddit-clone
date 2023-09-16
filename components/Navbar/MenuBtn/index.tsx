'use client'

import React, { useState } from 'react'
import {FaHome} from "react-icons/fa";
import {GrFormDown} from "react-icons/gr";
import { MenuModal } from './MenuModal';
//hooks
import { useEscapeKey } from '@/utils/hooks/useEscapeKey';

type Props = {}

export const MenuBtn = (props: Props) => {
  const [showMenuFlag, setShowMenuFlag] = useState(false);  

  const handleOpen = () =>{    
    setShowMenuFlag(prev=>!prev);
  }

  const handleClose = () =>{
    setShowMenuFlag(false);   
  }
  //custom hooks
  useEscapeKey(handleClose);

  
  return (
    <div  
        className='relative'         
    >
      <button  
        onMouseUp={handleOpen}
        className={`inline-flex items-center justify-center lg:justify-between py-1 px-2
                    outline-none border 
                    hover:border-gray-200
                    ${showMenuFlag? 'border-gray-200': 'border-white'}
                    lg:w-64`}
      >
        <span className='inline-flex items-center'>
          <FaHome className='w-6 h-6 mr-2 pointer-events-none'/> 
          <span className='hidden lg:block font-medium text-sm pointer-events-none'>Home</span>
        </span>
        <GrFormDown className='pointer-events-none'/>
      </button>
      {showMenuFlag && <MenuModal handleClose={handleClose}/>}
    </div>  
  )
}
