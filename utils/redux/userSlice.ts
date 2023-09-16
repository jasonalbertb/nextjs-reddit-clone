import {createSlice} from "@reduxjs/toolkit";

export type User = {
    email?: string, 
    username?: string
} ;

let initialState: User = {};

export const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        login : (state, action)=>{        
            state.email = action.payload.email
            state.username = action.payload.username
        }, 
        logout : (state)=>{
            state.email = undefined
            state.username = undefined
        }
    }
})

export const {login, logout} = userSlice.actions