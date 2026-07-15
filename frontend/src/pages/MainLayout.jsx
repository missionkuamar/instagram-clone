import React, { useState, useEffect } from 'react'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import { Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const MainLayout = () => {
  const { user } = useSelector(store => store.auth);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if current route is chat or other full-width pages
  const isFullWidthPage = location.pathname === '/chat' || 
                          location.pathname === '/messages' ||
                          location.pathname.startsWith('/chat/');

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Left Sidebar */}
      <LeftSidebar />
      
      {/* Main Content */}
      <div className={`
        min-h-screen
        transition-all duration-300
      
        // Mobile padding
        px-2 sm:px-3 md:px-4
        // Margin top for mobile header
       
        // Desktop margins for sidebars
        ${!isFullWidthPage ? `
          lg:ml-64
          xl:ml-72
          2xl:ml-80
          lg:mr-0
          xl:mr-80
          2xl:mr-96
          max-w-full
          lg:max-w-[calc(100%-16rem)]
          xl:max-w-[calc(100%-20rem)]
          2xl:max-w-[calc(100%-24rem)]
        ` : `
          lg:ml-64
          xl:ml-72
          2xl:ml-80
          max-w-full
          lg:max-w-[calc(100%-16rem)]
          xl:max-w-[calc(100%-18rem)]
          2xl:max-w-[calc(100%-20rem)]
        `}
      `}>
        <div className={`
          w-full mx-auto
          ${isFullWidthPage ? 'max-w-full px-0' : 'max-w-7xl px-2 sm:px-4'}
           
        `}>
          <Outlet />
        </div>
      </div>
      
      {/* Right Sidebar - Only visible on large screens and not on full-width pages */}
      {user && !isFullWidthPage && !isMobile && <RightSidebar />}
      
      {/* Mobile overlay for sidebar */}
      {isMobile && (
        <div className="lg:hidden">
          {/* Left sidebar toggle button is in LeftSidebar component */}
        </div>
      )}
    </div>
  )
}

export default MainLayout