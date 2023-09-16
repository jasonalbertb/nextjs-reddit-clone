import React, { useState } from 'react'
import { IoMdClose } from 'react-icons/io';
import { EnterEmail } from './EnterEmail';
import { EnterUnamePword } from './EnterUnamePword';
type Props = {
  closeModal : ()=>void;
  goToLoginTab : ()=>void
}

export const SignUpModal = ({closeModal, goToLoginTab}: Props) => {
  const [page, setPage] = useState(0);
  const [email, setEmail] = useState('');

  return (
     <div className='w-[400px] min-h-[90vh] grid place-items-center rounded-lg bg-white drop-shadow-2xl relative'>
        <button 
          onClick={closeModal}
          className='absolute top-4 right-4'
        >
          <IoMdClose className='w-6 h-6'/>
        </button>
        <div className='p-16'>
          {page === 0 && <EnterEmail 
            email={email} setEmail ={setEmail}
            handleContinue={()=>setPage(1)} 
            goToLoginTab={goToLoginTab}/>
          }
          {page === 1 && <EnterUnamePword 
            email={email}
            handlePrev={()=>setPage(0)} 
            goToLoginTab={goToLoginTab}
          />}
          </div> 
      </div>
  ) 
}