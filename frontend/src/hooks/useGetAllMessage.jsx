import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../features/post/postSlice';
import axiosInstance from '../services/axiosInstance'
import { setMessages } from '@/features/chat/chatSlice';


const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector((state) => state.auth || {})
  //  console.log('selectedUser', selectedUser?._id);
    useEffect(() => {
        const fetchAllMessage = async () => {
            try {
                const response = await axiosInstance.get(`/message/all/${selectedUser?._id}`, {
                    withCredentials: true
                });
               // console.log("All Message Response : ", response);
                if (response.data.success) {
                    dispatch(setMessages(response.data.messages
));
                }
            } catch (error) {
                //console.log(error);
            }
        }
        fetchAllMessage();
    }, [selectedUser])
}

export default useGetAllMessage;