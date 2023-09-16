import React from 'react'

type Props = {}

export const CreatePostRHS = (props: Props) => {
  return (
    <div className='bg-white rounded-lg shadow p-2 px-4  mt-16'>
      <div className='flex items-center border-b py-2 font-medium'>
          <img src='/images/reddit-icon.png' alt='reddit icon' className='w-8 h-8 mr-2' />
          <span>Posting to Reddit</span>
      </div>
      <ol className='list-decimal list-inside text-[14px] pb-2 font-medium'>
          <li className='border-b py-1.5'>Remember the human</li>
          <li className='border-b py-1.5'>Behave like you would in real life</li>
          <li className='border-b py-1.5'>Look for the original source of content</li>
          <li className='border-b py-1.5'>Search for duplicates before posting</li>
          <li className='border-b py-1.5'>Read the community's rules</li>
      </ol>
    </div>
  )
} 