import { useAuthUser } from '@/hooks/useAuthUser';
import { AppContextType } from '@/types';
import React from 'react'
import {createContext} from "react"

export const AppContext = createContext<AppContextType | null>(null);

const AppContextProvider = ({children}:{children:React.ReactNode}) => {

    const {loggedInUser,setLoggedInUser,isLoading} = useAuthUser();

  return (
    <>
        <AppContext.Provider value={{
            loggedInUser:loggedInUser,
            setLoggedInUser:setLoggedInUser,
            isLoggedInUserLoading:isLoading,
        }}>
            {children}
        </AppContext.Provider>
    </>
  )
}

export default AppContextProvider;
