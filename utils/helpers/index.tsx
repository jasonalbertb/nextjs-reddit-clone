
import moment from "moment";
import { abbreviateNumber } from "js-abbreviation-number";
import { FirebaseError } from "firebase/app";
import { Timestamp } from "firebase/firestore";

const regexEmail = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
const alphaNumeric = /^[a-zA-Z0-9_]+$/;

export const verifyEmail = (email: string)=>{
    return regexEmail.test(email)
}

export const errorToMsg = (errorMsg : string)=>{
    let msg = '';
    switch (errorMsg) {
        case 'auth/weak-password':
          msg = 'Weak Password'
          break;
        case 'auth/email-already-in-use':
          msg ='Email already in use';
          break;
        case  'auth/invalid-email':
          msg = 'Invalid Email'
          break;
        case 'auth/popup-blocked':
          msg = 'Pop-up blocked'
          break
        default:
          msg = 'Something went wrong- Firebase';
          break;
      }
    return msg
}

export const verifyCommunityName = (name : string)=>{
  return (alphaNumeric.test(name)) 
}

export const formatDate = (date: Date | undefined)=>{
  if (!date) {return ""};
  return moment(date).format('MMM DD, YYYY')
}

export const formatDateFromNow = (timestamp: Timestamp) =>{
  if (!timestamp) {
    return 
  }
  return moment(timestamp.toDate()).fromNow()
}

export const formatNumber = (num: number=0)=>{
  return abbreviateNumber(num, 1)
}

export const formatString = (str: string, len : number)=>{
  return str.substring(0, len)
}

export const resolvePath = (...args:string[])=>{
  return args.join('/')
}
