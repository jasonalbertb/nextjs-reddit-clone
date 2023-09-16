
import { ContextType, CreatePostContext } from '@/utils/context/CreatePostContext';
import React, { useContext, useEffect, useState } from 'react'
import { BsCheckLg, BsPlusLg } from 'react-icons/bs';

type Props = {
    name: string,
    defaultDisabled: boolean
}

export const ToggleBtn = ({name, defaultDisabled}: Props) => {
    const [isSelected, setIsSelected] = useState(false);
    const { setSelectedTags} = useContext(CreatePostContext) as ContextType;
    const handleOnclick = ()=>{
        setIsSelected(prev=>!prev);
    }

    
    useEffect(()=>{       
        if (isSelected) {
            setSelectedTags(prev=>{
                return [...prev, name].filter((value, index, array) => array.indexOf(value) === index);
            })
        }else{
            setSelectedTags(prev=>{
                return [...prev.filter(item=>item !== name)]
            })
        }
    }, [isSelected, setSelectedTags, name])

    return (
        <li className='mr-2'>
            <button 
                    onClick={handleOnclick}
                    disabled={defaultDisabled}
                    className={`inline-flex items-center rounded-full px-4 py-1 border   disabled:opacity-50 disabled:cursor-not-allowed
                    ${isSelected? 'bg-red-400 border-red-400 text-white' : 'border-gray-500 text-gray-500 hover:bg-gray-100'}`}>
                    {isSelected? <BsCheckLg className='text-white mr-2'/> : <BsPlusLg className='mr-2'/>}
                    <span className='text-sm font-bold'>{name}</span>
                </button>
        </li>
    )
}