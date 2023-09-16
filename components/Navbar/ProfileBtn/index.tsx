'use client'
import React, {useEffect, useRef, useState} from 'react'
import Skeleton from "react-loading-skeleton";

//hooks
import {useOutsideClick} from "@/utils/hooks/useOutsideClick";
//constants
import {PICS} from "@/utils/constants/pics";

import { useAppSelector } from '@/utils/redux/hooks';
import { GrFormDown } from 'react-icons/gr';
import Image from 'next/image';
import { ProfileBtnModal } from './ProfileBtnModal';
import { listenToUserData } from '@/utils/firebase/functions';
import { handleError } from '@/utils/helpers/errors';
import { User } from '@/utils/firebase/types';
import { auth } from '@/utils/firebase/config';

type Props = {
  isOnline : boolean
}

export const ProfileBtn = ({isOnline}: Props) => {
  const {email, username} = useAppSelector(state=>state.user);
  
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isPhotoLoading, setPhotoLoading] = useState(true);
  const [userData, setUserData] = useState<User>();

  const handleClick= ()=>{
    setShowProfileModal(prev=>!prev); 
  } 
  const handleClose = ()=>{  
    setShowProfileModal(false);
  }   

  //hooks
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick({handleClose, ref});
  
  useEffect(()=>{
    let unsub;
    if (email) {
        unsub = listenToUserData(email, (val)=>{
          setUserData(val as User); 
          setPhotoLoading(false);  
        }, 
        (err)=>{
          handleError(err)
        });
    }
    return unsub;
  }, [email])

  if (email === null) {
    return <></>
  }

  
  return (
    <div ref={ref} className='relative'>  
       <div className='relative' onClick={handleClick} >
          <div className={`flex items-center px-2.5 py-1 rounded-md cursor-pointer border justify-between max-w-[210px]
              ${showProfileModal? ' border-gray-200 ': 'border-white'}  
              hover:border-gray-200 transition duration-150 ease-out hover:ease-in`}
            >
              <div className='flex items-center'>
                <div className='relative mr-2'>
                  {email && (
                    <div className='w-5 h-5 overflow-hidden'>
                      {isPhotoLoading ? 
                        <div className='leading-none overflow-hidden w-full h-full'>
                          <Skeleton width={"100%"} height={"100%"}/>
                        </div>:
                        <Image src={auth.currentUser?.photoURL ||  PICS.defaultPic} alt='reddit_pfp' 
                          className='rounded-full object-center' width={20} height={20}
                        />
                      }
                    </div>
                      
                  ) } 
  
                  {isOnline && <div className='absolute bottom-[-4px] right-[-4px] w-3 h-3 rounded-full bg-green-500 border-2 border-white'></div>}
                </div>
                {email && (
                  <div className='text-xs font-semibold mr-2'>
                    <h4 className='line-clamp-1'> {username} </h4> 
                    <h5 className='text-gray-400'>1 karma</h5> 
                  </div>
                )}
                
              </div>
              <GrFormDown />
          </div>
       </div>
       {showProfileModal && <ProfileBtnModal 
          handleClose={handleClose}
        /> }
    </div>
  )
} 

