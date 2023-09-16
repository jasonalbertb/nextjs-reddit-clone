import { PICS } from '@/utils/constants/pics';
import { ROUTES } from '@/utils/constants/routes';
import { getCommunityData } from '@/utils/firebase/functions';
import { Community } from '@/utils/firebase/types';
import { handleError } from '@/utils/helpers/errors';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { FaRegStar } from 'react-icons/fa'
import Skeleton from "react-loading-skeleton";

type Props = {
    communityID: string
}

export const CommunityItem = ({communityID}: Props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [dp, setDp] = useState('');

    useEffect(()=>{
        setIsLoading(true);
       (async()=>{
            try {
               const data = await getCommunityData(communityID) 
               if (data) {
                    setDp((data as Community).dp || '');
               }
            } catch (error) {
                handleError(error)
            }
        })()
        setIsLoading(false);
    }, [communityID])
    
    return (
        <Link
            href={ROUTES.R_SLASH(communityID)} 
            className='flex justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer'>
            <span className='inline-flex items-center text-sm'>
            {isLoading?             
                <div className='leading-none overflow-hidden w-5 h-5 mr-2  rounded-full'>
                    <Skeleton width={"100%"} height={"100%"}/>
                </div>: 
                <img src={dp || PICS.defaultCommPic} className='w-5 h-5 bg-center rounded-full mr-2' alt='icon'/>
            }
            
            <span>r/{communityID}</span>
            </span>
            <FaRegStar />
        </Link>
  )
}