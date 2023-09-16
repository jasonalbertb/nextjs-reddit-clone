import { ContextType, CreatePostContext } from '@/utils/context/CreatePostContext';
import React, { useContext } from 'react'

type Props = {}

export const PostTab = (props: Props) => {
  const {postBody, setPostBody} = useContext(CreatePostContext) as ContextType;
  return (
    <div>
      <textarea 
        value={postBody}
        onChange={e=>setPostBody(e.target.value)}
        className='outline-none border w-full min-h-[140px] border-gray-200 rounded-md p-4 py-2'
        placeholder='Text (optional)'
      >        
      </textarea>
      
    </div>
  )
}