'use client';

import {useState, useEffect} from 'react'

export const useOnlineStatus = () => {
    const [onlineStatus, setOnlineStatus] = useState(false);
    //loading
    const handleToggle = ()=>{
        //async
        setOnlineStatus(prev=>!prev);
    }
    useEffect(()=>{
        //get from firebase
    }, [])
    return {status : onlineStatus, toggleStatus: handleToggle}
}