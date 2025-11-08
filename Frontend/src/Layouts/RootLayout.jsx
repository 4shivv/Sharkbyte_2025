import React, { createContext } from 'react'
import NavBar from '../components/NavBar'
import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';

export const ScreenContext = createContext({isMobile:false});

export const RootLayout = () => {

  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ScreenContext.Provider value={{isMobile}}>
        <NavBar/>
        <Outlet/>
        <div className="fixed bottom-6 rounded-full  right-6 text-md text-gray-600 z-10 hover:text-gray-500 px-1.5 py-2 cursor-pointer hover:bg-gray-100 transition-colors">
          <FontAwesomeIcon icon={faCircleQuestion} className="text-2xl" />
        </div>
    </ScreenContext.Provider>
  )
}