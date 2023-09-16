import React from 'react'

type Props = {
    children : React.ReactNode,
    onClick ?: () => void
}
export const MenuItemContainer = ({children, onClick}: Props) => {
  return (
    <li onClick={onClick} 
      className='flex items-center px-4 py-1.5 hover:bg-gray-100 cursor-pointer' 
    >
      {children}
    </li>
  )
}
