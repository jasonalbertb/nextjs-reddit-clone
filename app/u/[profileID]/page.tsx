'use client'

import { ProfileLHS } from '@/components/LHS/ProfileLHS'
import { ProfileRHS } from '@/components/RHS/ProfileRHS'
import { LoadNotFound } from '@/components/layouts/LoadNotFound'
import { NavPageWrapper } from '@/components/layouts/NavPageWrapper'
import { ReactLoader } from '@/components/loaders/ReactLoader'
import { getUserDataByUsername } from '@/utils/firebase/functions'
import { handleError } from '@/utils/helpers/errors'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'


const ProfilePage = () => {
    const username = useParams().profileID as string;
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(()=>{
        (async()=>{
            try {
                setIsLoading(true)
                const data = await getUserDataByUsername(username);
                if (!data) {
                    throw new Error('User not found');
                }
            } catch (error) {
                handleError(error)
                setNotFound(true);
            }
            setIsLoading(false)
        })()
    }, [username]);


    if (isLoading) {
        return <ReactLoader />
    }

    if (notFound) {
        return ( 
            <NavPageWrapper>
                <LoadNotFound />
            </NavPageWrapper>
        )
    }
    return (
        <NavPageWrapper >
            
            <ProfileLHS username={username}/>
            <ProfileRHS username={username}/>
        </NavPageWrapper>
    )

   
}

export default ProfilePage