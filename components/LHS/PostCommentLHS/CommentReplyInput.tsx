import { addPostComment } from '@/utils/firebase/functions';
import { handleError } from '@/utils/helpers/errors';
import React, { useEffect, useState } from 'react'

type Props = {
  parent ?: string,
  postID: string,
  setShowReplyModal:React.Dispatch<React.SetStateAction<boolean>> 
}

export const CommentReplyInput = ({parent, postID, setShowReplyModal}: Props) => {
  const [isReplyBtnDisabled, setIsReplyBtnDisabled] = useState(false);
  const [replyInput, setReplyInput] = useState('');

  const handleReplyBtn = async()=>{
    try {
      setIsReplyBtnDisabled(true);
      await addPostComment({
        content: replyInput,
        parent,
        postID
      })
    } catch (error) {
      handleError(error)
    }
    setShowReplyModal(false)
  }

  useEffect(()=>{
    setIsReplyBtnDisabled(replyInput === '')
  }, [replyInput])

  return (
    <div className='border focus-within:border-black rounded overflow-hidden '>
        <textarea 
          value={replyInput} onChange={e=>setReplyInput(e.target.value)}
          className='outline-none flex-1 h-[80px] w-full px-4 py-2'
          placeholder='What are your thoughts'>

        </textarea>
        <div className='flex justify-end bg-gray-200 px-2'>
          <button 
            disabled={isReplyBtnDisabled}
            onClick={handleReplyBtn}
            className='rounded-full bg-blue-500 text-sm font-bold 
            text-white px-6 py-0.5 my-1 disabled:opacity-50 hover:opacity-90'>
            Reply
          </button>
        </div>
    </div>
  )
}