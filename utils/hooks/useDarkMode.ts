'use client'

import {useState, useEffect} from 'react'

export const useDarkMode = () => {
    const [darkModeStatus, setDarkModeStatus] = useState(localStorage.theme==='dark'? true: false);
    const handleToggle = ()=>{
        setDarkModeStatus(prev=>!prev);
    }
    useEffect(()=>{
        const root = window.document.documentElement;
        if (darkModeStatus) {
            root.classList.add('dark');
        }else{
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', darkModeStatus? 'dark': 'light');
    }, [darkModeStatus]);

    return {status: darkModeStatus, toggleStatus: handleToggle}
}
