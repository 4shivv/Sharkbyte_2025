import React, { useState, useEffect, useContext, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faStickyNote, } from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

import { ScreenContext } from '../Layouts/RootLayout';

const NavBar = () => {
  const navItems = [
    { label: 'Extra', path: '/map' },
    { label: 'Board', path: '/collab' },
    { label: 'Chat', path: '/chat' },
  ];

  const { isMobile } = useContext(ScreenContext);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navRefs = useRef([]);

  const getInitialIndex = () => {
    const index = navItems.findIndex(item => item.path === location.pathname);
    return index >= 0 ? index : -1;
  };

  const [activeIndex, setActiveIndex] = useState(getInitialIndex);
  const [bgStyle, setBgStyle] = useState({ left: 0, width: 0, visible: false });

  const moveHighlightTo = (el) => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const parentRect = el.parentElement.getBoundingClientRect();
    setBgStyle({
      left: rect.left - parentRect.left,
      width: rect.width,
      visible: true,
    });
  };

  useEffect(() => {
    if (activeIndex >= 0 && navRefs.current[activeIndex]) {
      moveHighlightTo(navRefs.current[activeIndex]);
    } else {
      setBgStyle(prev => ({ ...prev, visible: false }));
    }
  }, [activeIndex, isMobileOpen]);

  useEffect(() => {
    const index = navItems.findIndex(item => item.path === location.pathname);
    setActiveIndex(index >= 0 ? index : -1);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (activeIndex >= 0 && navRefs.current[activeIndex]) {
        moveHighlightTo(navRefs.current[activeIndex]);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex]);

  return (
    <>
    

    {!['/login', '/signup', '/collab'].includes(location.pathname) && (<nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto font-inter">
      {/* Entire nav pill container */}
      <div className="relative flex items-center gap-6 px-3 py-2.5 bg-gray-100/50  backdrop-blur-lg border border-gray-300 shadow- rounded-full transition-all duration-300">
        {/* Brand */}
        <NavLink
          to="/"
          className="flex items-center gap-2 font-semibold text-gray-800 hover:text-black transition-colors"
        >
          <FontAwesomeIcon icon={faStickyNote} className="text-gray-600" />
          WhiteFlow
        </NavLink>

        {/* Desktop nav items */}
        {!isMobile && (
          <div className="flex relative items-center gap-5 ml-6">
            {/* Animated highlight */}
            <span
              className={`absolute top-0 bottom-0 bg-gray-900/10 rounded-full transition-[left,width,opacity] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                bgStyle.visible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ left: bgStyle.left, width: bgStyle.width }}
            />

            {navItems.map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                ref={el => (navRefs.current[index] = el)}
                className={`relative z-10 px-4 py-1.5 text-sm font-medium text-gray-700 hover:text-black transition-colors ${
                  activeIndex === index ? 'text-black' : ''
                }`}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => moveHighlightTo(navRefs.current[index])}
                onMouseLeave={() => {
                  if (activeIndex >= 0 && navRefs.current[activeIndex]) {
                    moveHighlightTo(navRefs.current[activeIndex]);
                  } else {
                    setBgStyle(prev => ({ ...prev, visible: false }));
                  }
                }}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Auth Buttons */}
        {!isMobile && (
          <div className="flex items-center gap-2 ml-4">
            <NavLink
              to="/login"
              className="px-5 py-1.5 text-sm font-medium text-gray-800 border border-gray-300 rounded-full hover:bg-gray-100 transition-all"
            >
              Log in
            </NavLink>
            <NavLink
              to="/signup"
              className="px-5 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-black transition-all"
            >
              Sign up
            </NavLink>
          </div>
        )}

        {/* Mobile Toggle */}
        {isMobile && (
          <button
            onClick={() => setIsMobileOpen(prev => !prev)}
            className="ml-auto bg-gray-900 text-white px-2 py-1.5 rounded-full cursor-pointer hover:bg-black transition-colors"
          >
            <FontAwesomeIcon icon={isMobileOpen ? faXmark : faBars} size="md" />
          </button>
        )}
      </div>

      {/* Mobile dropdown */}
      {isMobile && (
        <div
          className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white/95 backdrop-blur-md border border-gray-200 rounded-3xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out ${
            isMobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ width: '85%' }}
        >
          <div className="flex flex-col gap-3 py-4 px-4">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`text-center px-6 py-2 rounded-full text-gray-800 hover:bg-gray-100 transition-all ${
                  location.pathname === item.path ? 'bg-gray-200' : ''
                }`}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/login"
              onClick={() => setIsMobileOpen(false)}
              className="px-6 py-2 rounded-full text-center border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
            >
              Log in
            </NavLink>
            <NavLink
              to="/signup"
              onClick={() => setIsMobileOpen(false)}
              className="px-6 py-2 rounded-full text-center bg-gray-900 text-white hover:bg-black transition-all"
            >
              Sign up
            </NavLink>
          </div>
        </div>
      )}
    </nav>)}
    </>
  );
};

export default NavBar;
