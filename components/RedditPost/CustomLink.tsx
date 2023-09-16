'use client'

import React from 'react'
import { useRouter } from 'next/navigation';

type Props = {
    to: string, className: string, 
    children: React.ReactNode
}

export const CustomLink = ({to, className, children} : Props) => {
    const navigate = useRouter();
    const handleBtn = (e: React.MouseEvent<HTMLButtonElement>)=>{
      e.stopPropagation();
      navigate.push(to);
    }
    return (
        <button onClick={handleBtn} type='button' className={className}>
            {children}
        </button>
    )
}
