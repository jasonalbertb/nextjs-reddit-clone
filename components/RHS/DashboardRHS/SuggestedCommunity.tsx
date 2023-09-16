import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react'

import {listenToCommunityData, updateJoin} from "@/utils/firebase/functions";
import { Community } from '@/utils/firebase/types';
import { PICS } from '@/utils/constants/pics';
import { ROUTES } from '@/utils/constants/routes';
import {IoMdClose} from "react-icons/io";
import { useAppDispatch, useAppSelector } from '@/utils/redux/hooks';
import { setShowLoginSignup } from '@/utils/redux/loginSignupSlice';
import { handleError } from '@/utils/helpers/errors';

interface Props extends Community {
    handleRemoveSuggestion: (id: string) => void

}

export const SuggestedCommunity = ({dp, name, id:communityID , handleRemoveSuggestion}: Props) => {
    const dispatch = useAppDispatch();
    const {email} = useAppSelector(state=>state.user);
    const [isJoinBtnDisabled, setIsJoinBtnDisabled] = useState(false);
    const [communityJoined, setCommunityJoined] = useState(false);
     const [isFadingOut, setIsFadingOut] = useState(false);
    

     const handleJoinBtn = useCallback(()=>{
        if (!communityID) {
            return
        }
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
    

     const handleRemoveBtn = useCallback(()=>{
        if (!communityID) {
            return
        }
        setIsFadingOut(true);
        const timer = setTimeout(() => handleRemoveSuggestion(communityID), 300)
        return ()=>{
            clearTimeout(timer)
        }
     }, [communityID])

     useEffect(()=>{
        if (communityID && email) {
            const unsub = listenToCommunityData(communityID, 
                (val)=>{
                    const flag = (val as Community)?.members?.includes(email)? true : false;
                    setCommunityJoined(flag)
                }, err=>{
                    handleError(err)
                })
            return unsub;
        }
       
    }, [communityID, email])

    if (!communityID) {
        return
    }
    return (
        <li className={`flex justify-between ${isFadingOut && 'animate-fadeOut'} p-2 hover:bg-gray-100`}>
            <div className='flex justify-center items-center'>
                <img src={dp || PICS.defaultCommPic} alt='com-pic' 
                    className='w-5 -h-5 rounded-full object-cover mr-2' 
                />
                <Link href={ROUTES.R_SLASH(communityID)} className='text-sm font-semibold hover:underline'>{name}</Link>
            </div>
           <div className='flex items-center'>
                <button
                    disabled={isJoinBtnDisabled}
                    onClick={handleJoinBtn} 
                    className='text-sm font-bold text-blue-500 mr-2'>
                    {communityJoined? 'Joined': 'Join'}
                </button>
                <button
                    onClick={handleRemoveBtn}
                 className='text-gray-500 opacity-50 hover:opacity-100 '>
                    <IoMdClose className='w-4 h-4'/>
                </button>
           </div>
        </li>
    )
}