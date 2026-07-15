// context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { socketService } from '../services/socketService';
import { useDispatch, useSelector } from 'react-redux';
import { setSocketConnection, setSocketId } from '../features/socket/SocketSlice';
import { setOnlineUsers } from '../features/chat/chatSlice';
import { setLikeNotification } from '../features/rtnslice/notification';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user?._id) {
            socketService.disconnect();
            setIsConnected(false);
            dispatch(setSocketConnection(false));
            return;
        }

        // Connect socket
        const socket = socketService.connect(user._id);

        // Listen for connection status
        socketService.on('connectionStatus', (status) => {
            setIsConnected(status);
            dispatch(setSocketConnection(status));
            if (status) {
                dispatch(setSocketId(socket.id));
            }
        });

        // Listen for online users
        socketService.on('getOnlineUsers', (onlineUsers) => {
            dispatch(setOnlineUsers(onlineUsers));
        });

        // Listen for notifications
        socketService.on('notification', (notification) => {
            dispatch(setLikeNotification(notification));
        });

        // Listen for new messages (real-time chat)
        socketService.on('newMessage', (newMessage) => {
            // This will be handled in ChatPage
            // Dispatch an event that ChatPage can listen to
            window.dispatchEvent(new CustomEvent('newMessage', { detail: newMessage }));
        });

        return () => {
            socketService.off('connectionStatus');
            socketService.off('getOnlineUsers');
            socketService.off('notification');
            socketService.off('newMessage');
        };
    }, [user?._id, dispatch]);

    const value = {
        socket: socketService.getSocket(),
        isConnected,
        emit: socketService.emit.bind(socketService),
        on: socketService.on.bind(socketService),
        off: socketService.off.bind(socketService)
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};