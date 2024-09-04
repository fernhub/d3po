import { useEffect, useState } from "react";
import { documentApi } from "../utils/documentUtils";
import { type Document } from "shared/schema/document";
import { List, ListItem, Tooltip } from "@chakra-ui/react";
import { DocumentTile } from "./DocumentTile";
import { AddIcon, RepeatIcon } from "@chakra-ui/icons";

export function DocumentsContainer() {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    console.log("rendering DocumentsContainer");
    const getDocuments = async () => {
      const d: Document[] = await documentApi.getAll();
      console.log(d);
      setDocuments(d);
    };
    getDocuments();
  }, []);

  function renderDocumentList() {
    if (documents.length === 0) {
      return <div>Upload documents to see them here and begin interacting</div>;
    } else {
      return documents.map((document: Document) => {
        return (
          <ListItem>
            <DocumentTile document={document} />
          </ListItem>
        );
      });
    }
  }

  return (
    <>
      <div id="document-container-header">
        <span>My documents</span>
        <Tooltip label="Refresh documents">
          <button id="refresh-documents-button">
            <RepeatIcon />
          </button>
        </Tooltip>
        <Tooltip label="Upload new document">
          <button id="add-document-button">
            <AddIcon />
          </button>
        </Tooltip>
      </div>
      <List>{renderDocumentList()}</List>
    </>
  );
}
