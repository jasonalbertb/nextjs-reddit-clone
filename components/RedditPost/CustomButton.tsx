'use client'

import React from 'react'

type Props = {
    className : string,
    children : React.ReactNode,
    onClick ?: (e: React.MouseEvent<HTMLButtonElement>)=>void,
    disabled ?: boolean
}

export const CustomBtn = ({className, children, onClick, disabled=false}: Props) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>)=>{
        e.stopPropagation();
        onClick && onClick(e);
    }
    return (
        <button 
            disabled={disabled}
            onClick={handleClick} className={className}>
            {children}
        </button>
    )
}