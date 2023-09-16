import { createContext } from 'react';
import { Post } from '../firebase/types';

export const PostCommentContext = createContext<Post | null>(null);

type Props = {
    children: React.ReactNode,
    value : Post
}

export const PostCommentProvider = ({children, value}: Props)=>{
    return (
        <PostCommentContext.Provider
            value={value}
        >
            {children} 
        </PostCommentContext.Provider>
    )
}