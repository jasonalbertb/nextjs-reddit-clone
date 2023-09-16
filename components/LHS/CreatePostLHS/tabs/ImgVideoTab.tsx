import { ContextType, CreatePostContext } from '@/utils/context/CreatePostContext';
import React, { useCallback, useContext, useEffect, useState} from 'react'
import { Dropzone } from '../Dropzone';
import Skeleton from "react-loading-skeleton";
import { MdClose } from 'react-icons/md';
import { handleError } from '@/utils/helpers/errors';
import { deletePhoto, uploadPhoto } from '@/utils/firebase/functions';
import Image from 'next/image';

type Props = {}

export const ImgVideoTab = (props: Props) => {
    const {imgURL, setImgURL} = useContext(CreatePostContext) as ContextType;
    const [isImgLoading, setIsImgLoading] = useState(false);
    const [progressBar, setProgressBar] = useState(0);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleCloseBtn = useCallback(()=>{
        setImgURL('');
        setSelectedFile(null);
        (async()=>{
          try {
            await deletePhoto(imgURL)
          } catch (error) {
            handleError(error)
          }
        })()
      } , [imgURL])

    useEffect(()=>{
      if (!selectedFile) {
        return
      }
      try {
        uploadPhoto({selectedFile, setProgressBar, setIsImgLoading, setImgURL, setSelectedFile})
      } catch (error) {
        
        handleError(error);
      }
    }, [selectedFile, handleError, setImgURL])

    if (selectedFile || imgURL !=='') {
      return (
        <div className='flex border'>
          <div className='w-full'>
            <div className='group relative  w-24 h-24 overflow-hidden'>
                  {imgURL && <button 
                    onClick={handleCloseBtn}
                    className='bg-black group-hover:block rounded-full hidden  text-white p-[1px] absolute right-3 top-3'>
                    <MdClose className='w-5 h-5 ' />
                  </button>}
                  
                  {isImgLoading?
                    <div className='leading-none overflow-hidden border w-24 h-24'>
                      <Skeleton width={"100%"} height={"100%"}/>
                    </div>:
                    <Image src={imgURL} alt={`img-${imgURL}`} width={96} height={96}
                      className='bg-white  object-cover p-1.5 ' />
                  }
                  
            </div>
            <div className='w-full h-4'>
              <div style={{width : `${progressBar}%`}} className='bg-blue-500 h-1 my-2'></div>
            </div>
          </div>
          
          
        </div>
      )
    }

    return (
      <div>
          <Dropzone 
            setSelectedFile={setSelectedFile}
          /> 
      </div>
    )
}