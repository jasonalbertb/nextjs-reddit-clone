import { useAppSelector } from '@/utils/redux/hooks';
import React, { useState } from 'react'
import { AddEditDescription } from './AddEditDescription';

type Props = {
  description ?: string,
  moderators: string[],
  communityID: string
}

export const Description = ({description, moderators, communityID}: Props) => {
  const {email} = useAppSelector(state=>state.user);

  
  return (
    <div>
      {email && moderators.includes(email)? 
        <AddEditDescription description={description} communityID={communityID}/>:
        description
      }
    </div>
  )
}