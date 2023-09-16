import { useAppSelector } from '@/utils/redux/hooks';
import React, { useEffect, useState } from 'react'
import { DashboardCreatePost } from './DashboardCreatePost';
import { RedditPost } from '@/components/RedditPost';
import { useIntersectionObserver } from '@/utils/hooks/useIntersectionObserver';
import { getCommunityPosts } from '@/utils/firebase/functions';
import { handleError } from '@/utils/helpers/errors';
import { Post } from '@/utils/firebase/types';

type Props = {
  communityID: string
}

export const CommunityLHS = ({communityID}: Props) => {
  const {email, username} = useAppSelector(state=>state.user); 
  const [communityPosts, setCommunityPosts] = useState<Post[]>([]);

  
  const {lastItemRef, setHasMore, setStartAfterDoc, 
    startPaginate, setStartPaginate, startAfterDoc
  }= useIntersectionObserver();

  
  useEffect(()=>{ 
    try {
      (async()=>{
        const data =  await getCommunityPosts( 
          {
            communityID,
            paginator: {setHasMore, setStartAfterDoc, startPaginate, setStartPaginate, startAfterDoc}
          }
        )
        if (data) {
          setCommunityPosts(prev=>{
          return [...prev, ...data]
        }) 
      }
      })()
    } catch (error) {
      handleError(error)
    }
  }, [communityID,
     setHasMore, setStartAfterDoc,setStartPaginate, startAfterDoc, startPaginate
  ]);


 return (
  <div>
    {email && <DashboardCreatePost username={username} email={email} communityID={communityID}/>}
    {communityPosts.map((item: Post, index: number)=>{
      return (<RedditPost key={index} {...item}/>)
    })} 
    <div ref={lastItemRef}></div>
  </div>
 )
}