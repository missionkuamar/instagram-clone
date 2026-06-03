import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPosts } from '../features/post/postSlice';
import axiosInstance from '../services/axiosInstance'


const useGetAllPost = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllPost = async () => {
            try{
const response = await axiosInstance.get('/post/all', {
    withCredentials: true
});
console.log("All Post Response : ", response);
                if(response.data.success){
                    dispatch(setPosts(response.data.posts));
                }
            } catch(error){
                console.log(error);
            }
        }
        fetchAllPost();
    }, [])
}

export default useGetAllPost;