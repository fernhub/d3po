import { ArrowUpIcon } from "@chakra-ui/icons";
import { Alert, AlertIcon, Box, Flex, Spinner, Textarea } from "@chakra-ui/react";
import { type Document } from "shared/schema/document";
import { ChangeEvent, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Conversation } from "./Conversation";
import { chatMessagesAtom } from "../state/chat";
import { appStateAtom } from "../state/app";
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
  const [appState, setAppState] = useAtom(appStateAtom);
  const [selectedModel] = useAtom(selectedModelAtom);
  const [chatError, setChatError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const query = {
      user_id: user?.id,
      document_key: selectedDocument?.s3_key,
      model_source: selectedModel?.source,
      model_key: selectedModel?.key,
    };
    const socket = io("http://localhost:5001", {
      query: query,
      withCredentials: true,
    });
    socket.on("connect", () => {});
    socket.on("ready", () => {
      setChatMessages([
        {
          actor: "ai",
          content: "Hello, how can I help you?",
          timestamp: new Date(),
        },
      ]);
      setAppState("waiting");
    });
    socket.on("connect_error", () => {
      //TODO: something with err
      setAppState("error");
      setChatError("Error connecting to llm, please try again");
    });
    socket.on("error", (err) => {
      setAppState("error");
      if (err.msg.includes("credit")) {
        setChatError(
          `: Insuffcient credits for this model. Please select a different model or add credits`
        );
      } else {
        setChatError(", please select a different model or try again");
      }
    });

    socket.on("response", (actor, content, timestamp) => {
      setAppState("waiting");
      const response: ChatMessage = {
        actor: actor,
        content: content,
        timestamp: timestamp,
      };
      setChatMessages((prevChatMessages) => [...prevChatMessages, response]);
    });

    setChatSocket(socket);
    const cleanupSocket = () => {
      socket.off();
      socket.disconnect();
    };
    window.addEventListener("beforeunload", cleanupSocket);
    return () => {
      cleanupSocket();
      window.removeEventListener("beforeunload", cleanupSocket);
    };
  }, [selectedModel, selectedDocument, user, setChatMessages, setAppState]);

  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const inputValue = e.target.value;
    setLlmQuery(inputValue);
  }

  function sendMessage() {
    setAppState("sending");
    setLlmQuery("");
    setChatMessages((prevChatMessages) => [
      ...prevChatMessages,
      { actor: "self", content: llmQuery, timestamp: new Date() },
    ]);
    if (!chatSocket) {
      setAppState("error");
      setChatError("Unkown");
      console.log("error sending");
      return;
    }
    chatSocket.emit("query", llmQuery);
  }

  function getPlaceholder() {
    switch (appState) {
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
        {appState === "loading" && (
          <Flex className="loading_container">
            <Spinner size="xl" />
          </Flex>
        )}
        {appState === "error" && (
          <Flex className="loading_container">
            <Alert status="error" className="alert-error">
              <AlertIcon className="alert-icon" />
              {`There was an error processing your request${chatError}`}
            </Alert>
          </Flex>
        )}
        {(appState === "waiting" || appState === "sending") && <Conversation />}
      </Flex>

      <Flex id="llm-chat-input-container">
        <Textarea
          id="llm-chat-input-text"
          placeholder={getPlaceholder()}
          onClick={() => console.log("text area clicked")}
          value={llmQuery}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            console.log(e);
            if (e.key === "Enter" && e.shiftKey === false) {
              sendMessage();
            }
          }}
          disabled={appState !== "waiting"}
        />
        <Flex id="llm-chat-button-container">
          <Flex
            id="llm-chat-button"
            aria-label="send question to llm"
            cursor={appState === "loading" ? "cursor" : "pointer"}
            onClick={sendMessage}
            aria-disabled={appState !== "waiting"}>
            <ArrowUpIcon width={"1.5em"} height={"1.5em"} />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
