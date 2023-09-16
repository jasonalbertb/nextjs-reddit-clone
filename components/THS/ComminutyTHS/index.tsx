import { PICS } from '@/utils/constants/pics'
import { listenToCommunityData, updateJoin } from '@/utils/firebase/functions'
import { Community } from '@/utils/firebase/types'
import { handleError } from '@/utils/helpers/errors'
import { useAppDispatch, useAppSelector } from '@/utils/redux/hooks'
import { setShowLoginSignup } from '@/utils/redux/loginSignupSlice'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import { BsFillBellFill } from 'react-icons/bs'
import { CommunityPic } from './CommunityPic'

type Props = {
    dp ?: string,
    communityID : string,
}

export const ComminutyTHS = ({
        dp, communityID}: Props
    ) => {
    const dispatch = useAppDispatch();
    const {email} = useAppSelector(state=>state.user);
    const [isJoinBtnDisabled, setIsJoinBtnDisabled] = useState(false);
    const [communityJoined, setCommunityJoined] = useState(false);
    const [displayPic, setDisplayPic] = useState('');
    const [isMod, setIsMod] = useState(false);  

    const handleJoinBtn = useCallback(()=>{
    (async()=>{
      setIsJoinBtnDisabled(true)
        try {
            if (!email) {
                dispatch(setShowLoginSignup(true));
                return
            }  
            await updateJoin(communityID, communityJoined? 'leave': 'join');
        } catch (error) {
            handleError(error)
        }
        setIsJoinBtnDisabled(false)
    })()
  }, [communityID, communityJoined, email]);

    useEffect(()=>{
        if (communityID) {
            const unsub = listenToCommunityData(communityID, 
                (val)=>{
                    const dpVal = (val as Community).dp;
                    setDisplayPic(dpVal || '');
                    if (!email) {
                      return
                    }
                    const flag = (val as Community)?.members?.includes(email)? true : false;
                    setCommunityJoined(flag);
                    const isModVal =  !!(val as Community).moderators?.includes(email);
                    setIsMod(isModVal);
                }, err=>{
                    handleError(err)
                })
            return unsub;
        } 
       
    }, [communityID, email]);

    useEffect(()=>{
      if (!email) {
        setIsMod(false);
        setCommunityJoined(false);
      }
    }, [email])

  return (
    <div className='z-0'>
          <div className='w-full h-[80px] bg-blue-500'>

          </div>
          <div className='bg-white'>
            <div className='max-w-[1000px] mx-auto '>
              <div className='flex items-center relative'>
                <CommunityPic 
                  isMod={isMod}
                  displayPic={displayPic} communityID={communityID} 
                />
                <div className='flex ml-[70px] my-2'>
                  <div className='flex flex-col ml-6 mr-4'>
                    <span className='font-bold text-2xl mr-4'>{communityID}</span>
                    <span className='text-sm text-gray-500 font-bold'>r/{communityID}</span>
                  </div>
                  
                  <button 
                    disabled={isJoinBtnDisabled}
                    onClick={handleJoinBtn}
                    className={` border font-bold rounded-full h-9 w-28 mr-2
                        ${communityJoined?
                            'border-blue-500  text-blue-500 bg-white  hover:bg-blue-50':
                            'bg-blue-500 text-white hover:bg-blue-400'
                        }`}
                  >
                    {communityJoined? 
                        'Joined': 
                        'Join'
                    }   
                  </button>
                  <button className='border border-blue-500 rounded-full text-blue-500 inline-flex items-center w-9 h-9 justify-center'>
                    <BsFillBellFill className='w-5 h-5'/>
                  </button>
                </div>
              </div>
              <div>
                <button className='text-sm font-semibold border-b-[3px] px-2 mx-2 border-blue-500'>
                  Posts
                </button>
                <button className='text-sm font-semibold px-2 mx-2 text-gray-500'>
                  Discord
                </button>
              </div>
            </div>
          </div>
          
      </div>
  )
}