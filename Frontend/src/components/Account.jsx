import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export const Account = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  // Refs for scrolling inside account sections
  const profileRef = useRef(null);
  const securityRef = useRef(null);
  const notificationsRef = useRef(null);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300); // wait for fade-out
  };

  const scrollToSection = (sectionRef) => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-30 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Dim background */}
      <div
        className="absolute inset-0 bg-white/1  transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Account panel */}
      <div
        className={`relative bg-white rounded-3xl w-2xl h-3xl md:w-4xl md:h-5xl overflow-hidden z-40 transition-all duration-300 ease-out ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 rounded-full px-1.5 py-1 cursor-pointer hover:text-gray-800 transition-colors hover:bg-gray-200 active:bg-gray-300"
        >
          <FontAwesomeIcon icon={faXmark} size="md" />
        </button>

        <div className="flex h-full">
          {/* Sidebar */}
          <aside className="w-1/3 bg-gray-50 border-r border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Account</h2>
            <ul className="space-y-4">
              {[
                { name: "Profile", ref: profileRef },
                { name: "Security", ref: securityRef },
                { name: "Notifications", ref: notificationsRef },
              ].map((item) => (
                <li
                  key={item.name}
                  onClick={() => scrollToSection(item.ref)}
                  className="text-gray-400 font-medium active:text-indigo-600 hover:bg-gray-200 rounded-xl px-2 py-1 cursor-pointer transition"
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-8 overflow-y-auto space-y-8">
            {/* === Profile === */}
            <section ref={profileRef}>
              <h3 className="text-lg font-semibold mb-3">Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700/85 mb-1">Username</label>
                  <input
                    type="text"
                    placeholder="JohnDoe"
                    className="w-full border border-gray-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700/85 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="johndoe@example.com"
                    className="w-full border border-gray-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
                  />
                </div>
              </div>
            </section>

            {/* === Security === */}
            <section ref={securityRef}>
              <h3 className="text-lg font-semibold mb-3">Security</h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700/85 mb-1">Change Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700/85 mb-1">Two-Factor Authentication</label>
                  <button className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-xl cursor-pointer hover:bg-indigo-700 transition-colors">
                    Enable 2FA
                  </button>
                </div>
              </div>
            </section>

            {/* === Notifications === */}
            <section ref={notificationsRef}>
              <h3 className="text-lg font-semibold mb-3">Notifications</h3>
              <div className=" flex items-center justify-between">
                {/* Email Notification Toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={emailNotifications}
                    onChange={() => setEmailNotifications(!emailNotifications)}
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors ${
                      emailNotifications ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                  />
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      emailNotifications ? "translate-x-5" : ""
                    }`}
                  />
                  <span className="ml-3 text-gray-700 select-none">Email Notifications</span>
                </label>

                {/* Push Notification Toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={pushNotifications}
                    onChange={() => setPushNotifications(!pushNotifications)}
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors ${
                      pushNotifications ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                  />
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      pushNotifications ? "translate-x-5" : ""
                    }`}
                  />
                  <span className="ml-3 text-gray-700 select-none">Push Notifications</span>
                </label>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};
