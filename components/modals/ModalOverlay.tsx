import React from 'react'

type Props = {
    children : React.ReactNode | null,
    onClick ?: ()=> void
}

export const ModalOverlay = ({children, onClick}: Props) => {
  return (
    <div
      onClick={onClick}
      className={`fixed top-0 left-0 w-screen h-screen bg-black-rgba-1 grid 
      place-items-center z-[2000]`}>
        {children}
    </div>
  )
}