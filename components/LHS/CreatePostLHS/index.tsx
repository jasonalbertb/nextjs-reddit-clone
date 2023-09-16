import { SearchCommunities } from '@/components/inputs/SearchCommunities';
import { communitySearchParams } from '@/utils/constants/routes';
import { tabs } from '@/utils/constants/tabs';
import { CreatePostProvider } from '@/utils/context/CreatePostContext';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { PostFormFooter } from './PostFormFooter';

type Props = {
  communityID?: string
}
const titleLimitLen = 300;

export const CreatePostLHS = ({communityID=''}: Props) => {
  const searchParams = useSearchParams();
  const [postTitle, setPostTitle] = useState(''); 
  const [communityInput, setCommunityInput] = useState(communityID);
  const [postBody, setPostBody] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const [imgURL, setImgURL] = useState('');
  const [postLink, setPostLink] = useState('');
  const [activeTab, setActiveTab] = useState(()=>{
    if(searchParams.get(communitySearchParams.MEDIA) === 'true'){
      return 1;
    }else if(searchParams.get(communitySearchParams.URL) === 'true'){
      return 2
    }else{
      return 0;
    }
  });
  
  //methods
  const handleTabBtn = (index: number)=>{
    return ()=>{
      setActiveTab(index)
    }
  }
  const handleTitleOnchange =(e: React.ChangeEvent<HTMLInputElement>)=>{
    const {value} = e.target;
    if (value?.length > titleLimitLen) return;
    setPostTitle(value)
  }

  return (
    <CreatePostProvider
      value={{
        postTitle, 
        communityInput, setCommunityInput,
        postBody, setPostBody,
        selectedTags, setSelectedTags,
        imgURL, setImgURL,
        postLink, setPostLink
      }}
    > 
      <div> 
        <div className='flex justify-between mt-5 border-b border-white pb-3'>
          <span className='font-semibold text-lg'>Create Post</span> 
          <button 
            type='button'
            className='text-xs font-bold text-blue-500 hover:bg-gray-300 px-3 rounded-full '>
              DRAFTS</button> 
        </div>
        <div className='mt-4 mb-2'>
          <SearchCommunities />
        </div>
        <div className='bg-white rounded-md'>
          <ul className='flex '>
          {tabs.map((item, index)=>{
              const {Icon} = item;
              return (
                <li className='flex-1 r' key={item.name}>
                  <button
                    onClick={handleTabBtn(index)}
                    disabled={item.disabled}
                    className={
                      `inline-flex items-center py-3 px-2  w-full justify-center border-b-2 hover:bg-blue-50
                      disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed
                      ${activeTab===index ? 'text-blue-500 border-blue-500 bg-blue-50': 
                        'text-gray-500 border-blue-50'}`}
                  >
                    <Icon className='w-6 h-6 mr-2 flex-none'/>
                    <span className='capitalize text-sm font-semibold flex-none'>{item.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          <div className='p-4'>
            <div className='relative mb-2'>
              <input 
                  placeholder='Title'
                  className='
                    p-2 text-sm pl-4 pr-16
                    rounded-md w-full outline-none border border-gray-200 focus-within:border-black'
                  value={postTitle} onChange={handleTitleOnchange}
                />
              <span className='absolute right-4 top-1/2 translate-y-[-50%] text-xs font-bold text-gray-500'>
                {`${postTitle.length}/${titleLimitLen}`}
              </span>
            </div>
            {tabs[activeTab].Tab}
            <PostFormFooter />
          </div>
        </div>
      </div>
    </CreatePostProvider>
  )
} 
