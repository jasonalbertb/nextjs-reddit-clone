import { FloatingInputs } from '@/components/inputs/FloatingInputs'
import { ROUTES } from '@/utils/constants/routes'
import { userLoginViaGoogle } from '@/utils/firebase/functions'
import { errorToMsg, verifyEmail } from '@/utils/helpers'
import { handleError } from '@/utils/helpers/errors'
import { FirebaseError } from 'firebase/app'
import Link from 'next/link'
import React, { FormEvent, useEffect, useState } from 'react'
import { FaApple, FaCheck } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

type Props = {
    handleContinue: ()=>void,
     goToLoginTab: ()=>void,
    email : string, 
    setEmail: React.Dispatch<React.SetStateAction<string>>
}

export const EnterEmail = ({handleContinue, goToLoginTab, email, setEmail}: Props) => {
    const [isGoogleBtnDisabled, setIsGoogleBtnDisabled] = useState(false);
    const [first, setFirst] = useState(true);
    const [isContBtnDisabled, setIsContBtnDisabled] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const handleGoogleLogin = async()=>{
        setIsGoogleBtnDisabled(true)
        try {
          await userLoginViaGoogle();
        } catch (error) {
            handleError(error)
        } 
        setIsGoogleBtnDisabled(false)  
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
    }

    useEffect(()=>{
        const flag = verifyEmail(email);
        if (first) {
            return
        }

        if (flag) {
            setIsContBtnDisabled(false);
            setErrorMsg('');
        }else{
            setIsContBtnDisabled(true);
            setErrorMsg('Not valid email address')
        }
    }, [email, first])

    return (
        <>
            <h2 className='text-xl font-semibold my-2'>
                Sign Up
            </h2>
            <h3 className='text-xs leading-4'>
                By continuing, you agree are setting up a Reddit account and 
                agree to our 
                <Link href={ROUTES.USER_AGREEMENT}  className='mx-1 text-blue-500'>
                    User Agreement
                </Link> and
                <Link href={ROUTES.PRIVICY_POLICY} className='mx-1 text-blue-500'>
                    Privacy Policy.
                </Link> 
            </h3>
            <ul className='mt-8 mb-4'>
                <li className='mb-2.5'>
                    <button     
                        disabled={isGoogleBtnDisabled}
                        onClick={handleGoogleLogin}
                        className='inline-flex items-center rounded-full border border-gray-300 p-2 w-full
                        hover:bg-blue-50 transition-all duration-100 ease-in'>
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
                <div className='relative'>
                    {!isContBtnDisabled && <FaCheck className='w-4 h-4 text-green-400 absolute top-1/2 translate-y-[-50%] right-4 z-10'/>} 
                    <FloatingInputs 
                        margin='mt-4'
                        label={'Email'} 
                        value={email} 
                        onChange={({target})=>{
                            if (first) {
                                setFirst(false);
                            }
                            setEmail(target.value)}
                        }
                        paddingRight="pr-10"
                    />
                </div>
                <div className='ml-2 mt-1 mb-2 text-red-500 text-xs'>
                    { errorMsg? errorMsg: ''}
                </div>
                <button 
                    onClick={handleContinue}
                    disabled={isContBtnDisabled}
                    className=' w-full bg-orange-600 text-white text-sm font-semibold rounded-full py-2.5
                        disabled:opacity-50'
                >
                    Continue
                </button>
            </form>
            <div className='text-xs'>
                Already a redditor? 
                <button 
                    onClick={goToLoginTab}
                    className='text-blue-500 ml-1 underline font-semibold tracking-wide'>Log In
                </button>
            </div>
        </>
    )
}