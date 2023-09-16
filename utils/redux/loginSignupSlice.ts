import {createSlice} from "@reduxjs/toolkit";



const initialState = {
    showLoginSignup: false,
} 

export const loginSignupSlice = createSlice({
    name : 'loginSignup',
    initialState,
    reducers :{
        setShowLoginSignup : (state, action)=>{
            state.showLoginSignup = action.payload
        }
    }
})
export const {setShowLoginSignup} = loginSignupSlice.actions
