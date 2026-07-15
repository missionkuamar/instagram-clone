import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../features/auth/authSlice";
import axiosInstance from "../services/axiosInstance";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    //console.log("Hook called with userId:", userId);

    if (!userId) {
      console.error("userId is undefined");
      return;
    }

    const fetchUserProfile = async () => {
      try {
       // console.log(`Calling API: /user/${userId}/profile`);

        const response = await axiosInstance.get(
          `/user/${userId}/profile`,
          {
            withCredentials: true,
          }
        );

       // console.log("API Response:", response);

        if (response.data.success) {
          dispatch(setUserProfile(response.data.user));
        }
      } catch (error) {
        console.error(
          "API Error:",
          error.response?.data || error.message
        );
      }
    };

    fetchUserProfile();
  }, [userId, dispatch]);
};

export default useGetUserProfile;