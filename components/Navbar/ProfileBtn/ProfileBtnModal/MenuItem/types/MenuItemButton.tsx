import React from 'react'
import {MenuIcon} from "../MenuIcon";
import {MenuItemContainer} from "../MenuItemContainer";
import {MenuLabel} from "../MenuLabel";

type Props = {
    icon : React.ReactNode;
    label : string;
    onClick ?: ()=>void
}
 
export const MenuItemButton = ({icon, label, onClick} :Props) => {
  return (
    <MenuItemContainer onClick={onClick}>
      <MenuIcon icon={icon}/>
      <MenuLabel label={label}>
        <></>
      </MenuLabel>
    </MenuItemContainer>
  )
}
