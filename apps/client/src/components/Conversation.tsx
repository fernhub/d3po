import { Message } from "./Message";
import { chatMessagesAtom, chatStateAtom } from "../state/chat";
import { useAtom } from "jotai";
import { useRef, useEffect } from "react";

export function Conversation() {
  const [messages] = useAtom(chatMessagesAtom);
  const [chatState] = useAtom(chatStateAtom);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      {messages.map((message, index) => (
        <Message index={index} message={message} />
      ))}
      {chatState === "sending" && (
        <Message
          index={-1}
          message={{ actor: "ai", content: ".  .  .", timestamp: new Date() }}
          loop={true}
        />
      )}
      <div ref={messagesEndRef} />
    </>
  );
}
