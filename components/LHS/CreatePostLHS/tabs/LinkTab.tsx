import { ContextType, CreatePostContext } from '@/utils/context/CreatePostContext';
import React, { useContext } from 'react'

export const LinkTab = () => {
  const {postLink, setPostLink} = useContext(CreatePostContext) as ContextType;
  return (
    <div>
    <textarea 
      placeholder='Url'
      value={postLink} onChange={e=>setPostLink(e.target.value)}
      className='outline-none text-sm rounded-md focus-within:border focus-within:border-black
        w-full h-20 px-4 py-2 border'>

    </textarea>
    </div>
  )
}
