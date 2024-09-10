import { selectedDocumentAtom } from "../state/documents";
import { useAtom } from "jotai";
import { ChatWindow } from "./ChatWindow";
import { Flex } from "@chakra-ui/react";

export default function ChatContainer() {
  const [selectedDocument] = useAtom(selectedDocumentAtom);

  return (
    <Flex className="chat_container">
      <ChatWindow selectedDocument={selectedDocument} />
    </Flex>
  );
}
