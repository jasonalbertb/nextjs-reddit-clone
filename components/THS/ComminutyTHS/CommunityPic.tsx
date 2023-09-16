import { PICS } from '@/utils/constants/pics'
import { updateCommunityPic } from '@/utils/firebase/functions';
import { handleError } from '@/utils/helpers/errors';
import React, { useEffect, useRef, useState } from 'react'
import {FiCamera} from "react-icons/fi";

type Props = {
    displayPic: string,
    communityID : string,
    isMod: boolean
}

export const CommunityPic = ({displayPic, communityID, isMod}: Props) => {
    const ref = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    
    const [isBtnDisabled, setBtnDisabled] = useState(false);

    const handleCameraBtn = ()=>{
        if (ref.current) {
            ref.current.click();
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files? e.target.files[0]: null;
        setSelectedFile(file)
    }

    useEffect(()=>{
        if (!selectedFile) {
            return
        }
        (async()=>{
            try {
                await updateCommunityPic({
                    communityID,
                    selectedFile,
                    setBtnDisabled,
                    setSelectedFile
                })
            } catch (error) {
                handleError(error)
            }
        })()   
    }, [selectedFile])

    return (
        <div className='absolute bottom-0'>
            <div className='relative bg-white rounded-full'>
                <img src={displayPic||PICS.defaultCommPic} alt='display-pic' 
                    className='rounded-full  block   border-4 border-white w-20 h-20' />
                {isMod && 
                    <button
                        disabled={isBtnDisabled}
                        onClick={handleCameraBtn}
                        className='absolute bottom-0 right-0 bg-white rounded-full p-1 
                            border border-blue-500 disabled:opacity-50'>
                        <FiCamera className='w-5 h-5 text-blue-500'/>
                    </button>
                }
                
            </div>
            <input  className='hidden' type='file' accept='image/*'
                ref={ref} onChange={handleInputChange}  
            />
        </div>
    )
}