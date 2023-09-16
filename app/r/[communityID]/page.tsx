'use client'

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {useParams} from "next/navigation";
//components
import {NavPageWrapper} from "@/components/layouts/NavPageWrapper";
import ReactLoader from '@/app/loading';
import { getCommunityData } from '@/utils/firebase/functions';
import { Community } from '@/utils/firebase/types';
import { handleError } from '@/utils/helpers/errors';
import { LoadNotFound } from '@/components/layouts/LoadNotFound';
import { CommunityLHS } from '@/components/LHS/CommunityLHS';
import { CommunityRHS } from '@/components/RHS/CommunityRHS';
import { ComminutyTHS } from '@/components/THS/ComminutyTHS';


const CommunityPage = () => {
    const communityID = useParams().communityID as string;
    const [isLoading, setIsLoading] = useState(true);
    const [communityData, setCommunityData] = useState<Community | null>(null);
    const [notFound, setNotFound] = useState(false);

    //hooks
    useEffect(()=>{
        (async()=>{
          try {
            setIsLoading(true);
            const data = await getCommunityData(communityID);
            if (data) {
              setCommunityData(data as Community);
            }else{
              setNotFound(true);
            }
          } catch (error) {
            handleError(error)
          }
          setIsLoading(false);
        })()
        
      }, [communityID])

    if(isLoading){
        return < ReactLoader />
    }

    if (notFound) {
        return (
            <>
              <Helmet>
                  <title>Not found</title>
                  <meta charSet="utf-8" />
              </Helmet>
              <NavPageWrapper >
                <LoadNotFound />
              </NavPageWrapper>  
            </> 
        )
    }

    return (
      <>
            <Helmet>
                <title>{communityID}</title>
                <meta charSet="utf-8" />
            </Helmet>
            <NavPageWrapper >
              <CommunityLHS communityID={communityID}/>
              <CommunityRHS communityID={communityID} type='about' 
                moderators={communityData?.moderators}/>
              <ComminutyTHS
                dp={communityData?.dp}
                communityID={communityID}
              />
            </NavPageWrapper>  
      </>
        
    )
}

export default CommunityPage