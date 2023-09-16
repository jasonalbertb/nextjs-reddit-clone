import React, { useEffect, useState } from 'react'
import { Comment, User  } from '@/utils/firebase/types';
import { CommentLoading } from './CommentLoading';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/utils/redux/hooks';
import { getUserData, listenToCommentData, listenToPostChildrenComments } from '@/utils/firebase/functions';
import { handleError } from '@/utils/helpers/errors';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants/routes';
import { PICS } from '@/utils/constants/pics';
import { BsDot } from 'react-icons/bs';
import { formatDateFromNow } from '@/utils/helpers';
import { CommentBtns } from './CommentBtns';
import { setShowLoginSignup } from '@/utils/redux/loginSignupSlice';
import { CommentReplyInput } from '../CommentReplyInput';


export const CommentComponent = ({ id:commentID, }: Comment) => {
  
  const postID = useParams().postID as string;
  const {email} = useAppSelector(state=>state.user);
  const dispatch = useAppDispatch();
  const [commentData, setCommentData] = useState<Comment | null>(null);
  const [commentByData, setCommentByData] = useState<User | null>(null);
  const [childrenComments, setChildrenComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReplyModal, setShowReplyModal] = useState(false);

  
  const handleReplyBtn = ()=>{
    if (!email) {
      dispatch(setShowLoginSignup(true))
      return
    }
    setShowReplyModal(prev=>!prev)
  }
  

  //hooks
  useEffect(()=>{
    if (commentID) {
      const unsub = listenToCommentData({commentID, setCommentData});
      return unsub;
    }
  }, [commentID]);

  useEffect(()=>{
    if (commentData) {
      (async()=>{
        try {
          const data = await getUserData(commentData.commentBy);
          if (data) {
            setCommentByData(data);
            setIsLoading(false)
          }
        } catch (error) {
          handleError(error)
        }
      })() 
    }
  }, [commentData]);


  useEffect(()=>{
    const unsub = listenToPostChildrenComments({
      postID,
      setChildrenComments,
      parent : commentID
    });

    return unsub;
  }, [ postID, commentID]);

  // useEffect(()=>{
  //   dispatch(setShowLoginSignup(!email))
  // }, [email])
  
  if (!commentByData || !commentData) {
    return <></>
  }
  if (isLoading) { 
    return <CommentLoading />
  } 
  

  return (
    <div  className='p-4 py-1 w-full flex' >
      {/* left side */}
      <div className='flex items-center flex-col '>
        <Link 
          href={`${ROUTES.PROFILE(commentByData.username)}`}
          className='flex items-center'>
            <div className='w-8 h-8 overflow-hidden rounded-full'>
              <img 
                alt='pfp'
                className='object-center border'
                src={commentByData.display_pic || PICS.defaultPic}
              />
            </div>
        </Link>
        <div className='border hover:border-blue-500 flex-1 w-0 my-2'></div>
      </div>
       {/* right side */}
       <div className='p-2 w-full'>
          <div className='flex items-center'>
            <Link 
              href={`${ROUTES.PROFILE(commentByData.username)}`}
              className='flex items-center'>
              <span className='text-xs font-bold hover:underline cursor-pointer'>{commentByData.username}</span>
            </Link> 
            <BsDot className='text-gray-500' />
            <span className='text-gray-500 text-xs'>{formatDateFromNow(commentData.createdAt)}</span>
          </div>
          <div className='my-1 text-sm'>{commentData.content}</div>
          <CommentBtns {...commentData} handleReplyBtn={handleReplyBtn}/>
          {showReplyModal && <CommentReplyInput 
            parent={commentID} postID={commentData.postID}
            setShowReplyModal={setShowReplyModal}
          />}
          {childrenComments.map((item, index)=>{
            return <CommentComponent key={index} {...item} />
          })}
        </div>
    </div> 
  )
}