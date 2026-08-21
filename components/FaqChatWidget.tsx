"use client";

import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
}

const GREETING: ChatMessage = {
  id: "greeting",
  role: "ai",
  text: "Hi! I'm the LinorAI support assistant. Ask me about our services, or how to get in touch with the team.",
};

const SUGGESTIONS = [
  "What services does LinorAI offer?",
  "How do I contact support?",
  "Do you build custom web apps?",
  "What IT services do you provide?",
];

const FALLBACK_REPLY =
  "Sorry, I couldn't process that. Please try again or contact us at info@linorai.ai.";

const FaqChatWidget: FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, busy]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      text: trimmed,
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setBusy(true);

    try {
      const history = nextMessages.slice(-12).map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text,
      }));

      const res = await fetch("/api/faq-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json().catch(() => null);
      const reply =
        typeof data?.reply === "string" && data.reply.trim()
          ? data.reply
          : FALLBACK_REPLY;

      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-ai`, role: "ai", text: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-ai`,
          role: "ai",
          text: "I'm having trouble connecting right now. Please reach out at info@linorai.ai or (619) 622-3468.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const showSuggestions = messages.length === 1 && !busy;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close support chat" : "Open support chat"}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 left-6 z-50 w-[360px] max-w-[90vw] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white flex items-center justify-between">
            <span className="font-semibold text-sm">LinorAI Support</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            ref={listRef}
            className="flex-1 overflow-y-auto px-3 py-3 space-y-2 font-inter text-sm bg-gray-50"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-3 py-2 rounded-2xl max-w-[80%] shadow-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {busy && (
              <div className="flex items-center gap-1 text-gray-400 text-xs pl-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounceDelay1"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounceDelay2"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounceDelay3"></span>
              </div>
            )}

            {showSuggestions && (
              <div className="flex flex-col gap-1.5 pt-1">
                {SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="text-left px-3 py-1.5 rounded-lg border border-purple-200 text-purple-700 text-xs hover:bg-purple-50 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-2 border-t bg-white flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              autoComplete="off"
              className="flex-1 bg-gray-100 rounded-full px-3 py-2 text-sm outline-none placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-full transition"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FaqChatWidget;
