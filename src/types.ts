import { SetStateAction } from "react";


export type AppContextType = {
    loggedInUser:UserType | null;
    setLoggedInUser:React.Dispatch<SetStateAction<UserType | null>>; 
    isLoggedInUserLoading:boolean;
}


export type UserType = {
    _id:string;
    email:string;
    username:string;
    password:string;
    profileImageUrl:string;
    createdAt:string;
    updatedAt:string;
}

export type FormType = {
    _id:string;
    field_title1:string;
    field_title2:string;
    field_title3:string;
    theme:string;
    user_id:UserType | string;
    createdAt:string;
    updatedAt:string;
} 

export type FormResponseType = {
    _id:string;
    form_id:FormType | string;
    field1_value:string;
    field2_value:string;
    field3_value:string;
    createdAt:string;
    updatedAt:string;
}