import { listenToPostChildrenComments } from '@/utils/firebase/functions';
import { Comment} from '@/utils/firebase/types';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CommentComponent } from './CommentComponent';

type Props = {}

export const CommentSection = (props: Props) => {
  const postID = useParams().postID as string;
  const observerBody = useRef<IntersectionObserver>();
  const [hasMore, setHasMore] = useState(true);
  const [limitMax, setLimitMax] = useState(5);
  const [childrenComments, setChildrenComments] = useState<Comment[]>([]);

  const lastItemRef = useCallback((node : HTMLDivElement)=>{
    if (observerBody.current) observerBody.current.disconnect();
      observerBody.current = new IntersectionObserver(entries=>{
        if (entries[0].isIntersecting && hasMore) {
          setLimitMax(prev=>prev+5);
        } 
      });
    if (node) observerBody.current.observe(node); 
  }, [ observerBody, hasMore]);
  
  useEffect(()=>{
    const unsub = listenToPostChildrenComments({
      postID,
      setChildrenComments,
      limitMax,
      setHasMore  
    });

    return unsub;
  }, [setHasMore, postID, limitMax]);

  return (
    <div>
      {
        childrenComments.map((item, index)=>{
          return <CommentComponent key={index} {...item} />;
        })
      }
      <div ref={lastItemRef}></div>
    </div>
  )
}  


