"use client";

import { useEffect , useCallback} from "react";

type Props = {
	handleClose: () => void
  ref : React.MutableRefObject<HTMLDivElement | null>
};

export const useOutsideClick = ({handleClose, ref}: Props) => {
  const handleClick = useCallback((e : MouseEvent)=>{
    if (ref?.current?.contains && !ref.current.contains(e.target as HTMLElement)) {
        handleClose();
    }
  }, [handleClose, ref]); 

  return (
      useEffect(()=>{
        document.addEventListener('mouseup', handleClick);
        return ()=>{
            document.removeEventListener('mouseup', handleClick);
        }
      }, [handleClick])
  )
};
