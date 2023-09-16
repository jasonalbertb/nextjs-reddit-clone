'use client'
import {CreatePostLHS} from '@/components/LHS/CreatePostLHS'
import { CreatePostRHS } from '@/components/RHS/CreatePostRHS'
import { NavPageWrapper } from '@/components/layouts/NavPageWrapper'
import { useParams } from 'next/navigation'
import React from 'react'
import { Helmet } from 'react-helmet-async'

type Props = {}

const CreatePostPage = (props: Props) => {
    const communityID = useParams().communityID as string;
    return ( 
        <>  
            <Helmet>
                <title>Submit {communityID}</title>
                <meta charSet="utf-8" />
            </Helmet>
            <NavPageWrapper>
                <CreatePostLHS communityID={communityID}/>
                <CreatePostRHS />
            </NavPageWrapper>
        </> 

    )
}

export default CreatePostPage