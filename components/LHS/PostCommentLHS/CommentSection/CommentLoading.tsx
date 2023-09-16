import React from 'react'
import Skeleton from "react-loading-skeleton";
export const CommentLoading = () => {
  return (
    <div className='p-2 px-4'>
        <div className=' flex items-center'>
            <div className='leading-none overflow-hidden w-8 h-8 rounded-full border mr-2'>
                <Skeleton width={"100%"} height={"100%"}/>
            </div>
            <div className='leading-none overflow-hidden w-80 h-4 border'>
                <Skeleton width={"100%"} height={"100%"}/>
            </div>
        </div>
        <div className='leading-none overflow-hidden flex-1  border my-1 ml-12'>
            <Skeleton width={"100%"} height={"100%"}/>
        </div>
    </div>
  )
}
