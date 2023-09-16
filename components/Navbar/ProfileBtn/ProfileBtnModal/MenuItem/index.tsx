import React from 'react'
import { MenuItemToggle } from './types/MenuItemToggle';
import { MenuItemLink } from './types/MenuItemLink';
import { MenuItemButton } from './types/MenuItemButton';

//types
type Props = {
  type : string;
  icon ?: React.ReactNode ;
  label : string;
  useToggle ?: () =>  {
    status: boolean;
    toggleStatus: () => void;
  } ;
  linkTo ?: string 
  onClick ?: ()=>void
}

const MENUITEM_TOGGLE = 'toggle';
const MENUITEM_LINK = 'link';
const MENUITEM_MODAL = 'modal';
const MENUITEM_BTN = 'button';
export const menuTypes = {
  MENUITEM_TOGGLE,
  MENUITEM_LINK,
  MENUITEM_MODAL,
  MENUITEM_BTN 
}



export const MenuItem = ({type, icon, label, useToggle, linkTo, onClick}: Props) => {
  if (type === MENUITEM_TOGGLE) {
    return (
      <MenuItemToggle icon={icon} label={label} useToggle={useToggle}/> 
    )
  } 
  if (type === MENUITEM_LINK) {
    return (
      <MenuItemLink icon={icon} label={label} linkTo={linkTo}/>
    )
  }
  if (type === MENUITEM_BTN) {
    return (
      <MenuItemButton icon={icon} label={label} onClick={onClick}/>
    )
  }

  return (
    <></>
  )
}