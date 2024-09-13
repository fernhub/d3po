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
import { appStateAtom } from "../state/app";

export function OptionsContainer() {
  const [documents, setDocuments] = useAtom(documentsAtom);
  const [, setSelectedModel] = useAtom(selectedModelAtom);
  const [, setSelectedDocument] = useAtom(selectedDocumentAtom);
  const [appState, setAppState] = useAtom(appStateAtom);
  const [mode, setMode] = useAtom(modeAtom);
  useEffect(() => {
    console.log("in useEffect");
    const getDocuments = async () => {
      const d: Document[] = await documentApi.getAll();
      setDocuments(d);
      setAppState("loaded");
    };
    getDocuments();
  }, [setDocuments, setAppState]);

  function renderDocuments() {
    console.log("rendering documents");
    console.log(documents);
    return documents.map((document, index) => {
      return (
        <DocumentTile
          key={index}
          document={document}
          onClick={() => {
            setAppState("loading");
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
      <Flex className="welcome-heading">
        {appState === "loaded" && (
          <Heading>
            {documents.length == 0
              ? "Upload a new document and begin interacting with the llm of your choice"
              : "Select a document to begin interacting with the llm of your choice"}
          </Heading>
        )}
      </Flex>
      <Flex className="options_container" justifyContent={documents.length < 2 ? "center" : ""}>
        {appState === "loading" && <Spinner size="xl" color="white" />}

        {mode === "options" && appState === "loaded" && (
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
