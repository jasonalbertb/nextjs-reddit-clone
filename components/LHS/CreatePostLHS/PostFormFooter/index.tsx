import { TAGS } from '@/utils/constants/tags';
import { useAppDispatch, useAppSelector } from '@/utils/redux/hooks';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import { ToggleBtn } from './ToggleBtn';
import { ContextType, CreatePostContext } from '@/utils/context/CreatePostContext';
import { setShowLoginSignup } from '@/utils/redux/loginSignupSlice';
import { handleError } from '@/utils/helpers/errors';
import { createPost } from '@/utils/firebase/functions';
import { ROUTES } from '@/utils/constants/routes';
import { PostTypes } from '@/utils/firebase/types';

type Props = {}

export const PostFormFooter = (props: Props) => {
    const dispatch = useAppDispatch();
    const {email, username} = useAppSelector(state=>state.user);
    const navigate = useRouter(); 
    const [isPostBtnDisabled, setIsPostBtnDisabled] = useState(true);
   
    const {
            imgURL, communityInput,postTitle, postBody, selectedTags, postLink,
        } = useContext(CreatePostContext) as ContextType
    //hooks 
    
    const handlePost = (e: React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        if (!email) {
            dispatch(setShowLoginSignup(true));
            return
        }

       (async()=>{
            try {
                const type: PostTypes = username === communityInput? 'profile': 'community';
                await createPost({
                    communityID: communityInput,
                    postImage: imgURL,
                    postTitle, 
                    type,
                    postBody,
                    selectedTags,
                    postLink
                });
                if (username === communityInput) {
                    navigate.push(ROUTES.PROFILE(username))
                  }else{
                    navigate.push(ROUTES.R_SLASH(communityInput))
                  }
            } catch (error) {
                handleError(error)
                setIsPostBtnDisabled(false);
            }
       })()
    }
     

  useEffect(()=>{
    //disable post btn with empty data
    const flag = !(communityInput && imgURL && postTitle);
    setIsPostBtnDisabled(flag);
  },[communityInput, imgURL, postTitle])

    return (
        <>
            <ul className='flex py-4 border-b'>
                {TAGS.map(item=>{
                
                return (
                    <ToggleBtn key={item.name} {...item}/>
                )
                })}
            </ul>
            <div className='flex justify-end my-4'>
                <button 
                // disabled={true}
                className='mr-2 py-1.5 px-4 border border-gray-800 text-gray-800 rounded-full text-sm font-bold 
                disabled:cursor-not-allowed disabled:opacity-50'>
                Save Draft
                </button>
                <button 
                onClick={handlePost}
                disabled={isPostBtnDisabled}
                className='px-4 py-1.5 rounded-full bg-red-500 font-bold text-sm text-white
                disabled:cursor-not-allowed disabled:bg-red-200'>
                Post
                </button>
            </div>
        </>
    )
}