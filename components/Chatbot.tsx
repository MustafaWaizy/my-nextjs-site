"use client";

import {
  FC,
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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

interface ChatAttachment {
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
}

interface Message {
  id: string;
  from: "user" | "bot";
  text: string;
  timestamp: string;
  suggestions?: Suggestion[];
  attachments?: ChatAttachment[];
}

interface ChatbotProps {
  visible: boolean;
  onClose: () => void;
}

interface BackendResponse {
  response?: unknown;
  suggestions?: unknown;
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

const SUPPORT_EMAIL = "info@linorai.ai";

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;

const ACCEPTED_FILE_TYPES = [
  "image/*",
  "application/pdf",
  "text/plain",
  "text/csv",
  "application/json",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const URL_REGEX =
  /https?:\/\/[^\s<>"']+/gi;

const EMAIL_REGEX =
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

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
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const typingTimerRef = useRef<number | null>(null);
  const scrollTimerRef = useRef<number | null>(null);

  /*
   * ---------------------------------------------------------------
   * TIMESTAMP
   * ---------------------------------------------------------------
   */

  const formatTimestamp = useCallback((isoString: string) => {
    const date = new Date(isoString);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  /*
   * ---------------------------------------------------------------
   * SAFE MESSAGE RENDERING
   *
   * No dangerouslySetInnerHTML.
   * URLs and email addresses are converted into React elements.
   * ---------------------------------------------------------------
   */

  const renderMessage = useCallback((text: string): ReactNode[] => {
    if (!text) {
      return [];
    }

    const combinedRegex = new RegExp(
      `(${URL_REGEX.source})|(${EMAIL_REGEX.source})`,
      "gi"
    );

    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    combinedRegex.lastIndex = 0;

    while ((match = combinedRegex.exec(text)) !== null) {
      const matchStart = match.index;
      const matchEnd = combinedRegex.lastIndex;

      if (matchStart > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {text.slice(lastIndex, matchStart)}
          </span>
        );
      }

      const value = match[0];

      const isUrl = /^https?:\/\//i.test(value);

      if (isUrl) {
        parts.push(
          <a
            key={`url-${matchStart}`}
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 break-all"
          >
            {value}
          </a>
        );
      } else {
        parts.push(
          <a
            key={`email-${matchStart}`}
            href={`mailto:${value}`}
            className="text-blue-600 underline hover:text-blue-800 break-all"
          >
            {value}
          </a>
        );
      }

      lastIndex = matchEnd;
    }

    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {text.slice(lastIndex)}
        </span>
      );
    }

    return parts;
  }, []);

  /*
   * ---------------------------------------------------------------
   * SCROLL CHAT CONTAINER
   * ---------------------------------------------------------------
   */

  const scrollToBottom = useCallback((smooth = true) => {
    const container = chatContainerRef.current;

    if (!container) {
      return;
    }

    if (scrollTimerRef.current !== null) {
      window.clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = window.setTimeout(() => {
      requestAnimationFrame(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: smooth ? "smooth" : "auto",
        });
      });
    }, 0);
  }, []);

  /*
   * ---------------------------------------------------------------
   * FILE HELPERS
   * ---------------------------------------------------------------
   */

  const fileToDataUrl = useCallback(
    (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Unable to read the selected file."));
          }
        };

        reader.onerror = () => {
          reject(
            reader.error ||
              new Error("Unable to read the selected file.")
          );
        };

        reader.readAsDataURL(file);
      }),
    []
  );

  /*
   * ---------------------------------------------------------------
   * SEND MESSAGE TO NEXT.JS API
   * ---------------------------------------------------------------
   */

  const sendMessageToBackend = useCallback(
    async (
      messageText: string,
      currentMessages: Message[],
      attachments: ChatAttachment[] = []
    ) => {
      const history = currentMessages.slice(-12).map((message) => ({
        role: message.from === "bot" ? "assistant" : "user",
        content: message.text,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          history,
          attachments,
        }),
      });

      if (!response.ok) {
        let errorMessage = `API returned ${response.status}`;

        try {
          const errorData: unknown = await response.json();

          if (
            typeof errorData === "object" &&
            errorData !== null &&
            "error" in errorData &&
            typeof errorData.error === "string"
          ) {
            errorMessage = errorData.error;
          }
        } catch {
          // Ignore invalid error responses.
        }

        throw new Error(errorMessage);
      }

      const data: BackendResponse = await response.json();

      const responseText =
        typeof data.response === "string" &&
        data.response.trim()
          ? data.response
          : FALLBACK_REPLY;

      const suggestions: Suggestion[] = Array.isArray(
        data.suggestions
      )
        ? data.suggestions
            .filter(
              (item: unknown): item is Suggestion =>
                typeof item === "object" &&
                item !== null &&
                typeof (item as Suggestion).intent === "string" &&
                typeof (item as Suggestion).text === "string"
            )
            .slice(0, 3)
        : [];

      return {
        response: responseText,
        suggestions,
      };
    },
    []
  );

  /*
   * ---------------------------------------------------------------
   * SEND MESSAGE
   * ---------------------------------------------------------------
   */

  const sendMessage = useCallback(
    async (
      text?: string,
      attachments: ChatAttachment[] = []
    ) => {
      const messageText = (text ?? input).trim();

      if (
        (!messageText && attachments.length === 0) ||
        typing
      ) {
        return;
      }

      const userMessage: Message = {
        id: `${Date.now()}-user`,
        from: "user",
        text:
          messageText ||
          "I've attached a file for you to review.",
        timestamp: new Date().toISOString(),
        attachments:
          attachments.length > 0 ? attachments : undefined,
      };

      const nextMessages = [...messages, userMessage];

      setMessages(nextMessages);
      setInput("");
      setShowEmojiPicker(false);
      setShowGifPopup(false);
      setTyping(true);

      scrollToBottom();

      try {
        const result = await sendMessageToBackend(
          messageText ||
            "Please review the attached file.",
          nextMessages,
          attachments
        );

        const botMessage: Message = {
          id: `${Date.now()}-bot`,
          from: "bot",
          text: result.response,
          timestamp: new Date().toISOString(),
          suggestions: result.suggestions,
        };

        setMessages((previous) => [
          ...previous,
          botMessage,
        ]);

        window.setTimeout(() => {
          scrollToBottom();
        }, 50);
      } catch (error) {
        console.error("LIHANA API error:", error);

        const errorMessage: Message = {
          id: `${Date.now()}-error`,
          from: "bot",
          text:
            `I'm having trouble connecting to the LIHANA service right now. ` +
            `Please try again in a moment or contact the LinorAI team directly at ${SUPPORT_EMAIL}.`,
          timestamp: new Date().toISOString(),
        };

        setMessages((previous) => [
          ...previous,
          errorMessage,
        ]);

        window.setTimeout(() => {
          scrollToBottom();
        }, 50);
      } finally {
        setTyping(false);

        window.setTimeout(() => {
          inputRef.current?.focus();
        }, 50);
      }
    },
    [
      input,
      messages,
      scrollToBottom,
      sendMessageToBackend,
      typing,
    ]
  );

  /*
   * ---------------------------------------------------------------
   * QUICK QUESTION
   * ---------------------------------------------------------------
   */

  const handleQuickQuestion = useCallback(
    async (question: string) => {
      await sendMessage(question);
    },
    [sendMessage]
  );

  /*
   * ---------------------------------------------------------------
   * AI SUGGESTION
   * ---------------------------------------------------------------
   */

  const handleSuggestionClick = useCallback(
    async (intent: string) => {
      await sendMessage(intent);
    },
    [sendMessage]
  );

  /*
   * ---------------------------------------------------------------
   * FORM SUBMIT
   * ---------------------------------------------------------------
   */

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();

      void sendMessage();
    },
    [sendMessage]
  );

  /*
   * ---------------------------------------------------------------
   * ATTACH FILE
   * ---------------------------------------------------------------
   */

  const handleAttachmentChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      event.target.value = "";

      if (file.size > MAX_ATTACHMENT_SIZE) {
        const errorMessage: Message = {
          id: `${Date.now()}-attachment-error`,
          from: "bot",
          text:
            "That file is too large. Please select a file smaller than 10 MB.",
          timestamp: new Date().toISOString(),
        };

        setMessages((previous) => [
          ...previous,
          errorMessage,
        ]);

        return;
      }

      try {
        setTyping(true);

        const dataUrl = await fileToDataUrl(file);

        const attachment: ChatAttachment = {
          name: file.name,
          type: file.type || "application/octet-stream",
          size: file.size,
          dataUrl,
        };

        await sendMessage(undefined, [attachment]);
      } catch (error) {
        console.error("Attachment error:", error);

        const errorMessage: Message = {
          id: `${Date.now()}-attachment-error`,
          from: "bot",
          text:
            "I couldn't read that file. Please try another file.",
          timestamp: new Date().toISOString(),
        };

        setMessages((previous) => [
          ...previous,
          errorMessage,
        ]);

        setTyping(false);
      }
    },
    [fileToDataUrl, sendMessage]
  );

  /*
   * ---------------------------------------------------------------
   * INITIAL GREETING
   * ---------------------------------------------------------------
   */

  useEffect(() => {
    if (!visible || initialized) {
      return;
    }

    setShowTyping(true);

    typingTimerRef.current = window.setTimeout(() => {
      setMessages([
        {
          ...INITIAL_GREETING,
          timestamp: new Date().toISOString(),
        },
      ]);

      setShowTyping(false);
      setInitialized(true);

      window.setTimeout(() => {
        scrollToBottom(false);
        inputRef.current?.focus();
      }, 50);
    }, 900);

    return () => {
      if (typingTimerRef.current !== null) {
        window.clearTimeout(typingTimerRef.current);
      }
    };
  }, [
    initialized,
    scrollToBottom,
    visible,
  ]);

  /*
   * ---------------------------------------------------------------
   * SCROLL WHEN MESSAGES CHANGE
   * ---------------------------------------------------------------
   */

  useEffect(() => {
    if (!visible) {
      return;
    }

    scrollToBottom();
  }, [
    messages,
    typing,
    visible,
    scrollToBottom,
  ]);

  /*
   * ---------------------------------------------------------------
   * CLOSE EMOJI PICKER OUTSIDE CLICK
   * ---------------------------------------------------------------
   */

  useEffect(() => {
    if (!showEmojiPicker) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [showEmojiPicker]);

  /*
   * ---------------------------------------------------------------
   * MOBILE BODY SCROLL LOCK
   * ---------------------------------------------------------------
   */

  useEffect(() => {
    if (!visible) {
      return;
    }

    const isMobile = window.innerWidth < 768;

    if (!isMobile) {
      return;
    }

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [visible]);

  /*
   * ---------------------------------------------------------------
   * CLEANUP
   * ---------------------------------------------------------------
   */

  useEffect(() => {
    return () => {
      if (typingTimerRef.current !== null) {
        window.clearTimeout(typingTimerRef.current);
      }

      if (scrollTimerRef.current !== null) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  /*
   * ---------------------------------------------------------------
   * DO NOT RENDER WHEN CLOSED
   * ---------------------------------------------------------------
   */

  if (!visible) {
    return null;
  }

  /*
   * ---------------------------------------------------------------
   * FIRST-TIME QUICK QUESTIONS
   * ---------------------------------------------------------------
   */

  const showQuickQuestions =
    messages.length === 1 &&
    !typing &&
    !showTyping;

  /*
   * ---------------------------------------------------------------
   * UI
   * ---------------------------------------------------------------
   */

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
      "
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* HEADER */}

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

      {/* CHAT MESSAGES */}

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
              {/* AVATAR */}

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
                {/* MESSAGE */}

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
                    <div>
                      {renderMessage(msg.text)}
                    </div>
                  ) : (
                    <div>{msg.text}</div>
                  )}

                  {/* ATTACHMENTS */}

                  {msg.attachments &&
                    msg.attachments.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {msg.attachments.map(
                          (attachment) => (
                            <div
                              key={`${msg.id}-${attachment.name}`}
                              className="
                                flex
                                items-center
                                gap-2
                                rounded-lg
                                bg-black/5
                                px-2
                                py-1.5
                                text-[10px]
                                md:text-xs
                              "
                            >
                              <PaperClipIcon className="w-4 h-4 shrink-0" />

                              <span className="truncate">
                                {attachment.name}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    )}
                </div>

                {/* TIMESTAMP */}

                <div className="text-gray-400 mt-1 text-[9px] md:text-[10px] px-1">
                  {formatTimestamp(msg.timestamp)}
                </div>
              </div>
            </div>

            {/* AI SUGGESTIONS */}

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
                          void handleSuggestionClick(
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

        {/* QUICK QUESTIONS */}

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
                    void handleQuickQuestion(question)
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

        {/* TYPING INDICATOR */}

        {(typing || showTyping) && (
          <div className="flex items-center gap-2 text-gray-400 text-[10px] md:text-xs pl-1">
            <span>LIHANA is typing</span>

            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounceDelay1" />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounceDelay2" />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounceDelay3" />
          </div>
        )}
      </div>

      {/* INPUT AREA */}

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
          {/* MESSAGE FORM */}

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

            {/* VOICE */}

            <button
              type="button"
              disabled
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
                rounded-full
                transition
                opacity-50
                cursor-not-allowed
              "
              title="Voice input coming soon"
              aria-label="Voice input coming soon"
            >
              <MicrophoneIcon className="w-4 h-4 text-gray-700" />
            </button>

            {/* SEND */}

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

          {/* TOOLBAR */}

          <div className="flex items-center gap-1 mt-2">
            {/* EMOJI */}

            <button
              type="button"
              disabled={typing}
              className="
                w-7
                h-7
                flex
                items-center
                justify-center
                hover:bg-gray-200
                rounded-full
                transition
                disabled:opacity-50
              "
              title="Emoji"
              aria-label="Open emoji picker"
              onClick={() =>
                setShowEmojiPicker(
                  (previous) => !previous
                )
              }
            >
              <FaceSmileIcon className="w-4 h-4 text-gray-700" />
            </button>

            {/* ATTACHMENT */}

            <input
              ref={attachmentInputRef}
              type="file"
              id="attachmentInput"
              className="hidden"
              accept={ACCEPTED_FILE_TYPES.join(",")}
              onChange={handleAttachmentChange}
              disabled={typing}
            />

            <button
              type="button"
              disabled={typing}
              className="
                w-7
                h-7
                flex
                items-center
                justify-center
                hover:bg-gray-200
                rounded-full
                transition
                disabled:opacity-50
              "
              title="Attach file"
              aria-label="Attach file"
              onClick={() =>
                attachmentInputRef.current?.click()
              }
            >
              <PaperClipIcon className="w-4 h-4 text-gray-700" />
            </button>

            {/* GIF */}

            <button
              type="button"
              disabled
              className="
                w-7
                h-7
                flex
                items-center
                justify-center
                hover:bg-gray-200
                rounded-full
                transition
                opacity-50
                cursor-not-allowed
              "
              title="GIF support coming soon"
              aria-label="GIF support coming soon"
            >
              <PhotoIcon className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* EMOJI PICKER */}

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
                      previous + emojiObject.emoji
                  );

                  setShowEmojiPicker(false);

                  window.setTimeout(() => {
                    inputRef.current?.focus();
                  }, 50);
                }}
                width={280}
                height={350}
                searchDisabled={false}
              />
            </div>
          )}
        </div>

        {/* PRIVACY NOTICE */}

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
