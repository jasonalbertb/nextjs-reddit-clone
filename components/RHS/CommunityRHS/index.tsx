'use client'

import { ROUTES } from '@/utils/constants/routes'
import { Community } from '@/utils/firebase/types'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { BsCalendarDate, BsThreeDots } from 'react-icons/bs'
import { CommunityRHSLoader } from './CommunityRHSLoader'
import Image from "next/image";
import { PICS } from '@/utils/constants/pics'
import { formatDate, formatNumber } from '@/utils/helpers'
import { listenToCommunityData, updateJoin } from '@/utils/firebase/functions'
import { handleError } from '@/utils/helpers/errors'
import { setShowLoginSignup } from '@/utils/redux/loginSignupSlice'
import { useAppDispatch, useAppSelector } from '@/utils/redux/hooks'
import { Description } from './Description'
type Props = {
  communityID: string,
  type?: string,
  moderators? : string[],
} 

export const CommunityRHS = ({communityID, type, moderators=[]}: Props) => {
  const dispatch = useAppDispatch();
  const {email} = useAppSelector(state=>state.user);
  const [communityData, setCommunityData] = useState<Community | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoinBtnDisabled, setIsJoinBtnDisabled] = useState(false);
  

  const handleJoinBtn = useCallback(()=>{
    (async()=>{
      setIsJoinBtnDisabled(true)
        try {
            if (!email) {
                dispatch(setShowLoginSignup(true));
                return
            }   
             await updateJoin(communityID, isJoined? 'leave': 'join');
        } catch (error) {
            handleError(error)
        }
        setIsJoinBtnDisabled(false)
    })()
  }, [communityID, isJoined, email]);
  
  
  useEffect(()=>{
    const unsub = listenToCommunityData(communityID, 
        (data)=>{
            const val = data as Community;
            setCommunityData(val);
            setIsJoined(email && val.members?.includes(email) || false);
            setIsLoading(false)
        },
        (err)=>{
          handleError(err);
        }
    )
    return ()=>{
        unsub && unsub();
    }
}, [communityID])

  if (isLoading) {
    return <CommunityRHSLoader />
  }

  if (!communityData) {
    return <></>
  }

  return (
    <div className='border rounded-md overflow-hidden bg-white'>
      {type === 'about'?
          <div className='flex justify-between items-center p-3 text-sm font-bold'>
              <span>About Community</span>
              <button className='hover:bg-blue-600 p-1 px-2 rounded-md'><BsThreeDots /></button>
          </div>:
          <div className='w-full h-10 bg-blue-400'></div>
      } 

      <div className='py-2 px-4'>
        {!type && <div className='flex items-center mb-2'>
            <div className='w-14 h-14 rounded-full overflow-hidden'>
              <Image
                width={56} height={56} 
                alt='display-pic' src={communityData?.dp || PICS.defaultPic} 
                className='rounded-full object-cover'
              />
            </div>
            
            <Link
                href={`${ROUTES.R_SLASH(communityID)}`}
                className='font-semibold ml-2'>{`r/${communityData?.name}` }
            </Link>
          </div> 
        }
        <div>
          <Description 
            description={communityData?.description} 
            moderators={moderators} 
            communityID={communityID}
        />

        </div>
        <div className='flex items-center my-2 text-gray-500'>
          <BsCalendarDate className='w-6 h-6 mr-2'/>
          <div >{formatDate(communityData?.createdAt?.toDate())}</div>
        </div>
        <div className='flex'>
          <div className='w-1/3 flex flex-col '>
              <span className='font-semibold'>
                  { formatNumber(communityData.members?.length)}
              </span>
              <span className='text-gray-500 text-xs'>Members</span>
          </div>
          <div className='w-1/3 flex flex-col '>
              <span className='font-semibold'>
                  { formatNumber(0)}
              </span>
              <span className='text-gray-500 text-xs'>Online</span>
          </div>
        </div>
        <div>
          {type === 'about'?
              ( email? 
                  <Link 
                  href={ROUTES.CREATE_POST(communityID)}
                  className='flex justify-center w-full border font-bold  p-1 rounded-full my-6 text-white bg-blue-500' 
                    >Create Post
                  </Link> : <></>
              ) :
              <button 
                  disabled={isJoinBtnDisabled}
                  onClick={handleJoinBtn}
                  className={`w-full border font-bold  p-1 rounded-full my-6 disabled:opacity-50
                      ${isJoined?
                          'border-blue-500  text-blue-500 bg-white  hover:bg-blue-50':
                          'bg-blue-500 text-white hover:bg-blue-400'
                      }`}
              >
                  {isJoined? 
                      'Joined': 
                      'Join'
                  }   
              </button>
          }
         </div>
      </div>
    </div>
  )
} 