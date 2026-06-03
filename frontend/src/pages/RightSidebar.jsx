import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
 
const RightSidebar = () => {
    const { user, suggestedUsers } = useSelector(store => store.auth || {});
    console.log("RightSidebar User : ", user, "Suggested Users : ", suggestedUsers);
    const [isDark, setIsDark] = useState(false);

    // Listen for theme changes
    useEffect(() => {
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    return (
        <div className={`
            fixed right-0 top-0 h-screen overflow-y-auto
            hidden lg:block
            w-[25%] xl:w-[20%]
            p-4 pt-20
            bg-white dark:bg-gray-900
            border-l border-gray-200 dark:border-gray-800
            transition-all duration-300
            z-30
        `}>
            {/* User Profile Section */}
            <div className='mb-6'>
                <div className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
                    <Link to={`/profile/${user?._id || user?.id}`}>
                        <Avatar className="w-12 h-12 ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-gray-900">
                            <AvatarImage src={user?.profilePicture} />
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                    <div className='flex-1 min-w-0'>
                        <Link to={`/profile/${user?._id || user?.id}`}>
                            <h1 className='font-semibold text-sm dark:text-white hover:underline truncate'>
                                {user?.username || 'username'}
                            </h1>
                        </Link>
                        <p className='text-gray-500 dark:text-gray-400 text-xs truncate'>
                            {user?.bio || "Bio here..."}
                        </p>
                    </div>
                </div> 
            </div>

            {/* Suggestions Section */}
            <div className='mt-6'>
                <div className='flex justify-between items-center mb-4 px-3'>
                    <h3 className='text-sm font-semibold text-gray-600 dark:text-gray-400'>
                        Suggestions for you
                    </h3>
                    <button className='text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700'>
                        See All
                    </button>
                </div>
                
               {suggestedUsers?.map((sug) => (
    <div
        key={sug._id}
        className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group'
    >
        <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                {sug?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>

        <div className='flex-1'>
            <p className='text-sm font-medium dark:text-white group-hover:text-purple-600'>
                {sug.username}
            </p>

            <p className='text-xs text-gray-500 dark:text-gray-400'>
                {sug.bio || "Suggested for you"}
            </p>
        </div>

        <button className='text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700'>
            Follow
        </button>
    </div>
))}
            </div>

            {/* Footer Links */}
            <div className='mt-8 px-3 text-xs text-gray-400 dark:text-gray-600'>
                <div className='flex flex-wrap gap-2 mb-2'>
                    <span className='cursor-pointer hover:underline'>About</span>
                    <span className='cursor-pointer hover:underline'>Help</span>
                    <span className='cursor-pointer hover:underline'>Privacy</span>
                    <span className='cursor-pointer hover:underline'>Terms</span>
                    <span className='cursor-pointer hover:underline'>Locations</span>
                </div>
                <p>© 2024 SocialHub</p>
            </div>
        </div>
    )
}

export default RightSidebar