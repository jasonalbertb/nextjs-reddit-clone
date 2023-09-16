import { listenToCommunityData, updateCommunityDesc } from '@/utils/firebase/functions';
import { Community } from '@/utils/firebase/types';
import { handleError } from '@/utils/helpers/errors';
import { useOutsideClick } from '@/utils/hooks/useOutsideClick';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {FiEdit2} from "react-icons/fi";

type Props = {
  description?: string,
  communityID: string
}

export const AddEditDescription = ({communityID}: Props) => {
  const ref = useRef<HTMLDivElement| null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);

  const inputOnchange=  (e: React.ChangeEvent<HTMLTextAreaElement>)=>{
    const value = e.target.value;
    if (value.length >= 500) {
      return
    }
    setInput(value)
  }

  const handleModalOpen = useCallback(()=>{
    setIsModalOpen(true);
    setInput(description);
  }, [description])
  const handleModalClose = ()=> {
    setInput('')
    setIsModalOpen(false)
  }

  const handleSave = useCallback(()=>{
    
    (async()=>{
      try {
        setIsSaveDisabled(true);
        
          await updateCommunityDesc({description:input , communityID})
          handleModalClose();
      } catch (error) {
        handleError(error);
      }
      setIsSaveDisabled(false);
    })()
  }, [input])

  useOutsideClick({handleClose:handleModalClose, ref})

  useEffect(()=>{
    const unsub = listenToCommunityData(communityID, 
      (val)=>{
        if (val) {
          const desc = (val as Community).description || '';
          setDescription(desc);
        }
      }, (err)=>{
        handleError(err)
      });
      return unsub;
  }, [communityID])

  return (
    <div ref={ref} className='text-sm'>
        {isModalOpen? 
          <div className='border border-blue-500 rounded-md p-1'>
            <textarea 
              style={{resize: 'none'}}
              rows={3}
              className='placeholder:text-sm w-full  rounded-md overflow-hidden focus-within: outline-none'
              placeholder='Tell us about your community'
              value={input} onChange={inputOnchange}
            ></textarea>
            <div className='flex justify-between text-xs '>
              <h2 className='text-gray-500'>{500-input.length} Characters remaining</h2>
              <div>
                <button 
                  onClick={handleModalClose}
                  className='font-bold text-red-500 cursor-pointer px-1'>
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaveDisabled}
                  className='font-bold text-blue-500 cursor-pointer px-1 disabled:opacity-50'>
                  Save
                </button>
              </div>
            </div> 
          </div>: 
          (
            description? 
            <div className='flex'>
              <span className='mr-2'>{description}</span>
              
              <div className=' flex h-full'>
                <button 
                onClick={handleModalOpen}
                className='text-blue-500 inline-flex items-center'>
                  <FiEdit2 className='w-5 h-5'/> </button>
              </div>
            </div>:
            <div 
                onClick={handleModalOpen}
                className='text-xs font-bold text-blue-500 border border-gray-200 hover:border-blue-500
                rounded-md p-2 bg-gray-100 ease-in-out duration-200 cursor-pointer transition'>
                Add Description
            </div>
          )
        }
    </div>
   
  )
}