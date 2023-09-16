import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { useCallback, useRef, useState } from 'react'


export const useIntersectionObserver = () => {
    const [hasMore, setHasMore] = useState(true);
    const [startAfterDoc, setStartAfterDoc] = useState<QueryDocumentSnapshot<DocumentData, DocumentData> | null>(null);
    const [startPaginate, setStartPaginate] = useState(true);

    const observerBody = useRef<IntersectionObserver>();

    const lastItemRef = useCallback((node: HTMLDivElement)=>{
      if (observerBody.current) observerBody.current.disconnect();
        observerBody.current = new IntersectionObserver(entries=>{
          if (entries[0].isIntersecting && hasMore) {
            setStartPaginate(true);
          } 
        }); 
      if (node) observerBody.current.observe(node); 
    }, [ observerBody, hasMore]);
    

      return {lastItemRef, setHasMore, 
        startAfterDoc, setStartAfterDoc, 
        startPaginate, setStartPaginate
      }
}