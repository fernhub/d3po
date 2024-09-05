import { type Document } from "shared/schema/document";
import { Button, List, ListItem, useDisclosure } from "@chakra-ui/react";
import { DocumentTile } from "./DocumentTile";
import { DocumentsContainerHeader } from "./DocumentsContainerHeader";
import { FileUploadModal } from "./FileUploadModal";
import { documentsAtom } from "../state/documents";
import { useAtom } from "jotai";

export function DocumentsContainer() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [documents] = useAtom(documentsAtom);

  function renderDocumentList() {
    return documents.map((document: Document) => {
      return (
        <ListItem key={document.s3_key}>
          <DocumentTile document={document} key={document.s3_key} />
        </ListItem>
      );
    });
  }

  return (
    <>
      <DocumentsContainerHeader />
      {documents.length === 0 ? (
        <div className="new-document-button">
          <Button onClick={onOpen} colorScheme="gray">
            Upload New Document
          </Button>
          <FileUploadModal isOpen={isOpen} onClose={onClose} />
        </div>
      ) : (
        <List>{renderDocumentList()}</List>
      )}
    </>
  );
}
