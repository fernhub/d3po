import { Card } from "@chakra-ui/react";
import { ReactTyped } from "react-typed";
import { type ChatMessage } from "shared/schema/chat";

type ChatMessageProps = {
  message: ChatMessage;
};

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <>
      {message.actor === "self" ? (
        <Card className="chat-message chat-message-self">
          <span>{[message.content]}</span>
        </Card>
      ) : (
        <Card className="chat-message chat-message-ai">
          <ReactTyped typeSpeed={10} strings={[message.content]} showCursor={false} />
        </Card>
      )}
    </>
  );
}
