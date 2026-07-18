import { useEffect } from "react";
import { useDispatch } from "react-redux";

import axiosInstance from '../services/axiosInstance'

import { setSuggestedUsers } from "@/features/auth/authSlice";

const useGetSuggestedUser = () => {
   const disptach = useDispatch();
   useEffect(() => {
    const fetchSuggestedUsers = async () => {
        try{
            const response = await axiosInstance.get(`/user/suggested`, {
                withCredentials: true,
            });
            // console.log("Suggested Users Response : ", response);
            if(response.data.success){
                disptach(setSuggestedUsers(response.data.users));
                
            }

        } catch(error){
              //  console.error("Error fetching suggested users:", error);
        }
    }
 fetchSuggestedUsers();
  }, []);

}


export default useGetSuggestedUser;