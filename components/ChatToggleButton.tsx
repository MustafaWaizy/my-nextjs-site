"use client";
import { FC, useEffect, useState } from "react";

interface ChatToggleButtonProps {
  onToggle: () => void;
}

const ChatToggleButton: FC<ChatToggleButtonProps> = ({ onToggle }) => {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Detect mobile/tablet screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 flex flex-col items-center cursor-pointer z-50
                  transition-all duration-700 ease-out
                  ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      onClick={onToggle}
    >
      {/* ====== Mobile Version (icon only) ====== */}
      {isMobile ? (
        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-indigo-900 opacity-30 blur-lg animate-pulseGlow"></span>
          <img
            src="/chat-sticker.png" 
            alt="Chat"
            className="relative w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
          />
        </div>
      ) : (
        /* ====== Desktop Version (unchanged) ====== */
        <>
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-indigo-900 opacity-30 blur-xl animate-pulseGlow"></span>
            <img
              src="/chat-sticker.png"
              alt="Chat Sticker"
              className="relative w-20 h-20 rounded-full shadow-xl hover:scale-110 transition-transform duration-300"
            />
          </div>

          <span className="mt-2 text-center text-sm font-semibold text-gray-800 bg-white px-3 py-1 rounded-full shadow-md
                           hover:shadow-lg transition-all duration-300">
            QUESTIONS? ASK LIHANA
          </span>
        </>
      )}
    </div>
  );
};

export default ChatToggleButton;
