import React from "react";
import { getAuth, signInAnonymously } from "firebase/auth";
import { GameContext } from "../contexts/GameContext"

type AuthState = {
    isLoading: boolean
    error?: {
        code: string
        message: string
    }
}

export const useAnonAuth = () => {
    const [signedInState, setSignedInState] = React.useState<AuthState>({ isLoading: false })

    React.useEffect(() => {
        const auth = getAuth();
        
        const signIn = async () => {
            try {
                await signInAnonymously(auth);
            } catch(error) {
                setSignedInState({
                    isLoading: false,
                    error: {
                        code: error.code,
                        message: error.message,
                    }
                })
            }
        }
        
        signIn();
    }, [])
    
    return signedInState;
}