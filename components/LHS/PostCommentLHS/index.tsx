import { RedditPost } from '@/components/RedditPost'
import React, { useContext } from 'react'
import { CommentSection } from './CommentSection'
import { CommentForm } from './CommentForm'
import { PostCommentContext } from '@/utils/context/PostCommentContext'
import { Post } from '@/utils/firebase/types'

export const PostCommentLHS = () => {
  const value = useContext(PostCommentContext) as Post;
  return (
    <div className='bg-white mb-4'>
      <RedditPost {...value} postComment={true}/>
      <CommentForm /> 
      <CommentSection /> 
  </div>
  ) 
}   