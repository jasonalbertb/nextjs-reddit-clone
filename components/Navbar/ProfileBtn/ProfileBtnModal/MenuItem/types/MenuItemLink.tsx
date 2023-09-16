import React from 'react'
import {MenuIcon} from "../MenuIcon";
import {MenuItemContainer} from "../MenuItemContainer";
import {MenuLabel} from "../MenuLabel";
import {useRouter} from "next/navigation";

type Props = {
    icon : React.ReactNode;
    label : string;
    linkTo? : string
}

export const MenuItemLink = ({icon, label, linkTo="/"}: Props) => {
  const router = useRouter();
  const handleClick = ()=>{
    router.push(linkTo);
  }
  return (
    <MenuItemContainer onClick={handleClick}>
      <MenuIcon icon={icon}/>
      <MenuLabel  label={label}>
        <></>
      </MenuLabel>
    </MenuItemContainer>
  )
} 
