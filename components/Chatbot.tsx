"use client";
import { FC, useEffect, useRef, useState } from "react";
import {
  PaperClipIcon,
  PhotoIcon,
  MicrophoneIcon,
  ArrowUpCircleIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";
import Picker from "emoji-picker-react";

interface Message {
  from: "user" | "bot";
  text: string;
  timestamp: string;
  suggestions?: { intent: string; text: string; visible?: boolean }[];
}

interface ChatbotProps {
  visible: boolean;
  onClose: () => void;
}

const Chatbot: FC<ChatbotProps> = ({ visible, onClose }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [showGifPopup, setShowGifPopup] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderMessage = (text: string) => {
    let processed = text.replace(
      /(https?:\/\/[^\s]+)/g,
      (url) =>
        `<a href="${url}" class="text-blue-600 underline" target="_blank" rel="noopener noreferrer">${url}</a>`
    );
    processed = processed.replace(
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
      (email) =>
        `<a href="mailto:${email}" class="text-blue-600 underline">${email}</a>`
    );
    return processed;
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleSuggestionClick = async (msgIndex: number, intent: string) => {
    // ✅ Hide all suggestions for this bot message
    setMessages((prev) =>
      prev.map((m, i) =>
        i === msgIndex
          ? {
              ...m,
              suggestions: m.suggestions?.map((s) => ({ ...s, visible: false })),
            }
          : m
      )
    );

    const now = new Date().toISOString();
    setMessages((prev) => [...prev, { from: "user", text: intent, timestamp: now }]);
    setTyping(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: intent }),
      });
      const data = await response.json();
      const botResponse = data?.response || "[No response]";
      const botSuggestions = data?.suggestions || [];
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: botResponse, timestamp: new Date().toISOString(), suggestions: botSuggestions.map(s => ({ ...s, visible: true })) },
      ]);
      scrollToBottom();
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "[Error connecting to backend]", timestamp: new Date().toISOString() },
      ]);
      scrollToBottom();
    } finally {
      setTyping(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const now = new Date().toISOString();
    const userMessage = input;
    setMessages((prev) => [...prev, { from: "user", text: userMessage, timestamp: now }]);
    setInput("");
    scrollToBottom();

    setTyping(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      const botResponse = data?.response || "[No response]";
      const botSuggestions = data?.suggestions || [];
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: botResponse, timestamp: new Date().toISOString(), suggestions: botSuggestions.map(s => ({ ...s, visible: true })) },
      ]);
      scrollToBottom();
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "[Error connecting to backend]", timestamp: new Date().toISOString() },
      ]);
      scrollToBottom();
    } finally {
      setTyping(false);
    }
  };

  useEffect(() => {
    if (visible && !initialized) {
      setShowTyping(true);
      setTimeout(() => {
        setMessages([
          {
            from: "bot",
            text: `👋 Hi there, I'm <strong>LIHANA</strong> — your AI Assistant. Ask me anything, and I'll help you find the answer.`,
            timestamp: new Date().toISOString(),
          },
        ]);
        setShowTyping(false);
        setInitialized(true);
        scrollToBottom();
      }, 1500);
    }
  }, [visible, initialized]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  if (!visible) return null;

  return (
    <div
      className={`fixed bg-white shadow-2xl flex flex-col z-50 transform transition-transform duration-500 ease-out
        ${isMobile
          ? "inset-0 w-full h-full rounded-none"
          : "top-16 right-8 w-[500px] h-[85vh] rounded-2xl"} 
        ${visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
    >
      {/* Header */}
      <div className="p-3 bg-gradient-to-r from-cyan-600 via-blue-700 to-purple-700 text-white font-bold flex justify-between items-center rounded-t-2xl">
        <span>ASK LIHANA</span>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 text-xl leading-none"
        >
          &times;
        </button>
      </div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-xs leading-snug"
      >
        {messages.map((msg, index) => (
          <div key={index} className="flex items-start gap-3 flex-col">
            <div className="flex gap-3 items-start">
              <img
                src={msg.from === "user" ? "/user.png" : "/bot.png"}
                className="w-10 h-10 object-cover border rounded-full"
                alt="avatar"
              />
              <div>
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs shadow-sm ${
                    msg.from === "bot" ? "bg-gray-100" : "bg-blue-600 text-white"
                  }`}
                >
                  {msg.from === "bot" ? (
                    <div dangerouslySetInnerHTML={{ __html: renderMessage(msg.text) }} />
                  ) : (
                    <div>{msg.text}</div>
                  )}
                </div>

                {/* Animated Suggestion Chips */}
                {msg.from === "bot" && msg.suggestions?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.suggestions.map(
                      (s, i) =>
                        s.visible !== false && (
                          <button
                            key={i}
                            onClick={() => handleSuggestionClick(index, s.intent)}
                            className="suggestion-chip animate-fade-slide"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          >
                            {s.text}
                          </button>
                        )
                    )}
                  </div>
                )}

                <div className="text-gray-400 mt-1">{formatTimestamp(msg.timestamp)}</div>
              </div>
            </div>
          </div>
        ))}

        {(typing || showTyping) && (
          <div className="text-gray-400 italic flex items-center gap-1">
            LIHANA is typing
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounceDelay1"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounceDelay2"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounceDelay3"></span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t flex flex-col gap-2 relative">
        <div className="w-full bg-gray-100 rounded-xl px-3 py-3 flex flex-col gap-1 relative">
          <div className="flex items-center gap-2 relative w-full">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-transparent outline-none placeholder-gray-500 pr-10"
              placeholder="Ask a question..."
            />

            <button
              className="absolute right-10 w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition"
              title="Voice"
              onClick={() => alert("Voice input coming soon!")}
            >
              <MicrophoneIcon className="w-4 h-4 text-gray-700" />
            </button>

            <button
              onClick={sendMessage}
              className="w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-full transition"
              title="Send"
            >
              <ArrowUpCircleIcon className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <button
              className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded-full transition"
              title="Emoji"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            >
              <FaceSmileIcon className="w-5 h-5 text-gray-700" />
            </button>

            <input
              type="file"
              id="attachmentInput"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setMessages((prev) => [
                    ...prev,
                    { from: "user", text: `📎 ${file.name}`, timestamp: new Date().toISOString() },
                  ]);
                }
              }}
            />
            <button
              className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded-full transition"
              title="Attachment"
              onClick={() => document.getElementById("attachmentInput")?.click()}
            >
              <PaperClipIcon className="w-5 h-5 text-gray-700" />
            </button>

            <button
              className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded-full transition"
              title="GIF"
              onClick={() => setShowGifPopup((prev) => !prev)}
            >
              <PhotoIcon className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute bottom-14 left-3 z-50">
              <Picker
                onEmojiClick={(emojiObject) => {
                  setInput((prev) => prev + emojiObject.emoji);
                  setShowEmojiPicker(false);
                }}
                width={300}
                height={400}
                searchDisabled={false}
                skinTonePalette={true}
              />
            </div>
          )}
        </div>

        <div className="w-full mt-2 px-3 py-2 text-xs text-gray-500 bg-gray-50 rounded text-left font-sans leading-snug shadow-inner">
          <strong>Privacy Policy:</strong>
          <br />
          We value your privacy and keep all your chat data safe and secure.
          <br />
          Your messages are only used to help us improve the chatbot experience.
          <br />
          Please avoid sharing sensitive personal information here.
        </div>
      </div>

      <style jsx>{`
        .suggestion-chip {
          background: linear-gradient(90deg, #e0f2fe, #f5f3ff);
          color: #1e3a8a;
          font-weight: 500;
          font-size: 0.8rem;
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        .suggestion-chip:hover {
          background: linear-gradient(90deg, #dbeafe, #ede9fe);
          transform: translateY(-2px);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
        }
        @keyframes fadeSlideIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-slide {
          animation: fadeSlideIn 0.35s ease forwards;
        }
        @keyframes fadeSlideOut {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        .animate-fade-slide-out {
          animation: fadeSlideOut 0.25s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
