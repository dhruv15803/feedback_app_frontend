import { API_URL } from "@/App";
import { UserType } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react"



export const useAuthUser = () => {

    const [loggedInUser,setLoggedInUser] = useState<UserType | null>(null);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log('Fetching user');
                setIsLoading(true);
                const response = await axios.get(`${API_URL}/auth/user`,{
                    withCredentials:true,
                });
                console.log(response);
                setLoggedInUser(response.data.user);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchUser();
    },[])

    return {loggedInUser,setLoggedInUser,isLoading};
}