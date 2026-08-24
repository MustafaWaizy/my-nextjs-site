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
  FaceSmileIcon,
  XMarkIcon,
  SparklesIcon,
  PaperAirplaneIcon,
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

interface GeminiPart {
  text?: string;
  thought?: boolean;
  thoughtSignature?: string;
}

interface Message {
  id: string;
  from: "user" | "bot";
  text: string;
  timestamp: string;
  suggestions?: Suggestion[];
  attachments?: ChatAttachment[];
  geminiParts?: GeminiPart[];
}

interface ChatbotProps {
  visible: boolean;
  onClose: () => void;
}

interface BackendResponse {
  response?: unknown;
  suggestions?: unknown;
  modelParts?: unknown;
}

const QUICK_QUESTIONS = [
  "What services does LinorAI offer?",
  "How can I contact LinorAI?",
  "What AI solutions does LinorAI provide?",
];

const INITIAL_GREETING: Message = {
  id: "initial-greeting",
  from: "bot",
  text: "Hi! I'm LIHANA. Ask about our AI, IT, web, or contact services.",
  timestamp: new Date().toISOString(),
};

const FALLBACK_REPLY =
  "I can't answer that right now. Please try again.";

const SUPPORT_EMAIL = "info@linorAI.com";

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

function normalizeGeminiParts(value: unknown): GeminiPart[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is GeminiPart =>
        typeof item === "object" &&
        item !== null &&
        (typeof (item as GeminiPart).text === "string" ||
          typeof (item as GeminiPart).thoughtSignature ===
            "string")
    )
    .map((item) => ({
      ...(typeof item.text === "string"
        ? { text: item.text }
        : {}),
      ...(typeof item.thought === "boolean"
        ? { thought: item.thought }
        : {}),
      ...(typeof item.thoughtSignature === "string"
        ? { thoughtSignature: item.thoughtSignature }
        : {}),
    }));
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

    const renderInline = (
      line: string,
      lineIndex: number
    ): ReactNode[] => {
      const combinedRegex = new RegExp(
        `(${URL_REGEX.source})|(${EMAIL_REGEX.source})`,
        "gi"
      );
      const parts: ReactNode[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = combinedRegex.exec(line)) !== null) {
        const matchStart = match.index;
        const matchEnd = combinedRegex.lastIndex;

        if (matchStart > lastIndex) {
          parts.push(
            <span key={`text-${lineIndex}-${lastIndex}`}>
              {line.slice(lastIndex, matchStart)}
            </span>
          );
        }

        const value = match[0];
        const isUrl = /^https?:\/\//i.test(value);

        parts.push(
          <a
            key={`${isUrl ? "url" : "email"}-${lineIndex}-${matchStart}`}
            href={isUrl ? value : `mailto:${value}`}
            target={isUrl ? "_blank" : undefined}
            rel={isUrl ? "noopener noreferrer" : undefined}
            className="font-medium text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900 break-all"
          >
            {value}
          </a>
        );

        lastIndex = matchEnd;
      }

      if (lastIndex < line.length) {
        parts.push(
          <span key={`text-${lineIndex}-${lastIndex}`}>
            {line.slice(lastIndex)}
          </span>
        );
      }

      return parts;
    };

    return text.split("\n").map((line, index) => {
      const bulletMatch = line.trim().match(/^[•*-]\s+(.+)$/);

      if (bulletMatch) {
        return (
          <div
            key={`bullet-${index}`}
            className="flex gap-2 py-0.5"
          >
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
            <span className="min-w-0">
              {renderInline(bulletMatch[1], index)}
            </span>
          </div>
        );
      }

      return (
        <p
          key={`line-${index}`}
          className={index > 0 ? "mt-2" : undefined}
        >
          {renderInline(line, index)}
        </p>
      );
    });
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
      const history = currentMessages
        .filter((message) => message.id !== INITIAL_GREETING.id)
        .slice(-11)
        .map((message) => ({
          role: message.from === "bot" ? "assistant" : "user",
          content: message.text,
          ...(message.geminiParts
            ? { parts: message.geminiParts }
            : {}),
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

      const modelParts = normalizeGeminiParts(data.modelParts);

      return {
        response: responseText,
        suggestions,
        modelParts,
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
        geminiParts: [
          {
            text:
              messageText ||
              "Please review the attached file.",
          },
        ],
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
          geminiParts:
            result.modelParts.length > 0
              ? result.modelParts
              : undefined,
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

        const serviceMessage =
          error instanceof Error &&
          error.message.startsWith("LIHANA")
            ? error.message
            : `LIHANA is unavailable right now. Try again or email ${SUPPORT_EMAIL}.`;

        const errorMessage: Message = {
          id: `${Date.now()}-error`,
          from: "bot",
          text: serviceMessage,
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
        md:top-20
        md:right-7
        w-full
        md:w-[460px]
        h-[100dvh]
        md:h-[min(760px,calc(100vh-7rem))]
        bg-white/95
        md:rounded-[28px]
        border
        border-slate-200/80
        shadow-[0_24px_80px_rgba(15,23,42,0.22)]
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
          relative
          overflow-hidden
          shrink-0
          px-4
          py-3.5
          md:px-5
          bg-gradient-to-r
          from-slate-950
          via-blue-950
          to-indigo-950
          text-white
          flex
          items-center
          justify-between
          md:rounded-t-[27px]
        "
      >
        <div className="absolute -right-10 -top-16 h-36 w-36 rounded-full bg-blue-400/20 blur-2xl" />
        <div className="absolute -left-12 -bottom-20 h-32 w-32 rounded-full bg-indigo-400/15 blur-2xl" />

        <div className="relative flex items-center gap-3">
          <div
            className="
              w-11
              h-11
              rounded-full
              bg-white
              p-0.5
              flex
              items-center
              justify-center
              shadow-lg
              shadow-blue-950/30
            "
          >
            <img
              src="/bot.png"
              alt="LIHANA"
              className="h-full w-full rounded-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <div className="font-semibold tracking-tight text-sm md:text-base">
                LIHANA
              </div>

              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-1.5 py-0.5 text-[9px] font-medium text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Online
              </span>
            </div>

            <div className="mt-0.5 text-[10px] text-slate-300 md:text-xs">
              LinorAI support assistant
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close LIHANA"
          className="
            relative
            w-9
            h-9
            rounded-full
            flex
            items-center
            justify-center
            border
            border-white/10
            bg-white/5
            text-slate-200
            hover:bg-white/15
            hover:text-white
            transition-colors
            focus:outline-none
            focus:ring-2
            focus:ring-white/70
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
          px-3
          py-4
          md:px-5
          md:py-5
          space-y-5
          font-sans
          text-xs
          md:text-sm
          leading-relaxed
          bg-[radial-gradient(circle_at_top,_#eff6ff_0,_#f8fafc_38%,_#f8fafc_100%)]
          scroll-smooth
        "
        aria-live="polite"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`animate-chatMessage flex ${
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
                  border-2
                  border-white
                  rounded-full
                  shrink-0
                  shadow-sm
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
                  className={`mb-1 px-1 text-[10px] font-semibold tracking-wide ${
                    msg.from === "bot"
                      ? "text-slate-500"
                      : "text-blue-700"
                  }`}
                >
                  {msg.from === "bot" ? "LIHANA" : "YOU"}
                </div>

                <div
                  className={`
                    px-3
                    py-2.5
                    md:px-4
                    md:py-3
                    rounded-[18px]
                    shadow-[0_2px_10px_rgba(15,23,42,0.05)]
                    whitespace-pre-wrap
                    break-words
                    max-w-[76vw]
                    md:max-w-[350px]
                    ${
                      msg.from === "bot"
                        ? "bg-white border border-slate-200/80 text-slate-700 rounded-tl-md"
                        : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-md shadow-blue-500/20"
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

                {/* AI SUGGESTIONS */}

                {msg.from === "bot" &&
                  msg.suggestions &&
                  msg.suggestions.length > 0 && (
                    <div className="mt-3 w-full max-w-[76vw] md:max-w-[350px]">
                      <div className="mb-2 flex items-center gap-1.5 px-1 text-[10px] font-medium text-slate-500">
                        <SparklesIcon className="h-3.5 w-3.5 text-blue-600" />
                        Continue exploring
                      </div>

                      <div className="flex flex-wrap gap-1.5">
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
                                rounded-full
                                border
                                border-blue-100
                                bg-white/90
                                px-3
                                py-1.5
                                text-left
                                text-[10px]
                                font-medium
                                text-blue-700
                                shadow-sm
                                transition-colors
                                hover:border-blue-200
                                hover:bg-blue-50
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-500/30
                                md:text-xs
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                            >
                              {suggestion.text}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        ))}

        {/* QUICK QUESTIONS */}

        {showQuickQuestions && (
          <div className="ml-10 rounded-2xl border border-blue-100 bg-blue-50/70 p-3 md:ml-12 md:p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                <SparklesIcon className="h-4 w-4" />
              </span>

              <div>
                <div className="text-xs font-semibold text-slate-800">
                  Start a conversation
                </div>
                <div className="text-[10px] text-slate-500 md:text-xs">
                  Select a topic or write your own question.
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() =>
                    void handleQuickQuestion(question)
                  }
                  disabled={typing}
                  className="
                    rounded-full
                    px-3
                    py-2
                    bg-white
                    border
                    border-blue-100
                    text-blue-700
                    text-left
                    text-[10px]
                    font-medium
                    shadow-sm
                    hover:bg-blue-50
                    hover:border-blue-300
                    transition-colors
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500/30
                    md:text-xs
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
          <div className="animate-chatMessage flex items-center gap-2 pl-1 text-[10px] text-slate-500 md:text-xs">
            <img
              src="/bot.png"
              alt=""
              className="h-7 w-7 rounded-full border-2 border-white object-cover shadow-sm"
            />
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <span>LIHANA is typing</span>
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounceDelay1" />
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounceDelay2" />
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounceDelay3" />
            </div>
          </div>
        )}
      </div>

      {/* INPUT AREA */}

      <div
        className="
          shrink-0
          border-t
          border-slate-200/80
          bg-white
          px-3
          pb-2.5
          pt-3
          md:px-4
          md:pb-3
          md:pt-4
        "
      >
        <div
          className="
            relative
            w-full
          "
        >
          {/* MESSAGE FORM */}

          <form
            onSubmit={handleSubmit}
            className="
              flex
              w-full
              items-center
              gap-1
              rounded-[20px]
              border
              border-slate-200
              bg-slate-50
              p-1.5
              shadow-[0_1px_2px_rgba(15,23,42,0.04)]
              transition-colors
              focus-within:border-blue-300
              focus-within:bg-white
              focus-within:ring-4
              focus-within:ring-blue-500/10
            "
          >
            <input
              ref={inputRef}
              name="chatInput"
              type="text"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              placeholder="Ask LIHANA anything..."
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
                px-1.5
                text-slate-800
                placeholder:text-slate-400
                disabled:opacity-60
              "
            />

            {/* EMOJI */}

            <button
              type="button"
              disabled={typing}
              className="
                shrink-0
                w-9
                h-9
                flex
                items-center
                justify-center
                rounded-xl
                text-slate-500
                hover:bg-slate-200/70
                hover:text-slate-700
                transition-colors
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500/30
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
              title="Add an emoji"
              aria-label="Open emoji picker"
              onClick={() =>
                setShowEmojiPicker(
                  (previous) => !previous
                )
              }
            >
              <FaceSmileIcon className="w-[18px] h-[18px]" />
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
                w-9
                h-9
                flex
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-blue-600
                to-indigo-600
                text-white
                shadow-sm
                shadow-blue-500/30
                hover:scale-[1.03]
                hover:from-blue-700
                hover:to-indigo-700
                transition-all
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500/40
                disabled:bg-slate-200
                disabled:bg-none
                disabled:text-slate-400
                disabled:shadow-none
                disabled:scale-100
                disabled:cursor-not-allowed
              "
            >
              <PaperAirplaneIcon className="w-4 h-4 -rotate-45 translate-x-px" />
            </button>
          </form>

          {/* TOOLBAR */}

          <div className="mt-2 flex items-center justify-between px-1 text-[9px] md:text-[10px]">

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
                flex
                items-center
                gap-1.5
                rounded-lg
                px-1.5
                py-1
                font-medium
                text-slate-500
                transition-colors
                hover:bg-slate-100
                hover:text-slate-700
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500/30
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              title="Attach a file"
              aria-label="Attach file"
              onClick={() =>
                attachmentInputRef.current?.click()
              }
            >
              <PaperClipIcon className="h-3.5 w-3.5" />
              Attach a file
            </button>

            <span className="text-slate-400">Press Enter to send</span>
          </div>

          {/* EMOJI PICKER */}

          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="
                absolute
                bottom-16
                left-0
                z-[10000]
                rounded-2xl
                overflow-hidden
                border
                border-slate-200
                shadow-2xl
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
            mt-1
            px-2
            py-1
            text-[9px]
            text-slate-400
            text-center
            leading-snug
          "
        >
          Please avoid sharing sensitive personal information in chat.
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
