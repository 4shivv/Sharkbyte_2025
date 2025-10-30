import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faGear,
  faUser,
  faCircleCheck,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Settings } from "./Settings"; // adjust path
import { Account } from "./Account"; // adjust path
import { Link } from "react-router-dom";

export const UtilityBar = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showSavedPopup, setShowSavedPopup] = useState(false);

  const handleSave = () => {
    // simulate saving logic here
    setShowSavedPopup(true);
    setTimeout(() => {
      setShowSavedPopup(false);
    }, 2000);
  };

  return (
    <>
      {/* Top Utility Bar */}
      <div className="fixed top-0 w-full h-[5.5%] z-20 bg-[#121416] text-white text-center flex justify-between items-center px-4 text-xs font-inter font-normal tracking-wider">
        {/* Left side: App name or board info */}
        <div className="flex items-center gap-1 whitespace-nowrap">
          <Link to={"/"}>
            <span className="font-semibold">Whiteboard Pro</span>
          </Link>
          <span className="opacity-70">| Board: Design Sprint 1</span>
        </div>

        {/* Center status */}
        <div className="flex-1 flex justify-center overflow-x-auto no-scrollbar px-2">
          <div className="opacity-80 whitespace-nowrap text-center">
            Auto-Saved • Shared with 3 collaborators
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 text-sm whitespace-nowrap">
          {/* Open Account Modal */}
          <FontAwesomeIcon
            icon={faUser}
            className="cursor-pointer"
            onClick={() => setShowAccount(true)}
          />

          {/* Open Settings Modal */}
          <FontAwesomeIcon
            icon={faGear}
            className="cursor-pointer hover:rotate-90 transition-transform"
            onClick={() => setShowSettings(true)}
          />

          <div className="w-[1px] h-5 bg-gray-400 mx-1 rounded-4xl" />

          <button className="rounded-lg px-2 py-1.5 text-xs cursor-pointer flex gap-1 items-center justify-center hover:bg-[#2a3a48]">
            <FontAwesomeIcon icon={faArrowUpFromBracket} />
            Share
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-700 rounded-lg px-2 py-1.5 text-xs cursor-pointer hover:bg-blue-900"
          >
            Save
          </button>
        </div>
      </div>

      {/* Save Popup */}
      {showSavedPopup && (
        <div className="fixed top-[6%] right-[47%] z-30 bg-[#100C08] text-white text-sm flex items-center justify-center gap-2 px-3 py-2 rounded-lg shadow-lg animate-fade-in-out">
          <FontAwesomeIcon icon={faCheck} className="bg-green-600 rounded-full px-0.5 py-1 text-xs" />
          <span>Saved</span>
        </div>
      )}

      {/* Settings Overlay */}
      {showSettings && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowSettings(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Settings onClose={() => setShowSettings(false)} />
          </div>
        </div>
      )}

      {/* Account Overlay */}
      {showAccount && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowAccount(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Account onClose={() => setShowAccount(false)} />
          </div>
        </div>
      )}

      {/* Fade animation (Tailwind custom) */}
      <style jsx>{`
        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
        .animate-fade-in-out {
          animation: fadeInOut 2s ease-in-out forwards;
        }
      `}</style>
    </>
  );
};
