import { updateProfilePic } from '@/utils/firebase/functions';
import React, { useEffect, useRef, useState } from 'react'
import { BsCamera } from 'react-icons/bs'



export const ProfileCameraBtn = () => {
    const ref = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    
    const [btnDisabled, setBtnDisabled] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files? e.target.files[0]: null;
        setSelectedFile(file)
    }

    const handleBtn = (e: React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        if (ref.current) {
            ref.current.click();
        }
    }

    useEffect(()=>{
        (async()=>{
            if (!selectedFile) {
                return
            }
            await updateProfilePic({selectedFile, setBtnDisabled, setSelectedFile})
        })()
    }, [selectedFile]);

    return (
        <>
             <button 
                disabled={btnDisabled}
                className='bg-white rounded-full border border-blue-500 p-1 disabled:bg-gray-200' 
                onClick={handleBtn}
            >
                <BsCamera className='text-blue-500 w-6 h-6'/>  
            </button>
            <input  className='hidden' type='file' accept='image/*'
                ref={ref} onChange={handleInputChange}  
            />
        </>
       
    )
}