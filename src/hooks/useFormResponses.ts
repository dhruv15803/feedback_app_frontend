import { API_URL } from "@/App";
import { FormResponseType } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"


export const useFormResponses = (formId:string,page:number,limit:number) => {
    
    const [formResponses,setFormResponses] = useState<FormResponseType[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const [numberOfPages,setNumberOfPages] = useState<number>(1);

    useEffect(() => {

        const fetchFormResponses = async () => {
            try {
                setIsLoading(true);
                const params = new URLSearchParams();
                params.set("page",page.toString());
                params.set("limit",limit.toString());
                console.log(params.toString());
                const response = await axios.get(`${API_URL}/form-response/${formId}?${params.toString()}`,{
                    withCredentials:true,
                });
                console.log(response);
                setFormResponses(response.data.formResponses);
                setNumberOfPages(response.data.numberOfPages);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchFormResponses();
    },[formId,page,limit]);

    return {formResponses,numberOfPages,isLoading};
}