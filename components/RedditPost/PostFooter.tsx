import React, { useContext, useState } from 'react'
import { CustomBtn } from './CustomButton'
import { RedditPostContext, RedditPostType } from '@/utils/context/RedditPostContext';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/utils/constants/routes';
import { BsBookmark, BsChatSquare, BsGift, BsThreeDots } from 'react-icons/bs';
import { abbreviateNumber } from 'js-abbreviation-number';
import { BiShare } from 'react-icons/bi';
import { OptionBtn } from './OptionBtn';

type Props = {
  postComment ?: boolean,
}

export const PostFooter = ({postComment}: Props) => {
  const navigate = useRouter();
  const {communityID, id: postID, totalComments
  } = useContext(RedditPostContext) as RedditPostType;

  const handleNavigatePost = ()=>{ 
    postID && navigate.push(ROUTES.POST_COMMENT({communityID, postID}))
  } 
    
  return (
    <ul className='flex text-xs font-bold text-gray-500 p-1'>
      <li>
        <CustomBtn
            disabled={postComment}
            onClick={handleNavigatePost}
            className='inline-flex items-center disabled:opacity-50 hover:bg-gray-100 p-2 disabled:hover:bg-white'>
            <BsChatSquare className='w-5 h-5 mr-2'/>
            {abbreviateNumber(totalComments || 0, 1)} comments
        </CustomBtn>
      </li>
      <li>
        <CustomBtn className='inline-flex items-center hover:bg-gray-100 p-2'>
            <BsGift className='w-5 h-5 mr-2'/>
            Award
        </CustomBtn>
      </li>
      <li>
        <CustomBtn className='inline-flex items-center hover:bg-gray-100 p-2'>
            <BiShare className='w-5 h-5 mr-2'/>
            Share
        </CustomBtn>
      </li>
      <li>
          <CustomBtn className='inline-flex items-center hover:bg-gray-100 p-2'>
              <BsBookmark className='w-5 h-5 mr-2'/>
              Save
          </CustomBtn>
      </li>
      {postComment && (
        <li className='relative'>
          <OptionBtn />
        </li>
      )}
      
    </ul>
  )
} 