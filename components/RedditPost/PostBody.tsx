import { RedditPostContext, RedditPostType } from '@/utils/context/RedditPostContext';
import React, { useContext } from 'react'

export const PostBody = () => {
  const {postImage, postTitle} = useContext(RedditPostContext) as RedditPostType;
  return (
    <div >
      {postTitle && <div className='mx-4 capitalize font-semibold text-lg line-clamp-1'>
        {postTitle} 
      </div>}
      <div className='max-h-[600px] overflow-hidden relative'>
        {postImage && <img 
            alt='post-img'
            src={postImage}
            className='mt-2 mx-auto w-full object-contain'
        />} 
        <div className='absolute bottom-0 w-full h-8'
          >
 {/* //  after:absolute after:content-[""] after:w-full after:h-12 after:z-10 
            //  after:bg-gradient-to-b after:from-white-rgba-2 after:to-white-rgba-1
            //   after:bottom-0 after:left-0 */}
        </div>
      </div>
     
    </div>
  )
} 
