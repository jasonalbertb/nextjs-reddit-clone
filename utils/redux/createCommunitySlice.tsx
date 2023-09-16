import {createSlice} from '@reduxjs/toolkit';

export const createCommunitySlice = createSlice({
    name : 'createCommunity',
    initialState :{
        showCreateCommunity : false
    },
    reducers : {
        setShowCreateCommunity : (state, actions)=>{
            state.showCreateCommunity = actions.payload
        }
    }
})

export const {setShowCreateCommunity} = createCommunitySlice.actions

