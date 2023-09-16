import { deletePostComment } from '@/utils/firebase/functions';
import { handleError } from '@/utils/helpers/errors';
import { useAppDispatch, useAppSelector } from '@/utils/redux/hooks';
import { setShowLoginSignup } from '@/utils/redux/loginSignupSlice';
import React, { useRef, useState } from 'react'
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { FiFlag, FiTrash } from 'react-icons/fi';

type Props = {
  commentBy: string, 
  commentID ?: string,
  postID: string
}

export const CommentOptionBtn = ({commentBy, commentID, postID}: Props) => {
  const ref = useRef<HTMLDivElement | null>( null);
  const dispatch = useAppDispatch();
  const {email} = useAppSelector(state => state.user);
  const [showModal, setShowModal] = useState(false);
  const [isDeleteBtnDisabled, setIsDeleteBtnDisabled] = useState(false);
  
  const handleBtn = ()=>{
    if (!email) {
      dispatch(setShowLoginSignup(true));
      setShowModal(false);
      return
    }
    setShowModal(prev=>!prev)
  }

  const handleDeleteBtn = async ()=>{
    if (!email) {
      dispatch(setShowLoginSignup(true));
      setShowModal(false);
      return
    }
    setIsDeleteBtnDisabled(true);
    try {
      commentID && await deletePostComment({commentID, postID, commentBy})
    } catch (error) {
      handleError(error)
    }

    setIsDeleteBtnDisabled(false);
  }

  return (
    <div ref={ref} className='relative'>
      <button
        onClick={handleBtn} 
        className='mx-1 inline-flex items-center h-6 px-1 cursor-pointer hover:bg-gray-200 rounded-sm'>
        <span className='text-xs font-bold text-gray-500 ml-1'>
            <BiDotsHorizontalRounded className='w-5 h-5'/>
        </span>
      </button>
      {showModal && (
        <div className='flex flex-col absolute  shadow border bg-white w-40'>
          {commentBy === email && (
            <button 
              disabled={isDeleteBtnDisabled}
              onClick={handleDeleteBtn}
              className='inline-flex items-center text-sm font-semibold text-gray-500 p-1 border-b hover:bg-gray-200'>
              <FiTrash className='mr-2'/> Delete comment
            </button>
          )}
          
          <button className='inline-flex items-center text-sm font-semibold text-gray-500 p-1 border-b hover:bg-gray-200'>
            <FiFlag className='mr-2'/> Report
          </button>
        </div>
      )}
    </div>
  )
}