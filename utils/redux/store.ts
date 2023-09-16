import {configureStore} from "@reduxjs/toolkit";
import {userSlice} from "./userSlice";
import {createCommunitySlice} from "./createCommunitySlice";
import {loginSignupSlice} from "./loginSignupSlice";
import {loadingSlice} from "./loadingSlice";

export const store = configureStore({
    reducer : {
        user: userSlice.reducer,
        createCommunity : createCommunitySlice.reducer,
        loginSignup : loginSignupSlice.reducer,
        loading : loadingSlice.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
