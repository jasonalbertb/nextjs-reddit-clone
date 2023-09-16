import { PICS } from '@/utils/constants/pics';
import { useAppSelector } from '@/utils/redux/hooks';
import React, { useContext, useEffect, useState } from 'react'
import Image from "next/image";
import { handleError } from '@/utils/helpers/errors';
import { getCommunities } from '@/utils/firebase/functions';
import { Community } from '@/utils/firebase/types';
import { auth } from '@/utils/firebase/config';
import { ROUTES } from '@/utils/constants/routes';
import { ContextType, CreatePostContext } from '@/utils/context/CreatePostContext';
import { useEscapeKey } from '@/utils/hooks/useEscapeKey';

type Props = {
  handleClose: ()=>void
}

export const SearchCommunityModal = ({handleClose}: Props) => {
  const userCred = useAppSelector(state=>state.user);
  const [communitites, setCommunities] = useState<Object[]>([]);
  const {setCommunityInput} = useContext(CreatePostContext) as ContextType;
  
  const handleBtn = (value: string | undefined)=>{
    return ()=>{
      // console.log('value', value);
      if (!value) {return}
      setCommunityInput(value);
    }
  }

  //hooks
  useEscapeKey(handleClose);
  useEffect(()=>{
    (async()=>{
        try {
            const data = await getCommunities();
            setCommunities(data);
        } catch (error) {
            handleError(error);
        }
    })();
  }, []);

  return (
    <div className='z-10 absolute bg-white top-9 left-0 w-full overflow-y-scroll max-h-[400px]'>
      <div className='p-2 border-y'>
        <div className='uppercase text-[10px] font-bold text-gray-400 tracking-wide p-2 pb-4'
        >your profile</div>
        <button
            onClick={handleBtn(userCred.username)}
            className='flex items-center'>
              <Image
                  width={32} height={32} 
                  src={auth.currentUser?.photoURL || PICS.defaultPic} alt='user_pfp' className=' rounded-full' 
                />
            <span className='text-sm font-semibold text-gray-700 px-2'>{userCred.username}</span>
        </button>
      </div>
      <div>
      <div className='flex justify-between items-center p-2 py-1'>
        <div className='uppercase text-[10px] font-bold text-gray-400 tracking-wide p-2 pb-4'
                >your communitites</div>
          <button type='button' className='text-blue-500 font-bold text-xs p-1 px-2 hover:bg-gray-200 rounded-full'>
              Create new
          </button>
        </div>
        <ul className='pb-2'>
            {communitites.map((item)=>{
                const comItem = item as Community;
                return (
                    <li key={comItem.id}>
                        <button
                            onClick={handleBtn(comItem.id)}
                            className='flex items-center hover:bg-gray-50'>
                            <img 
                                className='w-8 h-8 rounded-full object-center m-2'
                                src={comItem.dp ||PICS.defaultPic} alt='community_dp'/>
                            <div className='flex flex-col'>
                                <span className='text-sm font-semibold'>{ROUTES.R_SLASH(comItem.id || "").slice(1)}</span>
                                <span className='text-xs text-gray-500'>{comItem?.members?.length || 0} members</span>
                            </div>
                        </button>
                    </li>
                )
            })}
        </ul>
      </div>
    </div>
  )
}