'use client'

import  { useEffect } from 'react'
import { useAppDispatch } from '@/utils/redux/hooks';
import {auth} from "@/utils/firebase/config";
import { onAuthStateChanged } from 'firebase/auth';
import { login, logout } from '../redux/userSlice';
import { setIsAppLoading } from '../redux/loadingSlice';
import { getUserData } from '../firebase/functions';
import { setShowLoginSignup } from '../redux/loginSignupSlice';


export const useAuthStateChange = ()=>{
    const dispatch = useAppDispatch();
    
    useEffect(()=>{
        const unsub = onAuthStateChanged(auth,(user)=>{     
            dispatch(setIsAppLoading(true));    
           (async ()=>{
                if (user) {
                    const {email} = user;
                    const data = await getUserData(email);
                    
                    dispatch(login({email, username: data?.username})); 
                    dispatch(setShowLoginSignup(false));
                    dispatch(setIsAppLoading(false)); 
                }else{               
                    dispatch(logout());
                    dispatch(setIsAppLoading(false))
                }
           })()
        });
        return unsub
    }, [dispatch]) 

}