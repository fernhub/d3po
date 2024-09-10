import { Flex, Heading, Spinner } from "@chakra-ui/react";
import { DocumentTile } from "./DocumentTile";
import { useEffect, useState } from "react";
import { documentApi } from "../utils/documentUtils";
import { useAtom } from "jotai";
import { documentsAtom, selectedDocumentAtom } from "../state/documents";
import { type Document } from "shared/schema/document";
import { modeAtom } from "../state/mode";
import { UploadTile } from "./UploadTile";

export function OptionsContainer() {
  const [documents, setDocuments] = useAtom(documentsAtom);
  const [, setSelectedDocument] = useAtom(selectedDocumentAtom);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useAtom(modeAtom);

  useEffect(() => {
    console.log("in useEffect");
    const getDocuments = async () => {
      const d: Document[] = await documentApi.getAll();
      setDocuments(d);
      setLoading(false);
    };
    getDocuments();
  }, []);

  function renderDocuments() {
    console.log("rendering documents");
    console.log(documents);
    return documents.map((document, index) => {
      return (
        <DocumentTile
          key={index}
          document={document}
          onClick={() => {
            setSelectedDocument(document);
            setMode("chat");
          }}
        />
      );
    });
  }
  return (
    <>
      {!loading && (
        <Heading className="welcome-heading">
          {documents.length == 0
            ? "Upload a new document and begin interacting with the llm of your choice"
            : "Select a document to begin interacting with the llm of your choice"}
        </Heading>
      )}
      <Flex className="options_container" justifyContent={documents.length < 2 ? "center" : ""}>
        {loading && <Spinner />}

        {mode === "options" && !loading && (
          <>
            <UploadTile />
            {renderDocuments()}
          </>
        )}
      </Flex>
    </>
  );
}
