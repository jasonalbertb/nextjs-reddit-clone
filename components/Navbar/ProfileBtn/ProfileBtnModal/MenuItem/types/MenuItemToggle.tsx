import React from 'react'
import {MenuIcon} from "../MenuIcon";
import {MenuLabel} from "../MenuLabel";
import {MenuItemContainer} from "../MenuItemContainer";
import {useOnlineStatus} from "@/utils/hooks/useOnlineStatus";
type Props = {
    icon : React.ReactNode;
    label : string;
    useToggle ?: () => {
      status: boolean;
      toggleStatus: () => void;
  }
}

export const MenuItemToggle = ({icon, label, useToggle}: Props) => {
  if (useToggle) {
    const {status, toggleStatus} = useToggle();
    return (
      <MenuItemContainer onClick={toggleStatus}>
        <MenuIcon icon={icon}/>
        <MenuLabel label={label}>
          <div className={`ml-2 border min-w-[36px] h-6 rounded-full p-[1px] relative 
              transition-all ease-out duration-150
              ${status? 'bg-blue-400': 'bg-gray-300'}`}
          >
            <div className={`border border-gray-300 w-5 h-5 rounded-full bg-white absolute shadow-lg
                ${status? 'translate-x-3': 'translate-x-0'} `}
            >
            </div>
          </div>
        </MenuLabel>
      </MenuItemContainer>     
    )

  }
  return <></>
  
}
