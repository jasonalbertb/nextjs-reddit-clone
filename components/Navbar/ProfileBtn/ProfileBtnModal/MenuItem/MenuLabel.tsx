import React from 'react'

type Props = {
    label : string, 
    children: React.ReactNode
}

export const MenuLabel = ({label, children}: Props) => {
  return (
    <div className='flex justify-between  flex-1'>
            <div className='line-clamp-1 text-sm font-[500] tracking-wide'>
              {label}
            </div>
            {children}
    </div>
  )
}
