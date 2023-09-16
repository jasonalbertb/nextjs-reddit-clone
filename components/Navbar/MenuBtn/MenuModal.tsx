import {  feeds, topics } from '@/utils/constants/menu';
import { getUserData } from '@/utils/firebase/functions';
import { User } from '@/utils/firebase/types';
import { handleError } from '@/utils/helpers/errors';
import { useOutsideClick } from '@/utils/hooks/useOutsideClick'
import { setShowCreateCommunity } from '@/utils/redux/createCommunitySlice';
import {  useAppDispatch, useAppSelector } from '@/utils/redux/hooks';
import { setShowLoginSignup } from '@/utils/redux/loginSignupSlice';
import Link from 'next/link';
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
//icons
import {BiPlus} from "react-icons/bi";
import { CommunityItem } from './CommunityItem';
type Props = {
    handleClose : ()=>void
}

export const MenuModal = ({handleClose}: Props) => {
    const {email} = useAppSelector(state=>state.user);
    const ref = useRef<HTMLDivElement | null>(null)
    const [communities, setCommunities] = useState<string[]>([]);
    const [filterInput, setFilterInput] = useState("");
    const filterInputHandler = (e : ChangeEvent<HTMLInputElement>) =>{
        setFilterInput(e.target.value);
    }
 
    const dispatch = useAppDispatch()
    const handleCreateCommunityBtn = useCallback(()=>{
      if (!email) {
          dispatch(setShowLoginSignup(true));
          return
      }
      dispatch(setShowCreateCommunity(true))
    }, [email])

    //custom hooks
    useOutsideClick({handleClose, ref})
    
    useEffect(()=>{
      (async()=>{
        try {
          if (!email) {
            return;
          }
          const data = await getUserData(email) as User;
          if (!data) {
            throw new Error('User does not exists');
          }
          setCommunities((data.communityJoined || []).slice(0, 5));
        } catch (error) {
          handleError(error)
        }
      })()
    }, [email]);


    return ( 
        <div 
            ref={ref}
            className={`bg-white absolute top-8 min-w-[256px] max-h-[450px]
            border-x border-b py-3 overflow-y-scroll outline-none z-[100]`}
        >
            <div>
                <form className='px-4 py-2' >
                    <input 
                    value={filterInput}  
                    placeholder='Filter' 
                    onChange={filterInputHandler}
                    className="filterInput px-2 py-1 text-sm bg-gray-100 border border-gray-200 w-full outline-none
                    placeholder:text-sm placeholder:text-gray-500
                    hover:bg-white hover:border-blue-500
                    focus:border-blue-500" 
                    />
                </form>
                <div className='uppercase text-[10px] font-medium text-gray-500  px-4 py-2'>Your Communities</div>
                <ul>
                    <li 
                        onClick={handleCreateCommunityBtn}
                        className='flex  px-4 py-2 hover:bg-gray-100 cursor-pointer items-center'>
                        <BiPlus className='w-6 h-6 mr-2'/>
                        <span className='text-sm'>Create a community</span>
                    </li>
                </ul>   
                {communities.map((item, i)=>{
                    return(
                      <CommunityItem key={i} communityID={item}/>
                    )
                })}        
            </div>
            <div className='uppercase text-[10px] font-medium text-gray-500  px-4 py-2'>Feeds</div>
            <ul>
            {feeds.map((item, i)=>{
              return (
              <li key={i}>
                <Link href={item.url} className="flex items-center px-4 py-2 text-sm capitalize
                    hover:bg-gray-100">
                  {item.logo("w-4 h-4 mr-2")}
                  <span>{item.title}</span>
                </Link>
              </li>
            )
            })}
          </ul>   
          <div className='uppercase text-[10px] font-medium text-gray-500  px-4 py-2'>Topics</div>
          <ul>
            {topics.map((item, i)=>{
              return (
                <li key={i}>
                  <Link href={item.url} className="flex items-center px-4 py-2 text-sm capitalize
                    hover:bg-gray-100">
                    {item.logo("w-4 h-4 mr-2")}
                    <span>{item.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul> 
        </div>
    )
}
