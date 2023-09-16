import React, { useCallback} from 'react';
import {useDropzone} from "react-dropzone";





type Props = {
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>
}

export const Dropzone = ({setSelectedFile}: Props) => {
  const onDrop = useCallback((files: File[]) => {
    setSelectedFile(files[0])
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  return (
    <div {...getRootProps()} className='flex flex-col items-center border-2 border-r-2 border-dashed border-dropbox1
      bg-dropbox2 text-dropbox3 transition-all ease-in-out duration-300 h-[150px] justify-center'>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
} 