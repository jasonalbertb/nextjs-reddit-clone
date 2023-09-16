import { ROUTES } from '@/utils/constants/routes';
import { addPostComment } from '@/utils/firebase/functions';
import { handleError } from '@/utils/helpers/errors';
import { useAppDispatch, useAppSelector } from '@/utils/redux/hooks';
import { setShowLoginSignup } from '@/utils/redux/loginSignupSlice';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export const CommentForm = () => {
  const dispatch = useAppDispatch();
  const {username, email} = useAppSelector(state=>state.user);
  const [commentInput, setCommentInput] = useState('');
  const [isCommentDisabled, setIsCommentDisabled] = useState(true);
  const postID = useParams().postID as string;
  const handleCommentBtn = async()=>{
    try {
      setIsCommentDisabled(true)
      if (!email) {
        dispatch(setShowLoginSignup(true));
      }
      await addPostComment({
        content : commentInput,
        postID : postID, 
      })
      setCommentInput('');
      setIsCommentDisabled(false)
    } catch (error) {
      handleError(error)
    }
    
  }

  
  useEffect(()=>{
    setIsCommentDisabled(commentInput === '')
  }, [commentInput])
  
  return (
    <div className='my-4 mx-10'>
      {username && (
          <div className='flex items-center text-sm my-1'>
            <span className='mr-1'>Comment as</span> 
            <Link className='hover:underline text-blue-400' href={`${ROUTES.PROFILE(username)}`}>
              {username}
            </Link>
          </div>
        )
      }
      <div className='h-[140px] flex flex-col border  focus-within:border-black rounded-md overflow-hidden'>
        <textarea 
          className='flex-1 h-[160px]  p-2 px-4 outline-none'
          value={commentInput} onChange={e=>setCommentInput(e.target.value)}
          placeholder='What are your thoughts?'
        />
        <div className='bg-gray-100 items-center px-2 flex justify-end'>
          <button 
            disabled={isCommentDisabled}
            onClick={handleCommentBtn}
            className='rounded-full bg-blue-500 text-sm font-bold text-white px-6 py-0.5 my-1 disabled:bg-blue-300'>
            Comment
          </button>
        </div>
      </div>
    </div>
  )
} 