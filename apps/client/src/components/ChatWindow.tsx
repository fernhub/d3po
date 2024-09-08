import { ArrowUpIcon } from "@chakra-ui/icons";
import { Box, IconButton, Textarea, VStack } from "@chakra-ui/react";
import { type Model } from "shared/schema/model";
import { type Document } from "shared/schema/document";
import { ChangeEvent, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { Conversation } from "./Conversation";
import { ChatMessagesAtom } from "../state/chat";
import { useAtom } from "jotai";
import { ChatMessage } from "shared/schema/chat";

type ChatWindowProps = {
  selectedModel: Model;
  selectedDocument: Document;
  chatSocket: Socket;
};

export function ChatWindow({ selectedModel, selectedDocument, chatSocket }: ChatWindowProps) {
  const [llmQuery, setLlmQuery] = useState("");
  const [, setChatMessages] = useAtom(ChatMessagesAtom);

  useEffect(() => {
    chatSocket.on("response", (actor, content, timestamp) => {
      console.log(actor, content, timestamp);
      const response: ChatMessage = {
        actor: actor,
        content: content,
        timestamp: timestamp,
      };
      setChatMessages((prevChatMessages) => [...prevChatMessages, response]);
    });
    return () => {
      chatSocket.off("response");
    };
  }, [chatSocket]);

  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const inputValue = e.target.value;
    setLlmQuery(inputValue);
  }

  function sendMessage() {
    console.log("sending question");
    console.log(llmQuery);
    setChatMessages((prevChatMessages) => [
      ...prevChatMessages,
      { actor: "self", content: llmQuery, timestamp: new Date() },
    ]);
    chatSocket.emit("query", llmQuery);
  }

  return (
    <VStack className="llm-chat-window">
      <Conversation />
      <Box className="llm-chat-input-container">
        <Textarea
          id="llm-chat-input-text"
          placeholder={`Ask ${selectedModel.display_name} about ${selectedDocument.name}...`}
          value={llmQuery}
          onChange={handleInputChange}
        />
        <IconButton
          id="llm-chat-button"
          aria-label="send question to llm"
          icon={<ArrowUpIcon />}
          backgroundColor="beige"
          onClick={sendMessage}
        />
      </Box>
    </VStack>
  );
}
