'use client'

import { ChangeEvent, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/utils/redux/hooks'
import { ModalOverlay } from './ModalOverlay'
import { setShowCreateCommunity } from '@/utils/redux/createCommunitySlice';
import {useRouter} from "next/navigation";
//icons
import {MdClose} from "react-icons/md";
import {BiErrorCircle} from "react-icons/bi";
import {FaUserAlt} from "react-icons/fa";
import {FaEye, FaLock} from "react-icons/fa";
import { ROUTES } from '@/utils/constants/routes';
import { createCommunity } from '@/utils/firebase/functions';
import { verifyCommunityName } from '@/utils/helpers';
import { handleError} from '@/utils/helpers/errors';

export const CreateCommunity  = () => {
    const router = useRouter();
    const {showCreateCommunity} = useAppSelector(state=>state.createCommunity);

    const maxAllowed = 21;
    const [rSlashInput, setRSlashInput] = useState('');
    const handleInput = (e: ChangeEvent<HTMLInputElement>)=>{
        if (e.target.value.length > maxAllowed) return
        setRSlashInput(e.target.value)
      }

    const dispatch = useAppDispatch();
    const closeModal = ()=>{
        dispatch(setShowCreateCommunity(false))
    }
    
    const communityTypes = [
        'public',
        'private',  
        'restricted',
      ];
    const [communityType, setCommunityType] = useState(communityTypes[0]);
    const [isAdultContent, setIsAdultContent] = useState(false);
    const handleCheckBoxClick = (index=0) =>{
        return ()=>{
          setCommunityType(communityTypes[index%3])
        }
      }

    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    
    const handleSubmit = async(e: React.MouseEvent)=>{
        try {
          e.preventDefault();
          setIsSubmitDisabled(true);
          await createCommunity({
            name : rSlashInput,
            communityType,
            isAdultContent
          });
          router.push(ROUTES.R_SLASH(rSlashInput));
          closeModal();
        } catch (error) {
            handleError(error)
        } 
        setIsSubmitDisabled(false);
      }
    
    useEffect(()=>{
        setIsSubmitDisabled(!verifyCommunityName(rSlashInput) )
    }, [rSlashInput])

    return (
        showCreateCommunity && (
            <ModalOverlay >
                <div className={`bg-white border rounded-md max-w-lg w-[80%] z-[150]`}>
                    <div className='px-4'>
                        <div className='flex justify-between font-semibold border-b py-3'>
                        <span>Create Community</span>
                        <div className='cursor-pointer hover:bg-gray-500' onClick={closeModal}>
                            <MdClose className='h-5 w-5'/>
                        </div>
                        </div>
                        <div className='py-3'>
                            <h4 className='font-semibold'>Name</h4>
                            <h5 className='text-xs text-gray-500'>
                                Community names including capitalization cannot be changed. Must only include
                                alphanumeric letters and underscore
                                <BiErrorCircle className='ml-1 inline'/>
                            </h5>
                        </div>
                        <div className='relative mb-3 mt-2'>
              
                            <span className='text-gray-400 font-semibold absolute top-1.5 left-3'>r/</span>
                            <input
                                value={rSlashInput} 
                                onChange={handleInput}
                                className='w-full border rounded border-gray-200 text-sm p-2 pl-[26px]'/>
                        </div>
                        <div className='text-xs text-gray-500 mb-4'>
                            {maxAllowed-rSlashInput.length} characters remaining
                        </div>
                        <div className='font-semibold mb-2'>Community Type</div>
                        <ul className='mb-8'>
                            <li className='flex items-center py-1.5'>
                                <div 
                                onClick={handleCheckBoxClick(0)}
                                className={`${communityType===communityTypes[0]? 'border-[5px] border-blue-500': 'border-[2px] border-gray-500'}
                                    w-4 h-4 rounded-full  mr-2`}>
                                </div>
                                <FaUserAlt className='mr-2 text-gray-600'/> 
                                <div className='font-medium text-sm mr-1 text-gray-600'>Public</div>
                                <div className='text-xs text-gray-400'>Anyone can view, post and comment to this community</div>
                            </li>  
                            <li className='flex py-1.5'>
                                <div 
                                onClick={handleCheckBoxClick(1)}
                                className={`${communityType===communityTypes[1]? 'border-[5px] border-blue-500': 'border-[2px] border-gray-500'}
                                    w-4 h-4 rounded-full  mr-2`}>
                                </div>
                                <FaEye className='mr-2 text-gray-600'/> 
                                <div className='font-medium text-sm mr-1 text-gray-600'>Restricted</div>
                                <div className='text-xs text-gray-400'>Anyone can view this community, but only approved users can post</div>
                            </li>  
                            <li className='flex py-1.5'>
                                <div 
                                onClick={handleCheckBoxClick(2)}
                                className={`${communityType===communityTypes[2]? 'border-[5px] border-blue-500': 'border-[2px] border-gray-500'}
                                    w-4 h-4 rounded-full  mr-2`}>
                                </div>
                                <FaLock className='mr-2 text-gray-600'/> 
                                <div className='font-medium text-sm mr-1 text-gray-600'>Private</div>
                                <div className='text-xs text-gray-400'>Only approved users can view and submit to this community</div>
                            </li>  
                        </ul>
                        <div >
                            <div className='font-semibold mb-2'>Adult Content</div>
                            <div className='flex items-center mb-4'>
                                <input type='checkbox' className='w-4 h-4 mr-2' 
                                checked={isAdultContent}
                                onChange={e=>setIsAdultContent(e.target.checked) }/>
                                <span className='text-sm font-medium'>18+ year old community</span>
                            </div>
                        </div>
                        <div className='flex justify-end bg-gray-100 p-3'>
                            <button 
                            onClick={closeModal} 
                            className='border border-blue-500 rounded-full py-[2px] px-4 font-semibold text-blue-500
                                hover:bg-blue-100 transition-all duration-150 ease-in mr-2'
                            >Cancel</button>
                            <button 
                                disabled={isSubmitDisabled}
                                onClick={handleSubmit}
                                className='font-semibold text-white bg-blue-500 rounded-full py-[2px] px-4 
                                    hover:bg-blue-400 transition-all duration-150 ease-in disabled:bg-blue-200'
                                >Create Community
                            </button> 

                        </div>

                        
                    </div>
                </div>
            </ModalOverlay>
        ) 
    )
}