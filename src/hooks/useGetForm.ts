import { API_URL } from "@/App";
import { FormType } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"


export const useGetForm = (formId:string) => {
    
    const [form,setForm] = useState<FormType | null>(null);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    
    useEffect(() => {
        const fetchFormById = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${API_URL}/form/${formId}`);
                console.log(response);
                setForm(response.data.form);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchFormById();
    },[formId])

    return {form,isLoading};
}