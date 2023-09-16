import { PICS } from '@/utils/constants/pics';
import { RedditPostContext , RedditPostType} from '@/utils/context/RedditPostContext';
import Image from 'next/image';
import React, { useContext } from 'react'
import { CustomLink } from './CustomLink';
import { ROUTES } from '@/utils/constants/routes';
import { BsDot } from 'react-icons/bs';
import { formatDateFromNow, formatString } from '@/utils/helpers';
import { postTypesConst } from '@/utils/firebase/types';

type Props = {}

export const PostHeader = (props: Props) => {
  const {communityID, postedby, createdAt, postTitle, type,postedbyPic
    } = useContext(RedditPostContext) as RedditPostType;
  return (
    <>  
       <div className='flex w-full items-center p-2 '>
          <Image 
            src= {postedbyPic || PICS.defaultPic}
            alt='posted-by-pic'
            className='rounded-full object-center mr-1'
            width={20}
            height={20}
          />
          {type=== postTypesConst.COMMUNITY?
              <CustomLink 
                to={ROUTES.R_SLASH(communityID)}
                className='text-xs font-bold hover:underline'>
                r/{communityID}
              </CustomLink>:
                <CustomLink 
                to={ROUTES.PROFILE(communityID)}
                className='text-xs font-bold hover:underline'>
                u/{communityID}
              </CustomLink>
          }
           <BsDot className='text-gray-500 w-4 h-4'/>
           <span className='inline-flex text-xs text-gray-400 font-medium'> 
            Posted by
            {postedby &&
              <CustomLink to={ROUTES.PROFILE(postedby)} className='hover:underline mx-1 '>
              {formatString(`u/${postedby}`, 30)}
            </CustomLink>}
           {formatDateFromNow(createdAt)} 
          </span>
       </div>
    </>
  )
} 