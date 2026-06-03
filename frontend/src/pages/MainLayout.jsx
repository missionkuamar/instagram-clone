import React from 'react'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const MainLayout = () => {
  const { user } = useSelector(store => store.auth);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Left Sidebar - Fixed on desktop, hidden on mobile with toggle */}
      <LeftSidebar />
      
      {/* Main Content - Adjusts based on screen size */}
      <div className={`
        transition-all duration-300
        pt-16 lg:pt-6
        px-4 lg:px-6
        pb-20
        /* Desktop: Space for left sidebar */
        lg:ml-[20%]
        /* Extra large desktop: Space for both sidebars */
        xl:mr-[20%]
      `}>
        <div className="
          w-full
          mx-auto
          /* Center content on desktop */
          lg:max-w-2xl
          xl:max-w-3xl
        ">
          <Outlet />
        </div>
      </div>
      
      {/* Right Sidebar - Only visible on large screens */}
      {user && <RightSidebar />}
    </div>
  )
}

export default MainLayout