import { ArrowUpIcon } from "@chakra-ui/icons";
import { Box, Flex, Spinner, Textarea } from "@chakra-ui/react";
import { type Model } from "shared/schema/model";
import { type Document } from "shared/schema/document";
import { ChangeEvent, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Conversation } from "./Conversation";
import { ChatMessagesAtom } from "../state/chat";
import { useAtom } from "jotai";
import { ChatMessage } from "shared/schema/chat";
import { useAuth } from "../context/AuthContext";
import { MODEL_SOURCE } from "shared/enums/models";

type ChatWindowProps = {
  selectedDocument: Document | null;
};

export function ChatWindow({ selectedDocument }: ChatWindowProps) {
  const [llmQuery, setLlmQuery] = useState("");
  const [, setChatMessages] = useAtom(ChatMessagesAtom);
  const [chatSocket, setChatSocket] = useState<Socket>();
  const [loading, setLoading] = useState(true);
  const [selectedModel] = useState<Model>({
    source: MODEL_SOURCE.OpenAI,
    model: "OPENAI_GPT4_0",
    display_name: "GPT 4.0",
    key: 2,
  });
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
      setLoading(false);
    });
    socket.on("connect_error", function (err) {
      //TODO: something with err
      console.log("error on connect");
      console.log(err.message);
    });

    socket.on("response", (actor, content, timestamp) => {
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
  }, [selectedModel, selectedDocument, user, setChatMessages]);

  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const inputValue = e.target.value;
    setLlmQuery(inputValue);
  }

  function sendMessage() {
    console.log("sending question");
    console.log(llmQuery);
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

  return (
    // <VStack className="llm-chat-window">
    //   <Conversation />
    //   <Box className="llm-chat-input-container">
    //     <textarea
    //       id="llm-chat-input-text"
    //       placeholder={
    //         disabled
    //           ? "Select/upload a document and select a model to begin"
    //           : `Ask ${selectedModel!.display_name} about ${selectedDocument!.name}...`
    //       }
    //       value={llmQuery}
    //       onChange={handleInputChange}
    //       disabled={disabled}
    //     />
    //     <IconButton
    //       id="llm-chat-button"
    //       aria-label="send question to llm"
    //       icon={<ArrowUpIcon />}
    //       backgroundColor="beige"
    //       onClick={sendMessage}
    //       disabled={disabled}
    //     />
    //   </Box>
    // </VStack>
    <Box className="chat_window">
      <Flex id="llm-chat-messages">
        {loading && (
          <Flex className="loading_container">
            <Spinner size="xl" />
          </Flex>
        )}
        {!loading && <Conversation />}
      </Flex>

      <Flex id="llm-chat-input-container">
        <Textarea
          id="llm-chat-input-text"
          placeholder={
            loading
              ? "Preparing model..."
              : `Ask ${selectedModel!.display_name} about ${selectedDocument!.name}...`
          }
          value={llmQuery}
          onChange={handleInputChange}
          disabled={loading}
        />
        <Flex id="llm-chat-button-container">
          <Flex
            id="llm-chat-button"
            aria-label="send question to llm"
            cursor={loading ? "cursor" : "pointer"}
            onClick={sendMessage}
            aria-disabled={loading}>
            <ArrowUpIcon width={"1.5em"} height={"1.5em"} />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
