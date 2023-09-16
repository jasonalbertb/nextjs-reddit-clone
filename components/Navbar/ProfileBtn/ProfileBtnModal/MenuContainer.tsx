import React from 'react'

type Props = {
    children : React.ReactNode
}

export const MenuContainer = ({children}: Props) => {
  return (
    <ul className='py-2 border-b border-gray-200'>
        {children}
    </ul>
  )
}
