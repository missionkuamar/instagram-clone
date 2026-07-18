import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { logoutUser, resetAuthState } from '@/features/auth/authSlice';
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp, Sun, Moon, Menu, X } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom'
import CreatePost from './CreatePost';
import NotificationsDialog from './NotificationsDialog';
import {resetSearchState, } from '@/features/search/searchSlice';
import { resetPostsState } from '@/features/post/postSlice';
import { resetChatState } from '@/features/chat/chatSlice';
import { resetSocketState } from '@/features/socket/SocketSlice';
import { resetRealTimeNotificationState } from '@/features/rtnslice/notification';
import { toast } from 'sonner';

const LeftSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector(store => store.auth);
    const { likeNotification } = useSelector((store) => store.realTimeNotification);
    const dispatch = useDispatch();
    const [openCreatePost, setOpenCreatePost] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [openNotifications, setOpenNotifications] = useState(false);

    // Theme State
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark';
    });

    // Apply Theme
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    // ✅ Count unread notifications
    const unreadCount = likeNotification?.filter(notif => !notif.read)?.length || 0;

    const sidebarHandler = async (textType) => {
    if (textType === "Logout") {
        try {
            await dispatch(logoutUser()).unwrap();

            dispatch(resetAuthState());
            dispatch(resetPostsState());
            dispatch(resetChatState());
            dispatch(resetSearchState());

            dispatch(resetSocketState());
             dispatch(resetRealTimeNotificationState());

            navigate("/login");
        } catch (error) {
           // console.error("Logout failed:", error);
             toast.error(
    error.response?.data?.message || "Something went wrong"
  );
        }
    } else if (textType === "Create") {
        setOpenCreatePost(true);
    } else if (textType === "Profile") {
        navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
        navigate("/");
    } else if (textType === "Message") {
        navigate("/chat");
    } else if (textType === "Search") {
        navigate("/search");
    } else if (textType === "Explore") {
        navigate("/explore");
    } else if (textType === "Notifications") {
        setOpenNotifications(true);
    }

    setIsMobileOpen(false);
};

    const isActive = (text) => {
        if (text === 'Home' && (location.pathname === '/' || location.pathname === '')) return true;
        if (text === 'Message' && location.pathname === '/chat') return true;
        if (text === 'Profile' && location.pathname.includes('/profile')) return true;
        if (text === 'Notifications' && location.pathname === '/notifications') return true;
        return false;
    }

    const sidebarItems = [
        { icon: <Home size={22} />, text: 'Home' },
        { icon: <Search size={22} />, text: 'Search' },
        { icon: <TrendingUp size={22} />, text: 'Explore' },
        { icon: <MessageCircle size={22} />, text: 'Message' },
        {
            icon: (
                <div className="relative">
                    <Heart size={22} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </div>
            ),
            text: "Notifications"
        },
        { icon: <PlusSquare size={22} />, text: "Create" },
        {
            icon: (
                <Avatar className="w-6 h-6">
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback className="text-xs">
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: <LogOut size={22} />, text: "Logout" },
    ]

    return (
        <>
            <CreatePost open={openCreatePost} setOpen={setOpenCreatePost} />

            <NotificationsDialog
                open={openNotifications}
                setOpen={setOpenNotifications}
            />

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700"
            >
                {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 z-40 h-full
                bg-white dark:bg-gray-900
                border-r border-gray-200 dark:border-gray-800
                transition-transform duration-300 ease-in-out
                w-64 sm:w-72 lg:w-[20%]
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
                overflow-y-auto
                shadow-lg lg:shadow-none
            `}>
                <div className='flex flex-col h-full'>
                    {/* Header */}
                    <div className='flex items-center justify-between px-5 pt-6 pb-4 border-b border-gray-200 dark:border-gray-800'>
                        <h1
                            onClick={() => navigate('/')}
                            className='font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent cursor-pointer'
                        >
                            SocialHub
                        </h1>
                        <button
                            onClick={toggleTheme}
                            className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition'
                        >
                            {isDark ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-gray-700 dark:text-gray-300" />}
                        </button>
                    </div>

                    {/* Menu Items */}
                    <div className='flex-1 px-3 py-4 z-50'>
                        {sidebarItems.map((item, index) => {
                            const active = isActive(item.text);
                            return (
                                <div
                                    key={index}
                                    onClick={() => sidebarHandler(item.text)}
                                    className={`
                                        flex items-center gap-3 relative cursor-pointer 
                                        rounded-lg p-3 my-1 transition-all duration-200
                                        ${active
                                            ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                        }
                                    `}
                                >
                                    <span className={active ? 'text-purple-600 dark:text-purple-400' : ''}>
                                        {item.icon}
                                    </span>
                                    <span className='text-sm font-medium'>{item.text}</span>
                                    {active && (
                                        <div className='absolute left-0 w-1 h-6 bg-purple-600 rounded-r-full' />
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Mobile User Info */}
                    <div className='lg:hidden p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50'>
                        <div className='flex items-center gap-3'>
                            <Avatar className="w-10 h-10">
                                <AvatarImage src={user?.profilePicture} />
                                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className='flex-1'>
                                <p className='text-sm font-semibold dark:text-white'>{user?.username || 'User'}</p>
                                <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>{user?.email || ''}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className='fixed inset-0 bg-black/50 z-30 lg:hidden'
                />
            )}
        </>
    )
}

export default LeftSidebar