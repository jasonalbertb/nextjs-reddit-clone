import React, { useContext, useEffect, useRef, useState } from 'react'
import { RiArrowDownSLine } from 'react-icons/ri'
import { SearchCommunityModal } from '../modals/SearchCommunityModal';
import { ContextType, CreatePostContext } from '@/utils/context/CreatePostContext';
import { useOutsideClick } from '@/utils/hooks/useOutsideClick';

type Props = {}

export const SearchCommunities = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false); 
  const {communityInput, setCommunityInput} = useContext(CreatePostContext) as ContextType;
  const [placeholder, setPlaceholder] = useState('Choose a community'); 
  const openModal = ()=>{
    setShowModal(true);
  } 
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setCommunityInput(e.target.value);
  }
  const closeModal = ()=>{
    setShowModal(false);
  }
  const handleToggleBtn = ()=>{
    setShowModal(prev=>!prev);
  }
  const handeInputEnter = (e: React.KeyboardEvent<HTMLInputElement>)=>{
    if (e.key === 'Enter'){
      e.preventDefault();
      // console.log('search');
      
    }
  }
  //custom hook
  useOutsideClick({handleClose:closeModal, ref})
  useEffect(()=>{
    setPlaceholder(showModal? 'Search communities': 'Choose a community')
  }, [showModal])
  
  return (
    <div className='relative w-80 z-[100]' ref={ref}>
       <div className='flex bg-white  relative'>
          <div className='absolute left-2 top-1/2 translate-y-[-50%] w-5 h-5 
              border border-gray-500 border-dashed rounded-full '>
          </div>
          <input 
            onFocus={openModal}
            value={communityInput}
            onChange={handleInput}
            className=' pl-10 py-2 w-full placeholder:text-sm placeholder:font-semibold placeholder:text-black 
              text-sm focus:outline-none' 
            onKeyDown={handeInputEnter} 
            placeholder={placeholder}
          />
          <button 
            onClick={handleToggleBtn} 
            type='button' className='px-2 outline-none'>
            <RiArrowDownSLine className='-5 h-5'/>
          </button>
       </div>
       {showModal &&  < SearchCommunityModal 
          handleClose={closeModal} 
        />} 
    </div>
  )
}