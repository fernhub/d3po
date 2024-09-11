import { Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { DocumentTile } from "./DocumentTile";
import { useEffect } from "react";
import { documentApi } from "../utils/documentUtils";
import { useAtom } from "jotai";
import { documentsAtom, selectedDocumentAtom } from "../state/documents";
import { type Document } from "shared/schema/document";
import { modeAtom } from "../state/mode";
import { UploadTile } from "./UploadTile";
import { DEFAULT_MODEL } from "shared/enums/models";
import { selectedModelAtom } from "../state/selectedModel";
import { chatStateAtom } from "../state/chat";

export function OptionsContainer() {
  const [documents, setDocuments] = useAtom(documentsAtom);
  const [, setSelectedModel] = useAtom(selectedModelAtom);
  const [, setSelectedDocument] = useAtom(selectedDocumentAtom);
  const [chatState, setChatState] = useAtom(chatStateAtom);
  const [mode, setMode] = useAtom(modeAtom);

  useEffect(() => {
    console.log("in useEffect");
    const getDocuments = async () => {
      const d: Document[] = await documentApi.getAll();
      setDocuments(d);
      setChatState("waiting");
    };
    getDocuments();
  }, [setDocuments, setChatState]);

  function renderDocuments() {
    console.log("rendering documents");
    console.log(documents);
    return documents.map((document, index) => {
      return (
        <DocumentTile
          key={index}
          document={document}
          onClick={() => {
            setChatState("loading");
            setSelectedDocument(document);
            setSelectedModel(DEFAULT_MODEL);
            setMode("chat");
          }}
        />
      );
    });
  }
  return (
    <>
      {chatState === "waiting" && (
        <Heading className="welcome-heading">
          {documents.length == 0
            ? "Upload a new document and begin interacting with the llm of your choice"
            : "Select a document to begin interacting with the llm of your choice"}
        </Heading>
      )}
      <Flex className="options_container" justifyContent={documents.length < 2 ? "center" : ""}>
        {chatState === "loading" && <Spinner />}

        {mode === "options" && chatState !== "loading" && (
          <>
            <UploadTile />
            {renderDocuments()}
          </>
        )}
      </Flex>
      <Text hidden={documents.length < 10} className="exceeded-documents-limit">
        DOCUMENT LIMIT EXCEEDED: Delete a document before you can upload another
      </Text>
    </>
  );
}
