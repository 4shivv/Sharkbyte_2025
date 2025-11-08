import { faArrowUp, faComment, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Settings } from "./Settings";

export const SideBar = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved
      ? JSON.parse(saved)
      : [
          { text: "Hey, did you finish the wireframe?", sender: "A", fromSelf: false },
          { text: "Almost! I’m updating the sticky note layout.", sender: "L", fromSelf: true },
          { text: "Nice — send it over when ready.", sender: "S", fromSelf: false },
        ];
  });

  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { text: newMessage, sender: "L", fromSelf: true }]);
    setNewMessage("");
  };

  return (
    <>
      <div
        className={`fixed right-5 z-10 shadow backdrop-blur-sm overflow-hidden transition-all duration-500 ease-in-out bg-[#100C08] text-white font-inter text-xs tracking-wider`}
        style={{
          top: isOpen ? "7.5%" : "50%",
          transform: isOpen ? "translateY(0)" : "translateY(-50%)",
          width: isOpen ? "20rem" : "2.5rem",
          height: isOpen ? "90vh" : "2.5rem",
          borderRadius: isOpen ? "1.25rem" : "50%",
          overflow: "hidden",
        }}
      >
        {/* Collapsed icon */}
        {!isOpen && (
          <button
            onClick={onToggle}
            className="w-full h-full flex items-center justify-center text-white rounded-full bg-[#100C08] hover:bg-[#1b1d20] transition-colors duration-150 cursor-pointer"
          >
            <FontAwesomeIcon icon={faComment} size="lg" />
          </button>
        )}

        {/* Expanded Sidebar */}
        {isOpen && (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#1c1e20] bg-[#151313]">
              <span className="font-semibold font-inter text-[0.95rem] tracking-wide">
                Meeting Chat
              </span>
              <button
                onClick={onToggle}
                className="text-gray-400 cursor-pointer hover:text-white p-1 rounded-full hover:bg-[#2a2a2a] transition-all duration-150"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 flex flex-col overflow-y-auto px-4 py-3 space-y-4 scroll-smooth scrollbar-thin scrollbar-thumb-[#2a2a2a] scrollbar-track-transparent custom-scrollbar">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-1 animate-bounce-in"
                  style={{ alignItems: msg.fromSelf ? "flex-end" : "flex-start" }}
                >
                  <div
                    className={`${
                      msg.fromSelf
                        ? "bg-blue-600 text-white self-end"
                        : "bg-[#2b3037] text-gray-200 self-start"
                    } rounded-2xl px-3 py-2 text-[12px] leading-relaxed max-w-[80%] shadow-sm`}
                  >
                    {msg.text}
                  </div>
                  <div
                    className={`rounded-full flex items-center justify-center text-black text-xs px-2 py-0.5 font-semibold font-inter bg-gray-200 ${
                      msg.fromSelf ? "self-end" : "self-start"
                    }`}
                  >
                    {msg.sender}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 mt-auto bg-[#1a1b1d] border-t border-[#222426] flex items-center relative">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="w-full px-3 py-2 text-[11px] bg-[#222426] text-gray-200 rounded-full border border-[#3a3d42] focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500"
              />
              <FontAwesomeIcon
                icon={faArrowUp}
                onClick={handleSend}
                className="absolute right-4 bottom-[28%] cursor-pointer bg-blue-500 hover:bg-blue-700 text-white rounded-full px-2 py-1.5 transition-all duration-200 shadow-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bouncy Animation */}
      <style>{`
        @keyframes bounceIn {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounceIn 0.3s ease-out;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #2a2a2a;
          border-radius: 9999px;
        }
      `}</style>
    </>
  );
};
