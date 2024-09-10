import { Box, Text, Flex } from "@chakra-ui/react";
import { ReactTyped } from "react-typed";
import { type ChatMessage } from "shared/schema/chat";

type ChatMessageProps = {
  message: ChatMessage;
  key: number;
};

export function ChatMessage({ message, key }: ChatMessageProps) {
  return (
    <Flex
      key={key}
      style={{
        alignSelf: message.actor === "self" ? "flex-end" : "flex-start",
        textAlign: message.actor === "self" ? "right" : "left",
        backgroundColor: message.actor === "self" ? "#9999ff" : "white",
        background: message.actor === "self" ? "rgba(255,255,255,0.04)" : "white",
        border: message.actor === "self" ? "1px solid rgba(255,255,255,0.6)" : "unset",
        borderBottomLeftRadius: message.actor === "self" ? "20px" : "0",
        borderBottomRightRadius: message.actor === "self" ? "0" : "20px",
        float: message.actor === "self" ? "right" : "left",
        clear: message.actor === "self" ? "left" : "right",
      }}
      className="chat-message">
      {message.actor === "self" ? (
        <Box className="chat-message-self">
          <Text>{[message.content]}</Text>
        </Box>
      ) : (
        <Box className="chat-message-ai">
          <ReactTyped typeSpeed={10} strings={[message.content]} showCursor={false} />
        </Box>
      )}
    </Flex>
  );
}
