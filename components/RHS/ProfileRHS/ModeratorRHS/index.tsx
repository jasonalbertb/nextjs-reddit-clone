import { Community } from "@/utils/firebase/types"
import { useEffect, useState } from "react"
import { ModeratedComm } from "./ModeratedComm"
import { getModeratedCommunities } from "@/utils/firebase/functions";
import { handleError } from "@/utils/helpers/errors";

export const ModeratorRHS = () => {
    const [moderatedCommunities, setModeratedCommunities] = useState<Community[]>([]);

    useEffect(()=>{
        (async()=>{
            try {
                const data = await getModeratedCommunities()
                console.log('data', data);
                
                setModeratedCommunities(data);
            } catch (error) {
                console.log((error));
                
                handleError(error)
            }
        })()
    }, []);

    if (moderatedCommunities.length === 0) {
        return <></>
    }

    return (
        <div className='bg-white mt-4 p-4'>
            <h1 className='text-sm font-semibold tracking-wide'>
                You're a moderator of these communities
            </h1>
            <ul>
                {moderatedCommunities.map((item, index)=> {
                    return <ModeratedComm key={index} {...item}/>
                })}
            </ul>
        </div>
    )
}