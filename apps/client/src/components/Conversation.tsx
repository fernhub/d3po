import { Message } from "./Message";
import { chatMessagesAtom } from "../state/chat";
import { appStateAtom } from "../state/app";
import { useAtom } from "jotai";
import { useRef, useEffect } from "react";

export function Conversation() {
  const [messages] = useAtom(chatMessagesAtom);
  const [appState] = useAtom(appStateAtom);
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
      {appState === "sending" && (
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
