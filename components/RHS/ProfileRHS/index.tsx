import { listenToProfileDataByUsername, updateFollowUser } from '@/utils/firebase/functions';
import { User } from '@/utils/firebase/types';
import { useAppDispatch, useAppSelector } from '@/utils/redux/hooks';
import React, { useEffect, useState } from 'react'
import { BsCamera, BsFlower3, BsPlusLg } from 'react-icons/bs';
import { CommunityRHSLoader } from '../CommunityRHS/CommunityRHSLoader';
import { ProfileCameraBtn } from './ProfileCameraBtn';
import { BiCog } from 'react-icons/bi';
import { FaBirthdayCake } from 'react-icons/fa';
import { formatDate } from '@/utils/helpers';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants/routes';
import { setShowLoginSignup } from '@/utils/redux/loginSignupSlice';
import { ModeratorRHS } from './ModeratorRHS';

type Props = {
    username : string
}

export const ProfileRHS = ({username: profileUsername}: Props) => {
  const dispatch = useAppDispatch();
  const {username, email} = useAppSelector(state=>state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<User| null>(null);
  const [followBtnDisabled, setFollowBtnDisabled] = useState(false);

  const handleCameraBtn = (e: React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault();

  }
  
  const handleFollowBtn = async (e: React.MouseEvent<HTMLButtonElement>)=>{
    if (profileData?.id) {
      try {
        e.preventDefault();
        if (!email) {
            dispatch(setShowLoginSignup(true));
            return
        }
        setFollowBtnDisabled(true);
        await updateFollowUser(profileData.id)
      } catch (error) {
          console.log(error);
      }
      setFollowBtnDisabled(false);
    } 
  }


  //hooks
  useEffect(()=>{
    const unsub = listenToProfileDataByUsername({
      profileUsername, 
      setValue: (val: User | null)=>{
          setProfileData(val);
          setIsLoading(false);
      }
    })
    return unsub;
  }, [profileUsername]); 

  if (isLoading || !profileData) {
    return <CommunityRHSLoader />
  } 


  return (
    <>
         <div className='rounded-md overflow-hidden'>

            <div className='w-full h-[80px] relative bg-blue-300'>
                <button className='bg-white rounded-full border border-blue-500 p-1 absolute bottom-2 right-2' 
                    onClick={handleCameraBtn}>
                    <BsCamera className='text-blue-500 w-6 h-6'/>
                </button>
            </div>

            <div className='relative bg-white py-4 px-4 flex flex-col'>
              <div className='absolute top-0 translate-y-[-80%]'>
                <div className='rounded p-1 bg-white w-20 h-20  border relative'>
                      <div className='w-full h-full border rounded overflow-hidden'>
                        <img src={profileData.display_pic || '/images/reddit_default.png'} alt='dp' className=' rounded object-center'/>
                      </div>
                      {username === profileUsername &&  (
                          <div 
                              className='absolute bottom-[-6px] right-[-8px] z-10'>
                              <ProfileCameraBtn />
                          </div>
                      )}    
                </div>
              </div>

              <span className='text-xs font-semibold py-2'>{profileData.username}</span>
              {username === profileData.username && (
                <button  onClick={(e)=>e.preventDefault()} className='absolute top-2 right-2'>
                    <BiCog className='w-6 h-6 text-blue-500'/>
                </button>
              )}        

              {username === profileData.username &&  (
                <button 
                  className='block  rounded-full bg-gradient-to-r from-red-500 to-orange-400 font-bold
                  text-white py-1' >
                  Create Avatar
                </button>
              )}
              
              <div className='flex justify-between py-2'>
                  <div className='flex flex-col text-sm'>
                      <span className='font-semibold'>Karma</span>
                      <span className='inline-flex items-center'>
                          <BsFlower3 className='w-3 h-3 text-blue-500 mr-1'/>
                          <span className='text-gray-500 text-xs'>1</span>
                      </span>
                  </div>
                  <div className='flex flex-col text-sm'>
                      <span className='font-semibold'>Cake Day</span>
                      <span className='font-semibold inline-flex items-center text-xs'>
                          <FaBirthdayCake className='text-blue-500 mr-2'/>
                          {profileData.createdAt && (
                            <span className='text-gray-500'>{formatDate(profileData.createdAt.toDate())}</span>
                          )}
                      </span>  
                  </div>
              </div>
              {username === profileData.username && (
                <div>
                  <button className='inline-flex bg-gray-200 rounded-full items-center p-2'>
                      <BsPlusLg className='mr-2'/> 
                      <span className='text-xs font-bold'>Add Social Link</span>
                  </button>
                </div>
              )}               

              {username === profileData.username?( <Link 
                          href={ROUTES.CREATE_POST(profileData.username)}
                          className='bg-blue-500 rounded-full text-white font-bold my-4 py-1 flex justify-center'>
                          New Post
                </Link>): (
                  email && profileData?.followers?.includes(email)? 
                  <button
                      disabled={followBtnDisabled}
                      onClick={handleFollowBtn}
                      className='bg-white rounded-full border border-blue-500 text-blue-500 font-bold my-4 py-1 flex justify-center disabled:bg-blue-200'>
                      Following
                  </button>:  
                  <button
                      disabled={followBtnDisabled}
                      onClick={handleFollowBtn}
                      className='bg-blue-500 rounded-full text-white font-bold my-4 py-1 flex justify-center disabled:bg-blue-200'>
                      Follow
                  </button> 
              )}

            </div>

        </div>
        {username === profileData.username && <ModeratorRHS />}
    </>
  )
} 

