import { RedditPost } from '@/components/RedditPost';
import { getCommunityPosts, getProfilePosts } from '@/utils/firebase/functions';
import { Post } from '@/utils/firebase/types';
import { handleError } from '@/utils/helpers/errors';
import { useIntersectionObserver } from '@/utils/hooks/useIntersectionObserver';
import React, { useEffect, useState } from 'react'

type Props = {
    username: string
}

export const ProfileLHS = ({username}: Props) => {
    const [profilePosts, setProfilePosts] = useState<Post[]>([]);
    
    
    const {lastItemRef, setHasMore, setStartAfterDoc, 
        startPaginate, setStartPaginate, startAfterDoc
    }= useIntersectionObserver();

    // hooks
    useEffect(()=>{
        if (username) {
            try {
                (async()=>{
                  const data =  await getProfilePosts(
                    {authorUname: username,
                        paginator: {setHasMore, setStartAfterDoc, startPaginate, setStartPaginate, startAfterDoc}
                    }
                  )
                  if (data) {
                    setProfilePosts(prev=>{
                      return [...prev, ...data]
                    })
                  }
                })()
              } catch (error) {
                handleError(error)
              }
        }
    }, [username, setHasMore, setStartAfterDoc,setStartPaginate, startAfterDoc, startPaginate]);

    return (
        <div>
            {profilePosts.map((item: Post, index: number)=>{
                return (<RedditPost key={index} {...item}/>)
            })} 
            <div ref={lastItemRef}></div>
        </div>
    )
}