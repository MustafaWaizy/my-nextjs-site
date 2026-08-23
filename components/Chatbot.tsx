"use client";

import { FC, FormEvent, useEffect, useRef, useState } from "react";
import {
  PaperClipIcon,
  PhotoIcon,
  MicrophoneIcon,
  ArrowUpCircleIcon,
  FaceSmileIcon,
  XMarkIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import Picker from "emoji-picker-react";

interface Suggestion {
  intent: string;
  text: string;
}

interface Message {
  id: string;
  from: "user" | "bot";
  text: string;
  timestamp: string;
  suggestions?: Suggestion[];
}

interface ChatbotProps {
  visible: boolean;
  onClose: () => void;
}

const QUICK_QUESTIONS = [
  "What services does LinorAI offer?",
  "How can I contact LinorAI?",
  "What AI solutions does LinorAI provide?",
];

const INITIAL_GREETING: Message = {
  id: "initial-greeting",
  from: "bot",
  text:
    "Hi! I'm LIHANA, LinorAI's AI support assistant. I can help you learn about our services, AI solutions, IT support, web development, and how to contact our team.",
  timestamp: new Date().toISOString(),
};

const FALLBACK_REPLY =
  "I'm sorry, I couldn't process that right now. Please try again or contact the LinorAI team directly.";

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
  const inputRef = useRef<HTMLInputElement>(null);

  // ============================================================
  // BACKEND URL
  // ============================================================

  const BACKEND_URL = (() => {
    if (typeof window === "undefined") {
      return (
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "http://54.162.102.115"
      );
    }

    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://localhost:8000";
    }

    return (
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "http://54.162.102.115"
    );
  })();

  // ============================================================
  // TIMESTAMP
  // ============================================================

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ============================================================
  // MESSAGE RENDERING
  // ============================================================

  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const renderMessage = (text: string) => {
    let processed = escapeHtml(text);

    // URLs
    processed = processed.replace(
      /(https?:\/\/[^\s<]+)/g,
      (url) =>
        `<a href="${url}" class="text-blue-600 underline hover:text-blue-800 break-all" target="_blank" rel="noopener noreferrer">${url}</a>`
    );

    // Email addresses
    processed = processed.replace(
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
      (email) =>
        `<a href="mailto:${email}" class="text-blue-600 underline hover:text-blue-800">${email}</a>`
    );

    return processed;
  };

  // ============================================================
  // SCROLL ONLY THE CHAT CONTAINER
  // ============================================================

  const scrollToBottom = (smooth = true) => {
    const container = chatContainerRef.current;

    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    });
  };

  // ============================================================
  // SEND MESSAGE TO BACKEND
  // ============================================================

  const sendMessageToBackend = async (
    messageText: string,
    currentMessages: Message[]
  ) => {
    const history = currentMessages.slice(-12).map((message) => ({
      role: message.from === "bot" ? "assistant" : "user",
      content: message.text,
    }));

    const response = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messageText,
        history,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();

    return {
      response:
        typeof data?.response === "string"
          ? data.response
          : FALLBACK_REPLY,

      suggestions: Array.isArray(data?.suggestions)
        ? data.suggestions
        : [],
    };
  };

  // ============================================================
  // SEND USER MESSAGE
  // ============================================================

  const sendMessage = async (text?: string) => {
    const messageText = (text ?? input).trim();

    if (!messageText || typing) {
      return;
    }

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      from: "user",
      text: messageText,
      timestamp: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage];

    // Immediately show user message
    setMessages(nextMessages);

    // Clear input
    setInput("");

    // Close auxiliary UI
    setShowEmojiPicker(false);
    setShowGifPopup(false);

    // Show typing
    setTyping(true);

    // Scroll only chat panel
    scrollToBottom();

    try {
      const result = await sendMessageToBackend(
        messageText,
        nextMessages
      );

      const botMessage: Message = {
        id: `${Date.now()}-bot`,
        from: "bot",
        text: result.response,
        timestamp: new Date().toISOString(),
        suggestions: result.suggestions,
      };

      setMessages((prev) => [...prev, botMessage]);

      // Scroll after bot response
      setTimeout(() => {
        scrollToBottom();
      }, 50);
    } catch (error) {
      console.error("LIHANA backend error:", error);

      const errorMessage: Message = {
        id: `${Date.now()}-error`,
        from: "bot",
        text:
          "I'm having trouble connecting to the LIHANA service right now. Please try again in a moment or contact the LinorAI team directly.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);

      setTimeout(() => {
        scrollToBottom();
      }, 50);
    } finally {
      setTyping(false);

      // Return focus to input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  // ============================================================
  // QUICK QUESTION
  // ============================================================

  const handleQuickQuestion = async (question: string) => {
    await sendMessage(question);
  };

  // ============================================================
  // BACKEND SUGGESTION
  // ============================================================

  const handleSuggestionClick = async (intent: string) => {
    await sendMessage(intent);
  };

  // ============================================================
  // FORM SUBMIT
  // ============================================================

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    sendMessage();
  };

  // ============================================================
  // INITIAL GREETING
  // ============================================================

  useEffect(() => {
    if (!visible || initialized) {
      return;
    }

    setShowTyping(true);

    const timer = window.setTimeout(() => {
      setMessages([
        {
          ...INITIAL_GREETING,
          timestamp: new Date().toISOString(),
        },
      ]);

      setShowTyping(false);
      setInitialized(true);

      setTimeout(() => {
        scrollToBottom(false);
        inputRef.current?.focus();
      }, 50);
    }, 900);

    return () => {
      window.clearTimeout(timer);
    };
  }, [visible, initialized]);

  // ============================================================
  // SCROLL WHEN MESSAGES CHANGE
  // ============================================================

  useEffect(() => {
    if (!visible) return;

    scrollToBottom();
  }, [messages, typing]);

  // ============================================================
  // CLOSE EMOJI PICKER WHEN CLICKING OUTSIDE
  // ============================================================

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [showEmojiPicker]);

  // ============================================================
  // LOCK BODY SCROLL ON MOBILE WHILE CHAT IS OPEN
  // ============================================================

  useEffect(() => {
    if (!visible) {
      return;
    }

    const isMobile = window.innerWidth < 768;

    if (!isMobile) {
      return;
    }

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [visible]);

  // ============================================================
  // DO NOT RENDER WHEN CLOSED
  // ============================================================

  if (!visible) {
    return null;
  }

  // ============================================================
  // QUICK QUESTIONS
  // ============================================================

  const showQuickQuestions =
    messages.length === 1 &&
    !typing &&
    !showTyping;

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      className="
        fixed
        inset-0
        md:inset-auto
        md:top-16
        md:right-8
        w-full
        md:w-[500px]
        h-[100dvh]
        md:h-[85vh]
        md:max-h-[760px]
        bg-white
        md:rounded-2xl
        shadow-2xl
        flex
        flex-col
        z-[9999]
        overflow-hidden
        transform
        transition-transform
        duration-300
        ease-out
      "
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* ======================================================
          HEADER
      ======================================================= */}

      <div
        className="
          shrink-0
          px-4
          py-3
          bg-gradient-to-r
          from-blue-600
          via-indigo-600
          to-purple-600
          text-white
          flex
          items-center
          justify-between
          md:rounded-t-2xl
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              w-10
              h-10
              rounded-full
              bg-white/20
              backdrop-blur
              flex
              items-center
              justify-center
              border
              border-white/20
            "
          >
            <SparklesIcon className="w-5 h-5" />
          </div>

          <div>
            <div className="font-semibold text-sm md:text-base">
              ASK LIHANA
            </div>

            <div className="text-[10px] md:text-xs text-white/80">
              LinorAI AI Support Assistant
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close LIHANA"
          className="
            w-9
            h-9
            rounded-full
            flex
            items-center
            justify-center
            hover:bg-white/15
            transition
          "
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* ======================================================
          CHAT MESSAGES
      ======================================================= */}

      <div
        ref={chatContainerRef}
        className="
          flex-1
          min-h-0
          overflow-y-auto
          overscroll-contain
          p-3
          md:p-4
          space-y-3
          font-sans
          text-xs
          md:text-sm
          leading-relaxed
          bg-gray-50
          scroll-smooth
        "
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.from === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`flex items-start gap-2 md:gap-3 ${
                msg.from === "user"
                  ? "flex-row-reverse"
                  : "flex-row"
              }`}
            >
              {/* Avatar */}

              <img
                src={
                  msg.from === "user"
                    ? "/user.png"
                    : "/bot.png"
                }
                className="
                  w-8
                  h-8
                  md:w-9
                  md:h-9
                  object-cover
                  border
                  border-gray-200
                  rounded-full
                  shrink-0
                "
                alt={
                  msg.from === "user"
                    ? "User"
                    : "LIHANA"
                }
              />

              <div
                className={`flex flex-col ${
                  msg.from === "user"
                    ? "items-end"
                    : "items-start"
                }`}
              >
                {/* Message */}

                <div
                  className={`
                    px-3
                    py-2
                    md:px-4
                    md:py-2.5
                    rounded-2xl
                    shadow-sm
                    whitespace-pre-wrap
                    break-words
                    max-w-[78vw]
                    md:max-w-[390px]
                    ${
                      msg.from === "bot"
                        ? "bg-white border border-gray-200 text-gray-800 rounded-tl-md"
                        : "bg-blue-600 text-white rounded-tr-md"
                    }
                  `}
                >
                  {msg.from === "bot" ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderMessage(
                          msg.text
                        ),
                      }}
                    />
                  ) : (
                    <div>{msg.text}</div>
                  )}
                </div>

                {/* Timestamp */}

                <div className="text-gray-400 mt-1 text-[9px] md:text-[10px] px-1">
                  {formatTimestamp(
                    msg.timestamp
                  )}
                </div>
              </div>
            </div>

            {/* ==================================================
                BACKEND SUGGESTIONS
            =================================================== */}

            {msg.from === "bot" &&
              msg.suggestions &&
              msg.suggestions.length > 0 &&
              index === messages.length - 1 && (
                <div className="ml-10 md:ml-12 mt-2 flex flex-col gap-1.5 max-w-[80%]">
                  <div className="text-blue-700 font-semibold text-[10px] md:text-xs">
                    You may also want to ask:
                  </div>

                  {msg.suggestions.map(
                    (suggestion, suggestionIndex) => (
                      <button
                        key={`${suggestion.intent}-${suggestionIndex}`}
                        type="button"
                        onClick={() =>
                          handleSuggestionClick(
                            suggestion.intent
                          )
                        }
                        disabled={typing}
                        className="
                          text-left
                          px-3
                          py-2
                          border
                          border-blue-200
                          bg-white
                          text-blue-700
                          rounded-xl
                          hover:bg-blue-50
                          hover:border-blue-300
                          transition
                          text-[10px]
                          md:text-xs
                          disabled:opacity-50
                          disabled:cursor-not-allowed
                        "
                      >
                        {suggestion.text}
                      </button>
                    )
                  )}
                </div>
              )}
          </div>
        ))}

        {/* ======================================================
            FIRST-TIME QUICK QUESTIONS
        ======================================================= */}

        {showQuickQuestions && (
          <div className="pt-1">
            <div className="flex items-center gap-2 mb-2">
              <SparklesIcon className="w-4 h-4 text-blue-600" />

              <span className="text-xs md:text-sm font-semibold text-gray-700">
                Quick questions
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() =>
                    handleQuickQuestion(question)
                  }
                  disabled={typing}
                  className="
                    text-left
                    px-3
                    py-2.5
                    bg-white
                    border
                    border-blue-200
                    text-blue-700
                    rounded-xl
                    hover:bg-blue-50
                    hover:border-blue-300
                    transition
                    text-xs
                    md:text-sm
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================
            TYPING INDICATOR
        ======================================================= */}

        {(typing || showTyping) && (
          <div className="flex items-center gap-2 text-gray-400 text-[10px] md:text-xs pl-1">
            <span>LIHANA is typing</span>

            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounceDelay1" />

            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounceDelay2" />

            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounceDelay3" />
          </div>
        )}
      </div>

      {/* ======================================================
          INPUT AREA
      ======================================================= */}

      <div
        className="
          shrink-0
          p-2
          md:p-3
          border-t
          border-gray-200
          bg-white
        "
      >
        <div
          className="
            relative
            w-full
            bg-gray-100
            rounded-2xl
            px-2
            py-2
            md:px-3
            md:py-3
          "
        >
          {/* ==================================================
              MESSAGE FORM
          =================================================== */}

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 w-full"
          >
            <input
              ref={inputRef}
              name="chatInput"
              type="text"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              placeholder="Ask LIHANA a question..."
              autoComplete="off"
              autoCorrect="on"
              spellCheck={true}
              disabled={typing}
              inputMode="text"
              className="
                flex-1
                min-w-0
                bg-transparent
                outline-none
                border-none
                text-[16px]
                md:text-sm
                text-gray-900
                placeholder-gray-500
                disabled:opacity-60
              "
            />

            {/* Voice */}

            <button
              type="button"
              disabled={typing}
              className="
                shrink-0
                w-7
                h-7
                md:w-8
                md:h-8
                flex
                items-center
                justify-center
                bg-gray-200
                hover:bg-gray-300
                rounded-full
                transition
                disabled:opacity-50
              "
              title="Voice input"
              onClick={() =>
                alert(
                  "Voice input coming soon!"
                )
              }
            >
              <MicrophoneIcon className="w-4 h-4 text-gray-700" />
            </button>

            {/* Send */}

            <button
              type="submit"
              disabled={
                typing || !input.trim()
              }
              aria-label="Send message"
              title="Send message"
              className="
                shrink-0
                w-8
                h-8
                md:w-9
                md:h-9
                flex
                items-center
                justify-center
                bg-blue-600
                hover:bg-blue-700
                disabled:bg-gray-300
                disabled:cursor-not-allowed
                rounded-full
                transition
              "
            >
              <ArrowUpCircleIcon className="w-5 h-5 text-white" />
            </button>
          </form>

          {/* ==================================================
              TOOLBAR
          =================================================== */}

          <div className="flex items-center gap-1 mt-2">
            {/* Emoji */}

            <button
              type="button"
              className="
                w-7
                h-7
                flex
                items-center
                justify-center
                hover:bg-gray-200
                rounded-full
                transition
              "
              title="Emoji"
              onClick={() =>
                setShowEmojiPicker(
                  (previous) => !previous
                )
              }
            >
              <FaceSmileIcon className="w-4 h-4 text-gray-700" />
            </button>

            {/* Attachment */}

            <input
              type="file"
              id="attachmentInput"
              className="hidden"
              onChange={(event) => {
                const file =
                  event.target.files?.[0];

                if (!file) return;

                const attachmentMessage: Message =
                  {
                    id: `${Date.now()}-attachment`,
                    from: "user",
                    text: `📎 ${file.name}`,
                    timestamp:
                      new Date().toISOString(),
                  };

                setMessages((previous) => [
                  ...previous,
                  attachmentMessage,
                ]);

                setTimeout(() => {
                  scrollToBottom();
                }, 50);

                // Allow selecting the same file again
                event.target.value = "";
              }}
            />

            <button
              type="button"
              className="
                w-7
                h-7
                flex
                items-center
                justify-center
                hover:bg-gray-200
                rounded-full
                transition
              "
              title="Attach file"
              onClick={() =>
                document
                  .getElementById(
                    "attachmentInput"
                  )
                  ?.click()
              }
            >
              <PaperClipIcon className="w-4 h-4 text-gray-700" />
            </button>

            {/* GIF */}

            <button
              type="button"
              className="
                w-7
                h-7
                flex
                items-center
                justify-center
                hover:bg-gray-200
                rounded-full
                transition
              "
              title="GIF"
              onClick={() =>
                setShowGifPopup(
                  (previous) => !previous
                )
              }
            >
              <PhotoIcon className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* ==================================================
              EMOJI PICKER
          =================================================== */}

          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="
                absolute
                bottom-20
                left-2
                z-[10000]
                shadow-2xl
                rounded-xl
                overflow-hidden
              "
            >
              <Picker
                onEmojiClick={(emojiObject) => {
                  setInput(
                    (previous) =>
                      previous +
                      emojiObject.emoji
                  );

                  setShowEmojiPicker(false);

                  setTimeout(() => {
                    inputRef.current?.focus();
                  }, 50);
                }}
                width={280}
                height={350}
                searchDisabled={false}
              />
            </div>
          )}

          {/* ==================================================
              GIF POPUP
          =================================================== */}

          {showGifPopup && (
            <div
              className="
                absolute
                bottom-20
                left-2
                z-[10000]
                bg-white
                border
                border-gray-200
                shadow-2xl
                rounded-xl
                p-4
                w-64
              "
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-gray-700">
                  GIFs
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setShowGifPopup(false)
                  }
                  className="text-gray-400 hover:text-gray-700"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-gray-500">
                GIF support can be connected to a GIF provider later.
              </div>
            </div>
          )}
        </div>

        {/* ======================================================
            PRIVACY NOTICE
        ======================================================= */}

        <div
          className="
            w-full
            mt-2
            px-2
            md:px-3
            py-1.5
            text-[8px]
            md:text-[10px]
            text-gray-400
            text-center
            leading-snug
          "
        >
          LIHANA uses your message to provide a better support
          response. Please avoid sharing sensitive personal
          information.
        </div>
      </div>
    </div>
  );
};

export default Chatbot;