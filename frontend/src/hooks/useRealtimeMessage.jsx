import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '@/features/chat/chatSlice';


const useGetRTM = () => {
   const dispatch = useDispatch();
   const { socket } = useSelector((state) => state.socketio);
   const { messages } = useSelector((state) => state.chat);

    useEffect(() => {
       socket?.on('newMessage', (newMessage) => {
        dispatch(setMessages([...messages, newMessage]));
       })
    }, [socket, dispatch, messages])
}

export default useGetRTM;