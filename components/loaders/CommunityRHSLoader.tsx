import React from 'react'
import Skeleton from "react-loading-skeleton";

export const CommunityRHSLoader = () => {
    // 
  return ( 
    <div className='w-full h-[400px] border  bg-white p-4 pt-8'>
        <div className='flex items-center'>
            <div className='leading-none overflow-hidden w-14 h-14 rounded-full border'>
                <Skeleton width={"100%"} height={"100%"}/>
            </div>
            <div className='leading-none overflow-hidden w-1/2 h-4 ml-2'>
                <Skeleton width={"100%"} height={"100%"}/>
            </div>
        </div>
        <div className='leading-none overflow-hidden w-full h-4 my-2'>
            <Skeleton width={"100%"} height={"100%"}/>
        </div>
        <div className='leading-none overflow-hidden w-full h-4 my-2'>
            <Skeleton width={"100%"} height={"100%"}/>
        </div>
        <div className='leading-none overflow-hidden w-full h-4 my-2'>
            <Skeleton width={"100%"} height={"100%"}/>
        </div>
        <div className='leading-none overflow-hidden w-1/2 h-4 my-4'>
            <Skeleton width={"100%"} height={"100%"}/>
        </div>

        <div className='leading-none overflow-hidden w-full h-8  rounded-full'>
            <Skeleton width={"100%"} height={"100%"}/>
        </div>
    </div>
  )
}
