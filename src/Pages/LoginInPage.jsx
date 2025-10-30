import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faLocationArrow,
  faHandPointer,
  faICursor,
  faChartPie,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";

const LoginInPage = () => {
  const [emailActive, setEmailActive] = useState(false);
  const [passwordActive, setPasswordActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const navRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(
    window.location.pathname === "/signup" ? 1 : 0
  );
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
    if (navRefs.current[activeIndex]) moveHighlightTo(navRefs.current[activeIndex]);
    else setBgStyle((p) => ({ ...p, visible: false }));
  }, [activeIndex]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoggedIn(true);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-[#f8f6f4] text-gray-900 font-inter">
      
      {/* === Subtle Animated Background Grid === */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:60px_60px] opacity-40 animate-[gridMove_25s_linear_infinite]" />

      {/* === Decorative Floating Icons === */}
      <FontAwesomeIcon
        icon={faChartPie}
        className="absolute top-20 right-16 text-gray-300 text-5xl animate-[float_6s_ease-in-out_infinite]"
      />
      <FontAwesomeIcon
        icon={faSquare}
        className="absolute bottom-28 left-20 text-gray-300 text-4xl animate-[rotateSquare_20s_linear_infinite]"
      />

      {/* === Floating Cursor Labels === */}
      <div className="absolute top-40 left-10 flex flex-col items-end gap-1 animate-[float_4s_ease-in-out_infinite]">
        <FontAwesomeIcon icon={faHandPointer} className="text-[#ffc9c9] text-2xl" />
        <div className="px-3 py-1 text-sm font-medium text-[#5C1F1F] bg-[#ffc9c9] rounded-full shadow-sm">
          Alex
        </div>
      </div>

      <div className="absolute bottom-14 right-10 flex flex-col items-center gap-1 animate-[float_7s_ease-in-out_infinite_1s]">
        <FontAwesomeIcon
          icon={faLocationArrow}
          className="text-[#d6e6ff] text-2xl rotate-[-45deg]"
        />
        <div className="px-3 py-1 text-sm font-medium text-gray-700 bg-[#eaf2ff] rounded-full shadow-sm">
          Maya
        </div>
      </div>

      <div className="absolute top-1/4 right-24 flex flex-col items-end gap-1 animate-[float_8s_ease-in-out_infinite_2s]">
        <FontAwesomeIcon icon={faICursor} className="text-[#e3d8ff] text-2xl" />
        <div className="px-3 py-1 text-sm font-medium text-[#2E2172] bg-[#efe9ff] rounded-full shadow-sm">
          Leo
        </div>
      </div>

      {/* === Top Navigation (Login / Sign Up) === */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="relative flex items-center gap-4 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm shadow-black/5 backdrop-blur-md">
          {/* Highlight Animation */}
          <span
            className={`absolute top-[5px] bottom-[5px] rounded-full bg-gray-900/10 transition-[left,width,opacity] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              bgStyle.visible ? "opacity-100" : "opacity-0"
            }`}
            style={{ left: bgStyle.left, width: bgStyle.width }}
          />
          {["/login", "/signup"].map((path, index) => (
            <NavLink
              key={path}
              to={path}
              ref={(el) => (navRefs.current[index] = el)}
              onMouseEnter={() => moveHighlightTo(navRefs.current[index])}
              onMouseLeave={() => moveHighlightTo(navRefs.current[activeIndex])}
              onClick={() => setActiveIndex(index)}
              className={({ isActive }) =>
                `relative z-10 px-5 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  isActive ? "text-black" : "text-gray-700 hover:text-black"
                }`
              }
            >
              {index === 0 ? "Log in" : "Sign up"}
            </NavLink>
          ))}
        </div>
      </div>

      {/* === Login Card === */}
      <div className="relative z-20 w-[90%] max-w-md p-10 bg-gray-100/50  border border-gray-200 rounded-2xl shadow-xs backdrop-blur-lg text-center animate-[fadeInUp_1s_ease-out]">
        <h1 className="mb-1 text-[2rem] font-semibold">
          {loggedIn ? "Welcome back! 🎉" : "Welcome back"}
        </h1>
        <p className="mb-10 text-sm text-gray-500">
          {loggedIn
            ? "Redirecting to your workspace..."
            : "Access your boards, notes, and chats"}
        </p>

        {!loggedIn && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
            
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block mb-1.5 text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                onFocus={() => setEmailActive(true)}
                onBlur={() => setEmailActive(false)}
                className={`w-full px-4 py-2 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                  emailActive
                    ? "border-gray-800 ring-gray-200"
                    : "border-gray-300 hover:border-gray-400"
                } bg-transparent text-gray-900 placeholder-gray-500`}
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block mb-1.5 text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                onFocus={() => setPasswordActive(true)}
                onBlur={() => setPasswordActive(false)}
                className={`w-full px-4 py-2 pr-12 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                  passwordActive
                    ? "border-gray-800 ring-gray-200"
                    : "border-gray-300 hover:border-gray-400"
                } bg-transparent text-gray-900 placeholder-gray-500`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition-all"
                tabIndex={-1}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-2 py-2 cursor-pointer rounded-full bg-[#1a1a1a] text-white font-medium hover:bg-black active:scale-[0.98] transition-all duration-300"
            >
              Log In
            </button>

            {/* Sign Up Redirect */}
            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-600">
              <span>Don’t have an account?</span>
              <NavLink
                to="/signup"
                onClick={() => setActiveIndex(1)}
                className="font-medium text-gray-900 hover:underline"
              >
                Sign up
              </NavLink>
            </div>
          </form>
        )}
      </div>

      {/* === Animations === */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }
        @keyframes rotateSquare {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LoginInPage;
