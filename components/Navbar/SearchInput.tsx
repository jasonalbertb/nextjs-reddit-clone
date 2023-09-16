'use client'

import React, { FormEvent, useState} from 'react'
import {BsSearch} from "react-icons/bs";
import {IoIosCloseCircleOutline} from "react-icons/io";

export const SearchInput = () => {
    const [searchText, setSearchText] = useState("");
    const handleClearInputBtn = ()=>{
        setSearchText("");
    }
    const handleSubmit = (e : FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        console.log("submit ");
    }
    return (
        <div className='flex flex-1 relative max-w-md'>
            <BsSearch className='w-5 h-5 text-gray-400 absolute top-1/2 translate-y-[-50%] left-[30px] z-[10]'/>
            <form onSubmit={handleSubmit} className='relative flex w-full '>       
                <input placeholder='Search Reddit' value={searchText} 
                    onChange={e=>setSearchText(e.target.value)}
                    className='border w-full outline-none mx-4 p-2 rounded-full px-10 text-sm
                        hover:border-blue-500 hover:bg-white
                        placeholder:text-sm
                        bg-gray-50 '
                />
            </form>
            <button 
                onClick={handleClearInputBtn}
                className='absolute top-1/2 translate-y-[-50%] right-[30px]' 
            >
                    <IoIosCloseCircleOutline className='w-5 h-5 text-gray-600'/>
            </button>
        </div>
    )
}
