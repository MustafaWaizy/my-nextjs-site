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
    <button
      type="button"
      aria-label="Open LIHANA support chat"
      className={`group fixed bottom-5 right-5 z-50 flex cursor-pointer items-center gap-2.5 rounded-full text-left outline-none transition-all duration-500 ease-out focus:ring-4 focus:ring-blue-500/30 md:bottom-6 md:right-6
                  ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      onClick={onToggle}
    >
      <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 p-0.5 shadow-lg shadow-blue-900/25 transition-transform duration-300 group-hover:scale-105 md:h-[60px] md:w-[60px]">
        <span className="absolute inset-0 rounded-full bg-blue-500/30 blur-lg animate-pulseGlow" />
        <img
          src="/chat-sticker.png"
          alt=""
          className="relative h-full w-full rounded-full border-2 border-white/90 object-cover"
        />
      </span>

      {!isMobile && (
        <span className="hidden rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-lg shadow-slate-900/10 transition-colors hover:text-blue-700 md:block">
          Chat with LIHANA
        </span>
      )}
    </button>
  );
};

export default ChatToggleButton;
