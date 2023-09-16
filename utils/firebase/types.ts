import { Timestamp } from "firebase/firestore"

export type User = {
    id?: string,
    createdAt ?: Timestamp,
    username : string,
    display_pic?: string, 
    followers ?: string[],
    following ?: string[],
    communityJoined ?: string[]
}
export type Community = {
    id ?: string,
    createdAt ?: Timestamp,
    name: string,
    communityType : string,
    isAdultContent : boolean,
    description?: string,
    dp?: string,
    members?: string[],
    moderators ?: string[]
}

export const postTypesConst = {
    COMMUNITY: 'community',
    PROFILE: 'profile',
} as const;

type postKeys = keyof typeof postTypesConst;
export type PostTypes = typeof postTypesConst[postKeys]; 

export type Post = {
    id ?: string,
    createdAt : Timestamp,
    authorID: string,
    communityID: string,
    downvoteIDs: string[],
    upvoteIDs: string[],
    postImage : string,
    postTitle : string,
    type : PostTypes,
    postBody: string,
    selectedTags : string[],
    postLink : string,
    totalComments ?: number,
}

export type Comment = {
    id ?: string,
    createdAt: Timestamp,
    commentBy : string,
    content: string, 
    parent : string,
    postID : string, 
    totalChild: number,
    upvoteIDs ?: string[],
    downvoteIDs ?: string[]
}


