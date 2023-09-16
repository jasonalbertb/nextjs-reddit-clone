import React, { Dispatch, SetStateAction } from 'react';

export type ContextType = {
    postTitle: string,
    communityInput: string, setCommunityInput: Dispatch<SetStateAction<string>>,
    postBody: string, setPostBody: Dispatch<SetStateAction<string>>,
    selectedTags: string[], setSelectedTags: Dispatch<SetStateAction<string[]>>,
    imgURL: string, setImgURL: Dispatch<SetStateAction<string>>,
    postLink: string, setPostLink: Dispatch<SetStateAction<string>>,
}

export const CreatePostContext = React.createContext<ContextType | null>(null);

type Props = {
    children: React.ReactNode,
    value : ContextType
}
export const CreatePostProvider = ({children, value}: Props)=>{
    return <CreatePostContext.Provider
        value={value}
    >
        {children}
    </CreatePostContext.Provider>
}