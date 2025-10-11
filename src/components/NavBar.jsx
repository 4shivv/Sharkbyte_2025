import React, { useState, useEffect, useContext, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faWallet } from '@fortawesome/free-solid-svg-icons';
import { ScreenContext } from '../Layouts/RootLayout';

const NavBar = () => {
  const navItems = [
    { label: 'Map', path: '/map' },
    { label: 'Spending', path: '/spending' },
    { label: 'Analytics', path: '/analytics' },
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

  // Handle initial + active item highlight
  useEffect(() => {
    if (activeIndex >= 0 && navRefs.current[activeIndex]) {
      moveHighlightTo(navRefs.current[activeIndex]);
    } else {
      setBgStyle(prev => ({ ...prev, visible: false }));
    }
  }, [activeIndex, isMobileOpen]);

  // Handle active nav updates on route change
  useEffect(() => {
    const index = navItems.findIndex(item => item.path === location.pathname);
    setActiveIndex(index >= 0 ? index : -1);
  }, [location.pathname]);

  // Resize awareness
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
    <nav className="fixed top-2 left-0 right-0 z-50 w-full font-poppins">
      <div className="flex  justify-between w-full px-6">
        {/* Brand */}
        <NavLink
          to="/"
          className={`sm:block font-bold text-xl mt-2 items-center gap-2 transition-colors ${
            location.pathname === '/'
              ? 'text-darkGreen'
              : 'text-darkGreen/80 hover:text-darkGreen'
          }`}
        >
          <FontAwesomeIcon icon={faWallet} />
          Navora
        </NavLink>


        {/* Center pill nav (desktop) */}
        {/* Unified pill nav (desktop) */}
{!['/login', '/signup'].includes(location.pathname) && (
  <div className="hidden lg:flex gap-2 absolute mt-0 left-1/2 -translate-x-1/2 bg-black/85  rounded-full  px-1 py-1">
    <div className="flex relative items-center gap-6">
      {/* Animated highlight */}
      <span
        className={`absolute top-0 bottom-0 bg-pine/65 rounded-full transition-[left,width,opacity] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          bgStyle.visible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ left: bgStyle.left, width: bgStyle.width }}
      />

      {/* Brand inside pill */}
    

      {/* Nav items */}
      {navItems.map((item, index) => (
        <NavLink
          key={item.path}
          to={item.path}
          ref={el => (navRefs.current[index] = el)}
          className={`relative z-10 flex text-sm font-medium items-center gap-2 px-4 py-2 rounded-full transition-colors duration-300 ${
            activeIndex === index
              ? 'text-white/90 hover:text-white'
              : 'text-gray-300/85 hover:text-white'
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
  </div>
)}

 {/* Auth buttons inside pill */}
      {!['/login', '/signup'].includes(location.pathname) && (<div className="hidden lg:flex items-center  justify-center gap-1.5 ml-3 pl-5 font-poppins">
        <NavLink
          to="/login"
          className={`flex items-center font-medium gap-2 px-3 py-2 rounded-full text-darkGreen hover:bg-forest/50 ${!['/map'].includes(location.pathname) ? "bg:bg-forest/50 " : ""} transition-colors duration-300`}
        >
          Log In
        </NavLink>
        <NavLink
          to="/signup"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full mr-1 bg-forest/90 text-white hover:bg-pine/90 transition-colors duration-300"
        >
          Sign Up
        </NavLink>
      </div>)}


       

        {/* Mobile Toggle */}
        {isMobile && (
          <button
            onClick={() => setIsMobileOpen(prev => !prev)}
            className="lg:hidden bg-darkGreen text-white p-2 rounded-full cursor-pointer hover:bg-[#1a5547] transition-colors"
          >
            <FontAwesomeIcon icon={isMobileOpen ? faXmark : faBars} size="lg" />
          </button>
        )}
      </div>

      {/* Mobile dropdown */}
      {isMobile && (
        <div
          className={`absolute top-full left-1/2 -translate-x-1/2 z-10 bg-gray-900/95 backdrop-blur-md border mt-2 border-gray-700 rounded-4xl shadow-md overflow-hidden transition-all duration-500 ease-in-out ${
            isMobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ width: '70%' }}
        >
          <div className="flex flex-col gap-4 py-4 px-3">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`px-6 py-2 rounded-full text-center transition-colors duration-300 ${
                  location.pathname === item.path
                    ? 'text-white bg-mint/20 font-medium'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {item.label}
              </NavLink>
            ))}

            <NavLink
              to="/login"
              onClick={() => setIsMobileOpen(false)}
              className="px-6 py-2 rounded-full text-center border-2 border-forest text-white hover:bg-pine/20 hover:text-white transition-colors duration-300"
            >
              Log In
            </NavLink>
            <NavLink
              to="/signup"
              onClick={() => setIsMobileOpen(false)}
              className="px-6 py-2 rounded-full text-center bg-forest text-white border-2 border-forest hover:bg-pine/80 transition-colors duration-300"
            >
              Sign Up
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
