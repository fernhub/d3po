import { ArrowUpIcon } from "@chakra-ui/icons";
import { Alert, AlertIcon, Box, Flex, Spinner, Textarea } from "@chakra-ui/react";
import { type Document } from "shared/schema/document";
import { ChangeEvent, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Conversation } from "./Conversation";
import { chatStateAtom, chatMessagesAtom } from "../state/chat";
import { useAtom } from "jotai";
import { ChatMessage } from "shared/schema/chat";
import { useAuth } from "../context/AuthContext";
import { selectedModelAtom } from "../state/selectedModel";

type ChatWindowProps = {
  selectedDocument: Document | null;
};

export function ChatWindow({ selectedDocument }: ChatWindowProps) {
  const [llmQuery, setLlmQuery] = useState("");
  const [, setChatMessages] = useAtom(chatMessagesAtom);
  const [chatSocket, setChatSocket] = useState<Socket>();
  const [chatState, setChatState] = useAtom(chatStateAtom);
  const [selectedModel] = useAtom(selectedModelAtom);
  const { user } = useAuth();

  useEffect(() => {
    const query = {
      user_id: user?.id,
      document_key: selectedDocument?.s3_key,
      model_source: selectedModel?.source,
      model_key: selectedModel?.key,
    };
    console.log("creating socket");
    console.log(query);
    const socket = io("http://localhost:5001", {
      query: query,
      withCredentials: true,
    });
    socket.on("connect", () => {
      console.log("successfully connected");
    });
    socket.on("ready", () => {
      setChatMessages([
        {
          actor: "ai",
          content: "Hello, how can I help you?",
          timestamp: new Date(),
        },
      ]);
      setChatState("waiting");
    });
    socket.on("connect_error", (err) => {
      //TODO: something with err
      console.log("error on connect");
      console.log(err.message);
      setChatState("error");
    });
    socket.on("error", (err) => {
      console.log(err);
      setChatState("error");
    });

    socket.on("response", (actor, content, timestamp) => {
      setChatState("waiting");
      console.log(actor, content, timestamp);
      const response: ChatMessage = {
        actor: actor,
        content: content,
        timestamp: timestamp,
      };
      setChatMessages((prevChatMessages) => [...prevChatMessages, response]);
    });

    setChatSocket(socket);
    const cleanupSocket = () => {
      console.log("dismounting and disconnecting socket");
      socket.off();
      socket.disconnect();
    };
    window.addEventListener("beforeunload", cleanupSocket);
    return () => {
      cleanupSocket();
      window.removeEventListener("beforeunload", cleanupSocket);
    };
  }, [selectedModel, selectedDocument, user, setChatMessages, setChatState]);

  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const inputValue = e.target.value;
    setLlmQuery(inputValue);
  }

  function sendMessage() {
    console.log("sending question");
    console.log(llmQuery);
    setChatState("sending");
    setLlmQuery("");
    setChatMessages((prevChatMessages) => [
      ...prevChatMessages,
      { actor: "self", content: llmQuery, timestamp: new Date() },
    ]);
    if (!chatSocket) {
      console.log("error sending");
      return;
    }
    chatSocket.emit("query", llmQuery);
  }

  function getPlaceholder() {
    switch (chatState) {
      case "loading":
        return "Preparing model...";
      case "sending":
        return "Waiting on response...";
      case "error":
        return "There was an error, see alert for more details.";
      default:
        return `Ask ${selectedModel!.display_name} about ${selectedDocument!.name}...`;
    }
  }

  return (
    <Box className="chat_window">
      <Flex id="llm-chat-messages">
        <Flex className="loading_container">
          <Spinner size="xl" />
        </Flex>
      </Flex>

      <Flex id="llm-chat-input-container">
        <Textarea
          id="llm-chat-input-text"
          placeholder={getPlaceholder()}
          value={llmQuery}
          onChange={handleInputChange}
          disabled={chatState !== "waiting"}
        />
        <Flex id="llm-chat-button-container">
          <Flex
            id="llm-chat-button"
            aria-label="send question to llm"
            cursor={chatState === "loading" ? "cursor" : "pointer"}
            onClick={sendMessage}
            aria-disabled={chatState !== "waiting"}>
            <ArrowUpIcon width={"1.5em"} height={"1.5em"} />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
