import { createContext } from "react";
import { Post } from "../firebase/types";
import { VoteType } from "../constants/votes";
export interface RedditPostType extends Post {
    postedby : string | null,
    postedbyPic: string | null, 
    handleVote : (type: VoteType)=> {},
}
export const RedditPostContext = createContext<RedditPostType | null>(null);

type Props = {
    children: React.ReactNode,
    value : RedditPostType
}

export const RedditPostProvider = ({children, value}: Props)=>{

    return <RedditPostContext.Provider
        value={value}
    > 
        {children} 
    </RedditPostContext.Provider>

}