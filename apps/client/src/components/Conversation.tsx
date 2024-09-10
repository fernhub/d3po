import { Box } from "@chakra-ui/react";
import { ChatMessage } from "./ChatMessage";
import { ChatMessagesAtom } from "../state/chat";
import { useAtom } from "jotai";

export function Conversation() {
  const [messages] = useAtom(ChatMessagesAtom);

  return (
    <Box>
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
    </Box>
  );
}
