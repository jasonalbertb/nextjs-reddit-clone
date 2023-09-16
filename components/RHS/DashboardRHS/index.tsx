import React, { useCallback, useEffect, useState } from 'react'
//redux
import {useSelector, useDispatch} from "react-redux";
//icons 
import {FaChevronDown} from "react-icons/fa";
import { useAppDispatch, useAppSelector } from '@/utils/redux/hooks';
import { setShowCreateCommunity } from '@/utils/redux/createCommunitySlice';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants/routes';
import { Community } from '@/utils/firebase/types';
import { SuggestedCommunity } from './SuggestedCommunity';
import { getSuggestedCommunities } from '@/utils/firebase/functions';
import { handleError } from '@/utils/helpers/errors';



const rhs = [
    'POPULAR COMMUNITIES',
    'GAMING',
    'SPORTS',
    'TV',
    'TRAVEL',
    'HEALTH & FITNESS',
    'FASHION'
]

export const DashBoardRHS = () => {
    const [suggestedCommunities, setSuggestedCommunities] = useState<Community[]>([]);
    const {email} = useAppSelector(state=>state.user);
    const dispatch = useAppDispatch();
    const handleCreateCommunityBtn = ()=>{
        dispatch(setShowCreateCommunity(true));
    }

    const handleRemoveSuggestion = (id: string)=>{
        setSuggestedCommunities(prev=>{
            return prev.filter(item=> item.id != id)
        })
    }

    useEffect(()=>{
        (async()=>{
            try {
                const data = await getSuggestedCommunities()
                setSuggestedCommunities(data);
            } catch (error) {
                console.log((error));
                
                handleError(error)
            }
        })()
    }, [email])

    if (email) {
        return(
           <>
                <div className='bg-white rounded-md shadow '>
                    <div className='bg-orange-500 h-8 w-full'></div>
                    <div className='p-4 pt-0'>
                        <div className='flex'>
                            <img src='./images/reddit-snoo.jpg' alt='reddit-logo' className='w-12 '/>
                            <div className='mt-8 ml-2 font-semibold'>Home</div>
                        </div>
                        <div className='text-[15px] py-2 mb-4'>
                            Your personal Reddit frontpage. Come here to check in with your 
                            favorite communities 
                        </div>
                        <Link
                            href={ROUTES.CREATE_POST("")}
                            className='block text-center text-white w-full rounded-full font-bold bg-blue-500 py-1 hover:bg-blue-400 mb-3'
                        >
                            Create Post
                        </Link>
                        <button
                            onClick={handleCreateCommunityBtn}
                            className='font-bold text-blue-500 w-full rounded-full border border-blue-500 py-1 hover:bg-blue-50'>
                            Create Community
                        </button>
                    </div>
                </div>
                <div className='mt-4 bg-white rounded-md shadow'>
                    
                    {suggestedCommunities.length > 0 && (
                        <>
                            <div className='uppercase text-[10px] font-medium text-gray-500  p-4 pb-2'>
                                Suggested Communities
                            </div>
                            <ul className='p-4 pt-2'>
                                {suggestedCommunities.map((item, index)=>{
                                    return <SuggestedCommunity 
                                        key={index}
                                        {...item} handleRemoveSuggestion={handleRemoveSuggestion}
                                    />
                                })}
                            </ul>
                        </>
                    )}
                    
                </div>
                
           </>
        ) 

    }
    return (
        <div>
            
            <ul className='bg-white rounded border shadow'>
                {rhs.map((item, index)=>{
                    return(
                        <li key={index} className='text-[10px] font-bold tracking-wide flex items-center justify-between border-b p-3'>
                            <span>{item}</span>
                            <button>
                                <FaChevronDown className='w-4 h-4 text-gray-400'/>
                            </button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
    
}
