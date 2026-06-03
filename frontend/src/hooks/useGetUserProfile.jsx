import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../features/auth/authSlice";
import axionsInstance from "../services/axiosInstance";

const useGetUserProfile = () => {
    const dispatch = useDispatch();
    useEffect(() => {
const fetchUserProfile = async () => {
    try{
         const response = await axionsInstance.get((`/user/${userId}/profile`), {
            withCredentials: true,
         });
         console.log("User Profile Response : ", response);
         if(response.data.success){
            dispatch(setUserProfile(response.data.user));
         }
    } catch(error){
            console.error("Error fetching user profile:", error);
    }
}
fetchUserProfile();
    }, [userId])
}

export default useGetUserProfile;   