import React from 'react'
import { Logo } from './Logo'
import { SearchInput } from './SearchInput'
import { NavBtns } from './NavBtns'
import { ProfileBtn } from './ProfileBtn'
import { MenuBtn } from './MenuBtn'





export const Navbar = () => {

  
  return (
    <div className={`flex w-full items-center border border-gray-100 px-4 py-1 bg-white`}>
      <div className='flex flex-1 items-center'>
        <Logo />
        <MenuBtn />
        <SearchInput />
      </div>
      <div className='flex items-center'>
        <NavBtns />
        <ProfileBtn isOnline={false} />
      </div>
    </div>
  )
}

