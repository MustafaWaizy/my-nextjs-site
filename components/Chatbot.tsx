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
  suggestions?: { intent: string; text: string }[];
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

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

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
      (email) => `<a href="mailto:${email}" class="text-blue-600 underline">${email}</a>`
    );
    return processed;
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleSuggestionClick = async (intent: string) => {
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
        { from: "bot", text: botResponse, timestamp: new Date().toISOString(), suggestions: botSuggestions },
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
        { from: "bot", text: botResponse, timestamp: new Date().toISOString(), suggestions: botSuggestions },
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
            text: `Hi there, I'm LIHANA the Chatbot. I'm here to answer questions. Just ask me your question in simple sentence form.`,
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

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
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
      className={`fixed top-4 md:top-16 right-2 md:right-8 w-[95%] md:w-[500px] min-w-[95%] md:min-w-[500px] max-w-[500px] h-[90vh] md:h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50
              transform transition-transform duration-500 ease-out
              ${visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
    >
      {/* Header */}
      <div className="p-3 bg-blue-600 text-white font-bold flex justify-between items-center rounded-t-2xl text-sm md:text-base">
        <span>ASK LIHANA</span>
        <button onClick={onClose} className="text-white hover:text-gray-300 text-xl leading-none">
          &times;
        </button>
      </div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-2 md:p-4 space-y-2 md:space-y-3 font-sans text-xs md:text-sm leading-snug"
      >
        {messages.map((msg, index) => (
          <div key={index} className="flex items-start gap-2 md:gap-3 flex-col">
            <div className="flex gap-2 md:gap-3 items-start">
              <img
                src={msg.from === "user" ? "/user.png" : "/bot.png"}
                className="w-8 h-8 md:w-10 md:h-10 object-cover border rounded-full"
                alt="avatar"
              />
              <div>
                <div
                  className={`px-3 py-2 md:px-4 md:py-2.5 rounded-2xl max-w-[70%] md:max-w-xs shadow-sm ${
                    msg.from === "bot" ? "bg-gray-100" : "bg-blue-600 text-white"
                  }`}
                >
                  {msg.from === "bot" ? (
                    <div dangerouslySetInnerHTML={{ __html: renderMessage(msg.text) }} />
                  ) : (
                    <div>{msg.text}</div>
                  )}
                </div>
                <div className="text-gray-400 mt-1 text-[10px] md:text-xs">{formatTimestamp(msg.timestamp)}</div>
              </div>
            </div>

            {/* Suggestions */}
            {msg.from === "bot" && msg.suggestions?.length > 0 && index === messages.length - 1 && (
              <div className="pl-10 md:pl-14 flex flex-col gap-1 md:gap-2">
                <div className="text-blue-700 font-semibold text-xs md:text-sm">Did you mean one of the following?</div>
                {msg.suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s.intent)}
                    className="px-2 py-1 md:px-3 md:py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition text-left text-[10px] md:text-sm"
                  >
                    {s.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {(typing || showTyping) && (
          <div className="text-gray-400 italic flex items-center gap-1 text-[10px] md:text-sm">
            LIHANA is typing
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounceDelay1"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounceDelay2"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounceDelay3"></span>
          </div>
        )}
      </div>

      {/* Input + icons */}
      <div className="p-2 md:p-3 border-t flex flex-col gap-1 md:gap-2 relative">
        <div className="w-full bg-gray-100 rounded-xl px-2 py-2 md:px-3 md:py-3 flex flex-col gap-1 md:gap-1.5 relative">
          <div className="flex items-center gap-1 md:gap-2 relative w-full">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-transparent outline-none placeholder-gray-500 text-xs md:text-sm pr-10"
              placeholder="Ask a question..."
            />

            {/* Voice button */}
            <button
              className="absolute right-10 md:right-12 w-6 h-6 md:w-8 md:h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition"
              title="Voice"
              onClick={() => alert("Voice input coming soon!")}
            >
              <MicrophoneIcon className="w-3 h-3 md:w-4 md:h-4 text-gray-700" />
            </button>

            {/* Send button */}
            <button
              onClick={sendMessage}
              className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-full transition"
              title="Send"
            >
              <ArrowUpCircleIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>
          </div>

          {/* Icons row */}
          <div className="flex items-center gap-1 md:gap-2 mt-1">
            <button
              className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center hover:bg-gray-200 rounded-full transition"
              title="Emoji"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            >
              <FaceSmileIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
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
              className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center hover:bg-gray-200 rounded-full transition"
              title="Attachment"
              onClick={() => document.getElementById("attachmentInput")?.click()}
            >
              <PaperClipIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            </button>

            <button
              className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center hover:bg-gray-200 rounded-full transition"
              title="GIF"
              onClick={() => setShowGifPopup((prev) => !prev)}
            >
              <PhotoIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            </button>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute bottom-14 left-2 md:left-3 z-50">
              <Picker
                onEmojiClick={(emojiObject) => {
                  setInput((prev) => prev + emojiObject.emoji);
                  setShowEmojiPicker(false);
                }}
                width={250}
                height={350}
                searchDisabled={false}
              />
            </div>
          )}
        </div>

        {/* Privacy Policy */}
        <div className="w-full mt-2 px-2 md:px-3 py-2 text-[9px] md:text-xs text-gray-500 bg-gray-50 rounded text-left font-sans leading-snug shadow-inner">
          <strong>Privacy Policy:</strong><br />
          We value your privacy and keep all your chat data safe and secure.<br />
          Your messages are only used to help us improve the chatbot experience.<br />
          Please avoid sharing sensitive personal information here.
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
