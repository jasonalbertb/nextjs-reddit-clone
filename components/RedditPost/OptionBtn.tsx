import React, { useContext, useRef, useState } from 'react'
import { CustomBtn } from './CustomButton'
import { BsThreeDots } from 'react-icons/bs'
import { useOutsideClick } from '@/utils/hooks/useOutsideClick'
import { useEscapeKey } from '@/utils/hooks/useEscapeKey'
import { FiFlag, FiTrash } from 'react-icons/fi'
import { useAppDispatch, useAppSelector } from '@/utils/redux/hooks'
import { handleError } from '@/utils/helpers/errors'
import { deleteCommunityPost } from '@/utils/firebase/functions'
import { RedditPostContext, RedditPostType } from '@/utils/context/RedditPostContext'
import { setShowLoginSignup } from '@/utils/redux/loginSignupSlice'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/utils/constants/routes'


export const OptionBtn = ( )=> {
    const {id: postID, authorID, type, communityID
    } = useContext(RedditPostContext) as RedditPostType;
    const navigate = useRouter();
    const dispatch = useAppDispatch();

    const {email} = useAppSelector(state=>state.user);
    const ref = useRef<HTMLDivElement| null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [handleDeleteBtnDisabled, setHandleDeleteBtnDisabled] = useState(false);
    const handleDeleteBtn =()=>{
        setHandleDeleteBtnDisabled(true);
        (async()=>{  
            try {
                if (!postID) {
                    return
                }
                if (!email) {
                    dispatch(setShowLoginSignup(true));
                }
                if (type === 'community') {
                    await deleteCommunityPost({communityID, postID})
                    navigate.push(ROUTES.DASHBOARD)
                }
               
            } catch (error) {
                handleError(error)
            }
        })()
        setHandleDeleteBtnDisabled(false);
    }
    const handleClose = ()=>{setIsModalOpen(false)};
    const handleOptionBtn = ()=>{
        setIsModalOpen(prev=>!prev)
    }

    useOutsideClick({handleClose, ref})
    useEscapeKey(handleClose)
    return (
        <div ref={ref}>
            <CustomBtn 
                onClick={handleOptionBtn}
                className='inline-flex items-center hover:bg-gray-100 p-2 focus:outline-none'>
                <BsThreeDots className='w-5 h-5 mr-2'/>
            </CustomBtn>
            {isModalOpen && (
                <div className='flex flex-col absolute  shadow border bg-white w-40'>
                    {email && authorID === email && (
                        <CustomBtn
                            disabled={handleDeleteBtnDisabled}
                            onClick={handleDeleteBtn} 
                            className='inline-flex items-center text-sm font-semibold text-gray-500 p-1 
                            border-b hover:bg-gray-200 disabled:opacity-50'>
                            <FiTrash className='mr-2'/> <span>Delete Post</span>
                        </CustomBtn>
                    )}
                    
                    <CustomBtn 
                        className='inline-flex items-center text-sm font-semibold text-gray-500 p-1 border-b hover:bg-gray-200'>
                         <FiFlag className='mr-2'/> <span>Report</span>
                    </CustomBtn>
                </div>
            )}
        </div>
     )
}