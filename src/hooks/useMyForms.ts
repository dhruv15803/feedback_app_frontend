import { API_URL } from "@/App";
import { FormType } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export const useMyForms = () => {
  const [forms, setForms] = useState<FormType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMyForms = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/form/my-forms`, {
          withCredentials: true,
        });
        console.log(response);
        setForms(response.data.forms);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyForms();
  }, []);

  return { forms, isLoading, setForms };
};
