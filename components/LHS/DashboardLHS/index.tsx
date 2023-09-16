import { getDashboardPosts } from '@/utils/firebase/functions';
import { Post } from '@/utils/firebase/types';
import { handleError } from '@/utils/helpers/errors';
import { useIntersectionObserver } from '@/utils/hooks/useIntersectionObserver';
import React, { useEffect, useState } from 'react'
import { DashboardCreatePost } from '../CommunityLHS/DashboardCreatePost';
import { useAppSelector } from '@/utils/redux/hooks';
import { RedditPost } from '@/components/RedditPost';

type Props = {}

export const DashboardLHS = (props: Props) => {
  const {email, username} = useAppSelector(state=>state.user); 
  const [dashboardPosts, setDashboardPosts] = useState<Post[]>([]);
  const {lastItemRef, setHasMore, setStartAfterDoc, 
    startPaginate, setStartPaginate, startAfterDoc
  }= useIntersectionObserver();


  useEffect(()=>{ 
    try {
      (async()=>{
        const data =  await getDashboardPosts( 
          {
            paginator: {setHasMore, setStartAfterDoc, startPaginate, setStartPaginate, startAfterDoc}
          }
        )
        if (!email) {
          setDashboardPosts([]);
          return;
        }
        if (data) {
          setDashboardPosts(prev=>[...prev, ...data])
        }
      })()
    } catch (error) {
      handleError(error)
    }
  }, [setHasMore, setStartAfterDoc,setStartPaginate, startAfterDoc, startPaginate, email]);


  return (
    <div >
      {email && <DashboardCreatePost username={username} email={email}/>}
      {dashboardPosts.map((item: Post, index: number)=>{
        return (<RedditPost key={index} {...item}/>)
      })} 
      <div ref={lastItemRef}></div>
    </div>
  )
} 