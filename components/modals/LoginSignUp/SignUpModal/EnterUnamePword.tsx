'use client'

import { FloatingInputs } from '@/components/inputs/FloatingInputs'
import { checkIfUsernameExists, createUser, generateUsername } from '@/utils/firebase/functions'
import React, { useCallback, useEffect, useState } from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { FiRepeat } from 'react-icons/fi'
import debounce from "lodash.debounce"
import {handleError } from '@/utils/helpers/errors'

type Props = {
  email : string, 
  handlePrev : ()=>void,
  goToLoginTab: ()=>void
}

export const EnterUnamePword = ({email, handlePrev}: Props) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userNameError, setUserNameError] = useState('');
  // console.log('isTyping', isTyping);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    (async()=>{
      try {
        setIsSubmitDisabled(true);
        await createUser({email, password, username: userName})
      } catch (error) {
        handleError(error)
      }
    })()
    
  }

  const functionDebounce = useCallback(
    debounce(() => {
      setIsTyping(false);
    }, 300), [])

  const handleUserOnchange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setUserName(e.target.value);
    setIsTyping(true);
    functionDebounce();
  }

  const handlePasswordOnchange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setPassword(e.target.value);
    setIsSubmitDisabled(false);
  }

  useEffect(()=>{
    setUserName(generateUsername());
  }, [])
  
  useEffect(()=>{
    (
      async ()=>{
        setIsSubmitDisabled(true);
        if (!isTyping) {
          if (userName.length < 3) {
            setUserNameError('Username must be between 3 and 20 characters')
            return
          }
          const flag = await checkIfUsernameExists(userName);
          if (flag) {
            setUserNameError('That username is already taken');
            return
          }
          setUserNameError('');
        }
        
      }
    )()
  }, [isTyping, userName])

  return (
    <div >
       <button
        className='absolute top-8'
         onClick={handlePrev}
      >
        <BiArrowBack className='w-5 h-5 text-gray-600'/>
      </button>
      <h3 className='text-xl font-semibold mb-2'>
        Create your username and password
      </h3>
      <h4 className='text-xs'>
        Reddit is anonymous, so your username 
        is what you'll go by here. Choose wisely—because once you get a name, 
        you can't change it.
      </h4>
      <form onSubmit={handleSubmit}>
      <div className='relative'>
          <button 
            type='button'
            onClick={()=> setUserName(generateUsername())}
            className='absolute z-10 text-blue-500 top-1/2 translate-y-[-50%] right-4 w-5 h-5'
          >
            <FiRepeat />
          </button>
          <FloatingInputs 
            label='username' margin='mt-4'
            value={userName}
            onChange={handleUserOnchange}
            paddingRight='pr-10'
          />
        </div>
        {userNameError ? (
            <div className='text-xs text-red-500 ml-4 my-1'>{userNameError}</div>
         ): (
          <div className='text-xs text-blue-500 ml-4 my-1'>Nice! Username available</div>
         )
        }
        <FloatingInputs 
          label='password' margin='mt-2' type='password'
          value={password} 
          onChange={handlePasswordOnchange}
        />
        <div className='text-xs text-red-500 mr-4 mb-6 mx-4'>
          
        </div>
        <button 
          disabled={isSubmitDisabled}
          type='submit'
          className={`w-full bg-orange-600 text-white text-sm font-semibold rounded-full py-2.5 disabled:opacity-50`}
        >
          Continue
        </button>
      </form>
    </div>
  ) 
}