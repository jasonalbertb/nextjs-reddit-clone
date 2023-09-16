import { ROUTES } from '@/utils/constants/routes';
import { RedditPostProvider } from '@/utils/context/RedditPostContext';
import { Community, Post, User } from '@/utils/firebase/types';
import { useAppDispatch, useAppSelector } from '@/utils/redux/hooks';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { CustomBtn } from './CustomButton';
//icons
import { BiDownvote, BiSolidDownvote, BiSolidUpvote, BiUpvote } from 'react-icons/bi';
import { getCommunityData, getUserData, listenToRedditPost, updateRedditPostVote } from '@/utils/firebase/functions';
import { handleError } from '@/utils/helpers/errors';
import { formatNumber } from '@/utils/helpers';
import { setShowLoginSignup } from '@/utils/redux/loginSignupSlice';
import { PostHeader } from './PostHeader';
import { PostBody } from './PostBody';
import { PostFooter } from './PostFooter';
import { VoteType } from '@/utils/constants/votes';

export interface Props extends Post{
  postComment ?: boolean
}

export const RedditPost = (params: Props) => {
  const {id:postID, postComment, authorID, type, communityID} = params;
  const navigate = useRouter();
  const dispatch = useAppDispatch();
  const {email} = useAppSelector(state=>state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [downvoteIDs, setDownvoteIDs] = useState<string[]>([]);
  const [upvoteIDs, setUpvoteIDs] = useState<string[]>([]);
  const [isVoteBtnDisabled, setIsVoteBtnDisabled] = useState(false);
  const [postedby, setPostedBy] = useState<string | null>(null);
  const [postedbyPic, setPostedbyPic] = useState<string | null>(null);

  const handleNavigatePost = ()=>{
    if (postComment || !postID) { 
      return
    } 
    if (type === 'community') {
      navigate.push(ROUTES.POST_COMMENT({communityID: communityID, postID}))
    }else{
      navigate.push(ROUTES.USER_POSTCOMMENT({communityID: communityID, postID}))
    }
    
  }
  const handleVote = (type: VoteType)=>{
    return async()=>{
      if (!email) {
        dispatch(setShowLoginSignup(true))
        return
      }
      setIsVoteBtnDisabled(true)
      await (async()=>{
        try {
          await updateRedditPostVote({postID,  type })
        } catch (error) {
          handleError(error) 
        }
      })();
      setIsVoteBtnDisabled(false)
    }
  } 

  //hooks
  useEffect(()=>{
    if(postID){
      const unsub = listenToRedditPost({postID, setPostData: (data)=>{
        if (data) {
          setUpvoteIDs(data.upvoteIDs);
          setDownvoteIDs(data.downvoteIDs);
        } 
      }})  
      return unsub;
    }
  }, [postID] )


  useEffect(()=>{
      setIsLoading(true);
      (async()=>{
        try {
          const data = await getUserData(authorID) as User;
          if (!data) {
            throw new Error('Post Author does not exist');
          }
          setPostedBy(data.username);
          if (type === 'community') {
            const comData = await getCommunityData(communityID) 
            if(!comData) throw new Error('Community does not exist!');
            const dp = (comData as Community)?.dp || null; 
            setPostedbyPic(dp)
          }else{
            setPostedbyPic(data?.display_pic || null);
          }
          setIsLoading(false);
        } catch (error) {
          handleError(error)
        }
    })()
 
  }, [authorID, communityID])

  if (isLoading) {
    return <></>
  }

    return (
      <RedditPostProvider
        value={{
          ...params, postedby ,postedbyPic, handleVote
        }}
      >
          <div 
            onClick={handleNavigatePost}
            className='bg-white rounded-md flex cursor-pointer mb-3'
          >
            <div className='bg-gray-50 flex flex-col items-center p-2'>
                <CustomBtn
                  onClick={handleVote('upvote')}
                  disabled={isVoteBtnDisabled}
                  className='hover:bg-gray-100'>
                  {email && upvoteIDs?.includes(email)?
                    <BiSolidUpvote 
                      className={`w-6 h-6 text-orange-500 hover:text-orange-300 hover:bg-orange-100 disabled:opacity-50`}/>:
                    <BiUpvote 
                      className={`w-6 h-6 text-gray-400 hover:text-red-300 disabled:opacity-50`}/> 
                  }
                </CustomBtn>
                <span className={`text-xs font-bold my-1 ${email && upvoteIDs?.includes(email) && 'text-orange-500'} first-letter: 
                  ${email && downvoteIDs?.includes(email) && 'text-blue-500'}`}> 
                  {formatNumber((upvoteIDs || []).length - (downvoteIDs || []).length)}
                </span>
                <CustomBtn 
                  onClick={handleVote('downvote')}
                  disabled={isVoteBtnDisabled}
                  className='hover:bg-gray-100'>
                  {email && downvoteIDs?.includes(email)?
                    <BiSolidDownvote 
                      className={`w-6 h-6 text-blue-500 hover:text-blue-300 hover:bg-blue-100 
                      disabled:opacity-50`}/>:
                    <BiDownvote className='w-6 h-6 text-gray-400 hover:text-blue-300 disabled:opacity-50'/>
                  }
                
                </CustomBtn>
            </div>
            <div className='w-full'>
              <PostHeader />
              <PostBody /> 
              <PostFooter postComment={postComment}/>
            </div>
          </div>
      </RedditPostProvider>
    
    )
} 