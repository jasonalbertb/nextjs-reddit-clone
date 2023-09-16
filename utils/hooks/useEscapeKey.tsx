'use client'

import {useEffect, useCallback} from 'react'

type Props = {}

export const useEscapeKey = (handleClose:()=>void) => {
  const handleEscapeKey = useCallback((event:KeyboardEvent)=>{
    if (event.key === 'Escape') {
        handleClose();
    }
  }, [handleClose]);

  return (
    useEffect(()=>{
      document.addEventListener('keyup', handleEscapeKey);
      return ()=>{
          document.removeEventListener('keyup', handleEscapeKey);
      }
    }, [handleEscapeKey])
  )
}