"use client";
import { useState } from "react";
import ChatToggleButton from "./ChatToggleButton";
import Chatbot from "./Chatbot";

export default function ChatWrapper() {
  const [show, setShow] = useState(false);

  return (
    <>
      <ChatToggleButton onToggle={() => setShow(!show)} />
      <Chatbot visible={show} onClose={() => setShow(false)} />
    </>
  );
}
ChatToggleButton.tsx