import React from 'react'

type Props = {
    icon : React.ReactNode
}

export const MenuIcon = ({icon}: Props) => {
  return (
    <div className='flex w-8 h-6 justify-center items-center overflow-hidden relative'>
        {icon && (
            <div className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]'>
                {icon}
            </div>)
        }  
    </div>
  )
}
