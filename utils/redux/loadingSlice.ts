import {createSlice} from "@reduxjs/toolkit";


const initialState : {isAppLoading: boolean} = {
    isAppLoading : true
}

export const loadingSlice = createSlice({
    name : 'loading',
    initialState,
    reducers : {                                                                                                                                                        
        setIsAppLoading : (state, action)=>{
            state.isAppLoading = action.payload
        }
    }
})

export const {setIsAppLoading} = loadingSlice.actions
