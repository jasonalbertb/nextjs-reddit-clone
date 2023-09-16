'use client';

import React from 'react';
import { CreateCommunity } from '../modals/CreateCommunity'
import { LoginSignUp } from '../modals/LoginSignUp';
import {useAppSelector} from "@/utils/redux/hooks";
import { ReactLoader } from '../loaders/ReactLoader';
import { useAuthStateChange } from '@/utils/hooks/useAuthStateChange';
import { ToastContainer } from 'react-toastify';

type Props = {
    children : React.ReactNode
}

export const PageWrapper = ({children}: Props) => {  
    const {isAppLoading} = useAppSelector(state => state.loading);
     
    useAuthStateChange();
    return (
        <>  
            <ToastContainer />
            <LoginSignUp />
            <CreateCommunity />
            {isAppLoading ? (<ReactLoader />): (
            <div className='bg-gray-200 min-h-screen w-screen relative dark:bg-gray-700'>
                {children}
             </div>
            )}
        </>     
    )
}