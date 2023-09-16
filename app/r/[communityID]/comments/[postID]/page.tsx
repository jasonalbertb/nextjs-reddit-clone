'use client'

import { PostCommentLHS } from '@/components/LHS/PostCommentLHS'
import { CommunityRHS } from '@/components/RHS/CommunityRHS'
import { ProfileRHS } from '@/components/RHS/ProfileRHS/page'
import { LoadNotFound } from '@/components/layouts/LoadNotFound'
import { NavPageWrapper } from '@/components/layouts/NavPageWrapper'
import { ReactLoader } from '@/components/loaders/ReactLoader'
import { PostCommentProvider } from '@/utils/context/PostCommentContext'
import { listenToRedditPost } from '@/utils/firebase/functions'
import { Post } from '@/utils/firebase/types'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'



const RedditPostPage = () => {
    const {postID, communityID} = useParams() as {
        postID: string, communityID: string
    };
    
    const [isLoading , setIsLoading] = useState(true);
    const [redditPostData, setRedditPostData] = useState<Post | null>(null);


    useEffect(()=>{
        const unsub = listenToRedditPost({
          postID,
          setPostData: (data)=>{
              setRedditPostData(data); 
              setIsLoading(false); 
          }
        }) 
        return unsub
      }, [postID]); 

      if (isLoading) {
        return <ReactLoader />
      }

      if (!redditPostData) {
        return (
          <NavPageWrapper>
            <LoadNotFound />
          </NavPageWrapper>
        )
      }

    return ( 
        <PostCommentProvider
          value={{...redditPostData}}
        >  
            <Helmet> 
                <title> Reddit </title>
                <meta charSet="utf-8" />
            </Helmet>
            <NavPageWrapper>
                <PostCommentLHS />
                <CommunityRHS communityID={communityID}/>
            </NavPageWrapper> 
        </PostCommentProvider> 
 
    )
}

export default RedditPostPage