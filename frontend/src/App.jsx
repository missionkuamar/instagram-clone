 import { socket } from "./socket";
import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ChatPage from './pages/ChatPage'
import EditProfile from './pages/EditProfile'
import Profile from './pages/Profile'
import Home from './pages/Home'
import MainLayout from './pages/MainLayout'
import ProtectedRoutes from './components/ProtectedRoutes'
import Search from "./pages/Search";
import { io } from 'socket.io-client'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setSocket } from './features/socket/SocketSlice'
import { setOnlineUsers } from './features/chat/chatSlice'
import Explore from "./pages/Explore";
import { setLikeNotification } from './features/rtnslice/notification'
import PostDetail from './pages/PostDetail'
const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      {
        index: true,
        element: <ProtectedRoutes><Home /></ProtectedRoutes>
      },
      {
        path: '/profile/:id',
        element: <ProtectedRoutes><Profile /></ProtectedRoutes>
      },
      {
        path: '/account/edit',
        element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>
      },
      {
        path: '/search',
        element: <ProtectedRoutes><Search /></ProtectedRoutes>
      },
      {
        path: '/explore',
        element: <ProtectedRoutes><Explore /></ProtectedRoutes>
      },
      {
        path: '/chat',
        element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>
      },
      {
      path: "/post/:id", element: <ProtectedRoutes><PostDetail /></ProtectedRoutes>

      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  }
])


const App = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

 useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:8000', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      // listen all the events
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);


  return (
    <RouterProvider router={browserRouter} />
  )
}

export default App