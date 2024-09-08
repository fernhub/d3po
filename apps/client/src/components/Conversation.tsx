import { Box, Divider } from "@chakra-ui/react";
import { ChatMessage } from "./ChatMessage";
import { ChatMessagesAtom } from "../state/chat";
import { useAtom } from "jotai";

export function Conversation() {
  const [messages] = useAtom(ChatMessagesAtom);

  return (
    <Box className="llm-chat-messages">
      {messages.map((message, index) => (
        <>
          {index == 0 ? <></> : <Divider />}
          <ChatMessage key={index} message={message} />
        </>
      ))}
    </Box>
  );
}
