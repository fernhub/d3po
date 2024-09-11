import { selectedDocumentAtom } from "../state/documents";
import { useAtom } from "jotai";
import { ChatWindow } from "./ChatWindow";
import { Flex } from "@chakra-ui/react";
import { modeAtom } from "../state/mode";
import { selectedModelAtom } from "../state/selectedModel";

export default function ChatContainer() {
  const [selectedDocument] = useAtom(selectedDocumentAtom);
  const [, setMode] = useAtom(modeAtom);
  const [, setSelectedDocument] = useAtom(selectedDocumentAtom);
  const [, setSelectedModel] = useAtom(selectedModelAtom);

  return (
    <>
      <div className="chat-header">
        <p
          className="chat-back-button"
          onClick={() => {
            setMode("options");
            setSelectedDocument(null);
            setSelectedModel(null);
          }}>
          {"<Back"}
        </p>
      </div>
      <Flex className="chat_container">
        <ChatWindow selectedDocument={selectedDocument} />
      </Flex>
    </>
  );
}
