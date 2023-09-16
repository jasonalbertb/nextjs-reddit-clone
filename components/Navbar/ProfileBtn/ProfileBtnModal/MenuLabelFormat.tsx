import React from 'react'
import {MenuIcon} from "./MenuItem/MenuIcon";

type Props = {
    icon : React.ReactNode,
    label : string
}

export const MenuLabelFormat = ({icon, label}: Props) => {
  return (
    <li className='font-[500] tracking-wide flex items-center text-gray-500 text-sm my-3 mx-4'>
        <MenuIcon icon={icon}/> <span className='capitalize'>{label}</span>
    </li>
  )
}
