import { ROUTES } from '@/utils/constants/routes';
import Link from 'next/link';
import React, {  MouseEvent, useEffect, useState } from 'react'
import { FaApple } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import {FcGoogle} from "react-icons/fc";
import { FirebaseError } from 'firebase/app';
import { errorToMsg, verifyEmail } from '@/utils/helpers';
import { FloatingInputs } from '@/components/inputs/FloatingInputs';
//firebase
import {userLogin, userLoginViaGoogle} from "@/utils/firebase/functions";
//utils
import {handleError} from "@/utils/helpers/errors";
type Props = {
  closeModal : ()=>void;
  goToSignupTab : ()=>void
}

export const LoginModal = ({closeModal, goToSignupTab}: Props) => {
  
  const [isGoogleBtnDisabled, setIsGoogleBtnDisabled] = useState(false);
  const [isLoginDisabled, setIsLoginDisabled] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleGoogleLogin = (e: MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault();
    (async()=>{
      setIsGoogleBtnDisabled(true)
      try {
        await userLoginViaGoogle();
      } catch (error) {
        handleError(error)
      }
      setIsGoogleBtnDisabled(false)  
    })()

  }

  const handleSubmit = (e : React.FormEvent<HTMLFormElement> )=>{
    e.preventDefault();
    (async()=>{
      setIsLoginDisabled(true);
      try {
        await userLogin({email, password});
        setIsLoginDisabled(false);
      } catch (error) { 
        handleError(error)
      }
    })()
  }

  //hooks
  useEffect(()=>{
    const validEmail = verifyEmail(email);
    const validPassword = password !== "";
    const flag = validEmail && validPassword;
    setIsLoginDisabled(!flag);
  }, [email, password])

  return (
    <div className='w-[400px] rounded-lg bg-white drop-shadow-2xl relative'>
      <button 
        onClick={closeModal}
        className='absolute top-4 right-4'
      >
        <IoMdClose className='w-6 h-6'/>
      </button>
      <div className='p-16'>
        <h2 className='text-xl font-semibold my-2'>
          Log In 
        </h2>
        <h3 className='text-xs leading-4'>
          By continuing, you agree are setting up a Reddit account and 
          agree to our 
          <Link href={ROUTES.USER_AGREEMENT} target='_blank' className='mx-1 text-blue-500'>
            User Agreement
          </Link> and
          <Link href={ROUTES.PRIVICY_POLICY} target='_blank' className='mx-1 text-blue-500'>
            Privacy Policy.
          </Link> 
        </h3> 
        <ul className='mt-8 mb-4'>
          <li className='mb-2.5'>
            <button 
              disabled={isGoogleBtnDisabled}
              onClick={handleGoogleLogin}
              className='inline-flex items-center rounded-full border border-gray-300 p-2 w-full
                hover:bg-blue-50 transition-all duration-100 ease-in disabled:opacity-50'
              >
              <FcGoogle className='w-5 h-5'/>
              <span className='text-sm font-medium flex-1'>
                Continue with Google
              </span>
            </button>
          </li>
          <li>
            <button className='inline-flex items-center rounded-full border border-gray-300 p-2 w-full
                hover:bg-blue-50 transition-all duration-100 ease-in'>
              <FaApple className='w-5 h-5'/>
              <span className='text-sm font-medium flex-1'>
                Continue with Apple
              </span>
            </button>
          </li>
        </ul>

        <div className='flex items-center'>
          <div className='flex-1 border-b border-gray-300 mr-3'></div>
          <div className='font-semibold text-gray-500'>OR</div>
          <div className='flex-1 border-b border-gray-300 ml-3'></div>
        </div>
        <form 
          onSubmit={handleSubmit}
          className='mb-4'
        >
          <FloatingInputs 
            margin='mt-4 mb-2'
            label={'email'} 
            value={email} 
            onChange={({target})=>setEmail(target.value)}
          />
          <FloatingInputs 
            margin='mb-2'
            label='password' 
            type='password'
            value={password} 
            onChange={({target})=>setPassword(target.value)}
          />
          <div className='text-red-500 text-xs ml-2 mb-5'>
              
          </div>
          <button 
            disabled={isLoginDisabled}
            className='w-full bg-orange-600 text-white text-sm font-semibold rounded-full py-2.5 
              disabled:opacity-50'>
            Log In
          </button>
        </form>
        <div className='text-xs'>
          New to Reddit? 
          <button 
            onClick={goToSignupTab}
            className='text-blue-500 ml-1 underline font-semibold tracking-wide'>Sign up</button>
        </div>
      </div>
    </div>
  )
}