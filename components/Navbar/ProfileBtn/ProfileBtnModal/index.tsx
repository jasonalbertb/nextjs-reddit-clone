import { useAppDispatch, useAppSelector } from '@/utils/redux/hooks';
import React from 'react'
import { MenuContainer } from './MenuContainer';
import { MenuLabelFormat } from './MenuLabelFormat';


//types
import { useEscapeKey } from '@/utils/hooks/useEscapeKey';
import { MenuItem, menuTypes } from './MenuItem';
import { useOnlineStatus } from '@/utils/hooks/useOnlineStatus';
import { ROUTES } from '@/utils/constants/routes';
import { useDarkMode } from '@/utils/hooks/useDarkMode';
import { setShowCreateCommunity } from '@/utils/redux/createCommunitySlice';
import { userLogout } from '@/utils/firebase/functions';
import { setShowLoginSignup } from '@/utils/redux/loginSignupSlice';

//icons
import { FaRegUserCircle } from 'react-icons/fa';
import { BiCoinStack, BiLogOut } from 'react-icons/bi';
import { BsEye, BsMegaphone } from 'react-icons/bs';
import { AiOutlineReddit } from 'react-icons/ai';
import {RiLoginBoxLine} from "react-icons/ri";
import { handleError } from '@/utils/helpers/errors';
type Props = {
  handleClose : ()=>void
}

export const ProfileBtnModal = ({handleClose}: Props) => {
  const {email, username} = useAppSelector(state=>state.user);

  const dispatch = useAppDispatch();

  const handleCreateCommunityBtn = ()=>{
    dispatch(setShowCreateCommunity(true))
  } 

  const handleLogout = async()=>{
    try {
      await userLogout();
    } catch (error) {
      handleError(error)
    }
  }
  const handleLoginSignupBtn = ()=>{
    dispatch(setShowLoginSignup(true));
  }
  //custom hook
  useEscapeKey(handleClose);
  return (
    <div className='absolute top-[48px] right-0 bg-white 
        w-64 max-h-[80vh] rounded-md border border-gray-200 
        z-[150] overflow-y-auto'
    > 
         {email && (
          <MenuContainer >
            <MenuLabelFormat 
             icon={<FaRegUserCircle className='mr-2 w-5 h-5'/>}
             label={'My Stuff'}
            /> 
            <MenuItem
              icon={null}
              type={menuTypes.MENUITEM_TOGGLE} 
              label={'Online Status'} 
              useToggle={useOnlineStatus} 
            />
            <MenuItem  
             type={menuTypes.MENUITEM_LINK} 
             label={'Profile'} 
             linkTo={ROUTES.PROFILE(username || '')}
           />
            <MenuItem 
             type={menuTypes.MENUITEM_LINK} 
             label={'User Settings'} 
             linkTo={ROUTES.SETTINGS}
           />
          </MenuContainer>
         )}  

        <MenuContainer >
          <MenuLabelFormat 
            icon={<BsEye className='mr-2 w-5 h-5'/>}
            label={'View Options'}
          />
          <MenuItem 
            type={menuTypes.MENUITEM_TOGGLE} 
            label={'Dark Mode'} 
            useToggle={useDarkMode}
          />  
        </MenuContainer>

        {email && (
          <MenuContainer >
            <MenuItem 
              type={menuTypes.MENUITEM_BTN}
              label={'Create a community'}
              icon={<AiOutlineReddit className='w-5 h-5'/>}
              onClick={handleCreateCommunityBtn}
            />
          <MenuItem 
              type={menuTypes.MENUITEM_LINK} 
              label={'Advertise on Reddit'} 
              icon={<BsMegaphone />}
              linkTo={ROUTES.ADVERTISE}
          />
          <MenuItem 
              type={menuTypes.MENUITEM_LINK} 
              label={'Coins'} 
              icon={<BiCoinStack />}
              linkTo={ROUTES.COINS}
          />
        </MenuContainer >
      )}

      {email? ( 
        <MenuContainer >
          <MenuItem 
              type={menuTypes.MENUITEM_BTN} 
              label={'Log Out'} 
              icon={<BiLogOut />}
              onClick={handleLogout}
          />
        </MenuContainer>
          ): (
          <MenuContainer>
            <MenuItem 
              type={menuTypes.MENUITEM_LINK} 
              label={'Advertise on Reddit'} 
              icon={<BsMegaphone />}
              linkTo={"/"}
            />
            <MenuItem 
                type={menuTypes.MENUITEM_LINK} 
                label={'Coins'} 
                icon={<BiCoinStack />}
                linkTo={ROUTES.COINS}
            />
              <MenuItem 
                type={menuTypes.MENUITEM_BTN} 
                label={'Log In / Sign Up'} 
                icon={<RiLoginBoxLine />}
                onClick={handleLoginSignupBtn}
            /> 
          </MenuContainer>
        )
      }


    </div>
  )
}