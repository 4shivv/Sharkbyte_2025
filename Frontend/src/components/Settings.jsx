import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDisplay,
  faXmark,
  faChevronDown,
  faCircleHalfStroke,
  faMoon,
  faCircleDot,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";

export const Settings = ({ onClose }) => {
  const [theme, setTheme] = useState("light");
  const [accent, setAccent] = useState("#4f46e5");
  const [textSize, setTextSize] = useState("medium");
  const [notifications, setNotifications] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const dropdownRef = useRef(null);

  // Refs for smooth scrolling
  const generalRef = useRef(null);
  const appearanceRef = useRef(null);
  const notificationsRef = useRef(null);
  const privacyRef = useRef(null);

  const themes = [
    { id: "light", name: "Light Mode", icon: faCircle },
    { id: "dark", name: "Dark Mode", icon: faCircleDot },
    { id: "system", name: "System", icon: faCircleHalfStroke },
  ];

  const textSizes = [
    { id: "small", name: "Small" },
    { id: "medium", name: "Medium (default)" },
    { id: "large", name: "Large" },
    { id: "xlarge", name: "Extra Large" },
  ];

  const accents = ["#000000", "#ef4444", "#10b981", "#3b82f6", "#8b5cf6"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const scrollToSection = (sectionRef) => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-3xl z-40">
      {/* Dim overlay */}
      <div
        className="absolute inset-0 bg-black/20 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Settings container */}
      <div
        className={`relative  bg-gray-50/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200 transition-all duration-300 
        w-[90%] max-w-[780px] h-[85%] md:h-[600px] flex flex-col md:flex-row overflow-hidden 
        ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 rounded-full px-2 py-1.5 cursor-pointer hover:text-gray-800 hover:bg-gray-200 transition"
        >
          <FontAwesomeIcon icon={faXmark} size="md" />
        </button>

        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-1/3 bg-white backdrop-blur-sm border-r border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6">Settings</h2>
          <ul className="space-y-4">
            {[
              { name: "General", ref: generalRef },
              { name: "Appearance", ref: appearanceRef },
              { name: "Notifications", ref: notificationsRef },
              { name: "Privacy", ref: privacyRef },
            ].map((item) => (
              <li
                key={item.name}
                onClick={() => scrollToSection(item.ref)}
                className="text-gray-400 font-medium hover:text-indigo-600 hover:bg-gray-100 rounded-xl px-3 py-2 cursor-pointer transition"
              >
                {item.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-5 md:p-8 overflow-y-auto space-y-8 bg-gray-50">
          {/* General */}
          <section ref={generalRef}>
            <h3 className="text-lg font-semibold mb-3">General</h3>
            <p className="text-gray-600 text-sm">
              Basic settings for your account and preferences.
            </p>
          </section>

          {/* Appearance */}
          <section ref={appearanceRef} className="space-y-6">
            <h3 className="text-lg font-semibold mb-3">Appearance</h3>

            {/* Theme */}
            <div>
              <h4 className="font-medium mb-2 text-gray-800">Theme</h4>
              <div className="flex flex-wrap justify-between gap-3">
                {themes.map((t) => (
                  <label
                    key={t.id}
                    className={`cursor-pointer flex flex-col justify-between gap-3 items-center border-2 rounded-xl p-4 flex-1 min-w-[90px] text-center transition ${
                      theme === t.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="theme"
                      value={t.id}
                      checked={theme === t.id}
                      onChange={() => setTheme(t.id)}
                      className="hidden"
                    />
                    <FontAwesomeIcon icon={t.icon} size="lg" />
                    {t.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Accent */}
            <div>
              <h4 className="font-medium mb-2 text-gray-800">Accent Color</h4>
              <div className="flex gap-3 flex-wrap">
                {accents.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-4 cursor-pointer transition-colors ${
                      accent === color ? "border-gray-700" : "border-gray-200"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setAccent(color)}
                  />
                ))}
              </div>
            </div>

            {/* Text Size */}
            <div ref={dropdownRef}>
              <h4 className="font-medium mb-2 text-gray-800">Text Size</h4>
              <div className="relative w-full max-w-xs">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex justify-between items-center border border-gray-300 bg-white rounded-xl cursor-pointer px-4 py-1.5 text-gray-700 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
                >
                  <span>
                    {textSizes.find((t) => t.id === textSize)?.name}
                  </span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <ul className="absolute z-20 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                    {textSizes.map((option) => (
                      <li
                        key={option.id}
                        className={`px-4 py-2 cursor-pointer transition-colors ${
                          textSize === option.id
                            ? "bg-indigo-50 text-indigo-600"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          setTextSize(option.id);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {option.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section ref={notificationsRef}>
            <h3 className="text-lg font-semibold mb-3">Notifications</h3>
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  className="sr-only"
                />
                <div
                  className={`w-11 h-6 rounded-full transition ${
                    notifications ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                />
                <div
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    notifications ? "translate-x-5" : ""
                  }`}
                />
              </label>
              <span className="text-gray-600">
                {notifications ? "Enabled" : "Disabled"}
              </span>
            </div>
          </section>

          {/* Privacy */}
          <section ref={privacyRef}>
            <h3 className="text-lg font-semibold mb-3">Privacy</h3>
            <p className="text-gray-600 text-sm">
              Manage your account visibility and data preferences.
            </p>
            <button className="mt-3 px-4 py-2 bg-red-500 cursor-pointer text-white rounded-lg hover:bg-red-600">
              Delete Account
            </button>
          </section>
        </main>
      </div>
    </div>
  );
};
