import React, { useState, useEffect, useContext, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faDiagramProject, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { ScreenContext } from '../Layouts/RootLayout';
import { useAuth } from '../contexts/AuthContext';

const NavBar = () => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Project', path: '/newproject' },
    { label: 'History', path: '/history' },
  ];

  const { isMobile } = useContext(ScreenContext);
  const { isAuthenticated, logout, user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
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
      {!['/login', '/signup', '/new-project'].includes(location.pathname) && (
        <nav className={`fixed top-0 left-0 right-0 z-50 flex justify-center backdrop-blur-md ${!isMobile ? "bg-black/80" : "bg-[#1B1B1B]"} border-b-[0.2px] border-gray-200 font-inter `}>
          <div className="flex items-center justify-between w-full max-w-7xl px-6 py-2.5">
            {/* Brand */}
            <NavLink
              to="/"
              className="flex items-center gap-2 text-gray-50 hover:text-white transition-all duration-300"
            >
              <FontAwesomeIcon icon={faShieldHalved} className="text-white" />
              <span className="font-semibold text-[15px] tracking-tight">AgentGuard</span>
            </NavLink>

            {/* Desktop Nav */}
            {!isMobile && (
              <div className="relative flex items-center gap-8">
                {/* Highlight */}
                

                {navItems.map((item, index) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    ref={el => (navRefs.current[index] = el)}
                    className={`relative z-10 text-[12px] tracking-tight font-light text-gray-50 hover:text-white transition-all duration-300 ${
                      activeIndex === index ? 'text-white font-normal' : ''
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

            {/* Right Side Buttons */}
            {!isMobile && (
              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] font-light text-gray-300">
                      {user?.email}
                    </span>
                    <button
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                      className="text-[14px] font-light text-gray-50 hover:text-white transition-all duration-300"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className="text-[14px] font-light text-gray-50 hover:text-white transition-all duration-300"
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/signup"
                      className="text-[14px] font-light text-gray-50 hover:text-white transition-all duration-300"
                    >
                      Sign up
                    </NavLink>
                  </>
                )}
              </div>
            )}

            {/* Mobile Toggle */}
            {isMobile && (
              <button
                onClick={() => setIsMobileOpen(prev => !prev)}
                className="ml-auto p-2 rounded-full hover:bg-black/30 text-white transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={isMobileOpen ? faXmark : faBars} size="lg" />
              </button>
            )}
          </div>

          {/* Mobile Menu */}
          {isMobile && (
            <div
              className={`absolute top-full left-0 right-0 bg-[#1B1B1B] backdrop-blur-sm  overflow-hidden transition-all duration-600 ease-in-out ${
                isMobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="flex flex-col ml-10 gap-4 py-4">
                {navItems.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`text-[25px] font-semibold text-gray-200 hover:text-white transition-all ${
                      location.pathname === item.path ? 'font-medium text-black' : ''
                    }`}
                  >
                    {item.label}
                  </NavLink>
                ))}
                <div className="h-px bg-gray-200 w-3/4" />
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-[18px] font-normal text-gray-300">
                      {user?.email}
                    </span>
                    <button
                      onClick={() => {
                        logout();
                        navigate('/');
                        setIsMobileOpen(false);
                      }}
                      className="text-left text-[25px] font-semibold text-gray-100 hover:text-white"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      onClick={() => setIsMobileOpen(false)}
                      className="text-[25px] font-semibold text-gray-100 hover:text-white"
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/signup"
                      onClick={() => setIsMobileOpen(false)}
                      className="text-[25px] font-semibold text-gray-100 hover:text-white"
                    >
                      Sign up
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      )}
    </>
  );
};

export default NavBar;
