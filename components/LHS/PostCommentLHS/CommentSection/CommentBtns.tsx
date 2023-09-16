import { VoteType } from '@/utils/constants/votes'
import { updatePostCommentVote } from '@/utils/firebase/functions'
import { Comment } from '@/utils/firebase/types'
import { useAppDispatch, useAppSelector } from '@/utils/redux/hooks'
import { setShowLoginSignup } from '@/utils/redux/loginSignupSlice'
import React, { useState } from 'react'
import { BiComment, BiDownvote, BiSolidDownvote, BiSolidUpvote, BiUpvote } from 'react-icons/bi'
import { CommentOptionBtn } from './CommentOptionBtn'
import { formatNumber } from '@/utils/helpers'

interface Props extends Comment {
    handleReplyBtn : () => void
}

export const CommentBtns = ({
        handleReplyBtn, id:commentID, upvoteIDs=[], 
        downvoteIDs=[], postID, commentBy}: Props
    ) => {
    const dispatch = useAppDispatch();
    const {email} = useAppSelector(state=>state.user);
    const [isVoteBtnDisabled, setIsVoteBtnDisabled] = useState(false);

    const handleVote = (type: VoteType)=>{
        return async()=>{
            try {
                if (!email) {
                    dispatch(setShowLoginSignup(true))
                    return
                }
                setIsVoteBtnDisabled(true)
                await updatePostCommentVote({commentID,type})
            } catch (error) {
                console.log( error);
            }
            setIsVoteBtnDisabled(false)
        }
    }

    return (
        <div className='flex items-center my-2'>
            <button 
                onClick={handleVote('upvote')}
                disabled={isVoteBtnDisabled} className='disabled:opacity-50'>
                {email && upvoteIDs.includes(email)?
                    <BiSolidUpvote 
                        className={`w-6 h-7 text-orange-500 hover:text-orange-300 hover:bg-orange-100 disabled:opacity-50`}/>:
                    <BiUpvote 
                        className={`w-6 h-6 text-gray-400 hover:text-red-300 disabled:opacity-50`}/> 
                }
                
            </button>
            <span className='text-xs font-bold mx-2'>{formatNumber(upvoteIDs.length - downvoteIDs.length)}</span>
            <button 
                onClick={handleVote('downvote')}
                disabled={isVoteBtnDisabled} className='disabled:opacity-50'>
                {email && downvoteIDs.includes(email)?
                    <BiSolidDownvote 
                        className={`w-6 h-7 text-blue-500 hover:text-blue-300 hover:bg-blue-100 disabled:opacity-50`}/>:
                    <BiDownvote 
                        className={`w-6 h-6 text-gray-400 hover:text-blue-300 disabled:opacity-50`}/> 
                }
               
            </button>
            <div className='flex mx-1 items-center '>
                <button
                    onClick={handleReplyBtn}
                    className='mx-1 inline-flex items-center h-8 px-2 cursor-pointer hover:bg-gray-200 rounded-sm'>
                    <BiComment 
                        className='w-6 h-6 text-gray-400 translate-y-[2px]'/>
                    <span className='text-xs font-bold text-gray-500 ml-1'>Reply</span>
                </button>
                <button className='mx-1 inline-flex items-center h-8 px-2 cursor-pointer hover:bg-gray-200 rounded-sm'>
                    <span className='text-xs font-bold text-gray-500 ml-1'>Share</span>
                </button>
                <CommentOptionBtn commentID={commentID} postID={postID} commentBy={commentBy}/>
            </div>
        </div>
    )
}