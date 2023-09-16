'use client'

import { useAppDispatch, useAppSelector } from "@/utils/redux/hooks" 
import { useState } from "react";
import { ModalOverlay } from "../ModalOverlay";
import { setShowLoginSignup } from "@/utils/redux/loginSignupSlice";
import { LoginModal } from "./LoginModal";
import { SignUpModal } from "./SignUpModal";

const allTabs = [
    'Login',
    'Signup'
]
export const LoginSignUp = () => {
    const {showLoginSignup} = useAppSelector(state=>state.loginSignup); 
    
    const dispatch = useAppDispatch();
    const [tab, setTab] = useState(allTabs[0]);
    const handleSignupLink = ()=>{
        setTab(allTabs[1]) 
    }
    const handleLoginLink = ()=>{
        setTab(allTabs[0])
    }
    const closeModal = ()=>{
        dispatch(setShowLoginSignup(false));
    }

    return (
        showLoginSignup && (
            <ModalOverlay >
                {tab === allTabs[0] && <LoginModal
                    closeModal={closeModal}
                    goToSignupTab={handleSignupLink}
                />} 
                {tab === allTabs[1] && <SignUpModal 
                    closeModal={closeModal}
                    goToLoginTab={handleLoginLink}
                />}
            </ModalOverlay>
        )

    )
}

