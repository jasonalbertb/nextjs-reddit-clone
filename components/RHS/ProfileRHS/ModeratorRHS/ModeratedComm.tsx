import { PICS } from '@/utils/constants/pics'
import { ROUTES } from '@/utils/constants/routes';
import { listenToCommunityData, updateJoin } from '@/utils/firebase/functions';
import { Community } from '@/utils/firebase/types'
import { handleError } from '@/utils/helpers/errors';
import { useAppDispatch, useAppSelector } from '@/utils/redux/hooks';
import { setShowLoginSignup } from '@/utils/redux/loginSignupSlice';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react'




export const ModeratedComm = ({id: communityID, members=[]}: Community) => {
    const dispatch = useAppDispatch();
    const {email} = useAppSelector(state=>state.user);

    const [isJoinBtnDisabled, setIsJoinBtnDisabled] = useState(false);
    const [communityJoined, setCommunityJoined] = useState(false);

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
                console.log(error);
                
                handleError(error)
            }
            setIsJoinBtnDisabled(false)
        })()
      }, [communityID, communityJoined, email]);

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
        <li className='flex justify-between my-2'>
                    <div className='flex'>
                        <img src={PICS.defaultCommPic} alt='com_pic' 
                            className='w-8 h-8 object-center rounded-full mr-2'/>
                        <div className='flex flex-col text-xs font-semibold'>
                            <Link href={ROUTES.R_SLASH(communityID)} 
                                className='line-clamp-1 hover:underline'>{`r/${communityID}`} </Link>
                            <h2>{members.length} member</h2>
                            
                        </div>
                    </div>

                    <button
                        className={`rounded-full px-4  font-semibold disabled:opacity-50 group text-sm group
                            ${communityJoined? 'bg-white border border-blue-500 text-blue-500': 
                            'bg-blue-500 text-white hover:opacity-90'}`}
                        onClick={handleJoinBtn}
                        disabled={isJoinBtnDisabled}
                    >
                        {communityJoined? (
                            <>
                                <span className='inline-block group-hover:hidden'>Joined</span> 
                                <span className='hidden group-hover:inline-block'>Leave</span>
                            </>
                        ): 'Join'}
                    </button>
        </li>
    )
}