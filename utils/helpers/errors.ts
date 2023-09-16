import { FirebaseError } from "firebase/app";
import {toast} from "react-toastify";
import { fileTypes, firebaseMaxFileSize } from "../constants/pics";

const toastErrorMsg = (msg : string)=>{
    toast.error(msg, {position: toast.POSITION.TOP_CENTER})
} 


export const handleError = (error : unknown)=>{
    console.log(error);
    if (error instanceof FirebaseError) {
        toastErrorMsg(error.code)
    }else{
        toastErrorMsg((error as Error)?.message || 'Something went wrong')
    }
}

export function checkImageSelectedFile (selectedFile: File | null){
    if (!selectedFile) {
        throw new Error("File not found");
    }
    if (!fileTypes.includes(selectedFile?.type)) {
        throw new Error("Invalid File");
    } 
    if (!selectedFile.size || selectedFile.size > firebaseMaxFileSize) {
        throw new Error('Image file size must not exceed 5MB');
    }

}