import { type Document } from "shared/schema/document";
import { Button, List, ListItem, useDisclosure } from "@chakra-ui/react";
import { DocumentTile } from "./DocumentTile";
import { DocumentsContainerHeader } from "./DocumentsContainerHeader";
import { FileUploadModal } from "./FileUploadModal";
import { documentsAtom, selectedDocumentAtom } from "../state/documents";
import { useAtom } from "jotai";

export function DocumentsContainer() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [documents] = useAtom(documentsAtom);
  const [selectedDocument, setSelectedDocument] = useAtom(selectedDocumentAtom);

  function renderDocumentList() {
    console.log("rerendering documents container");
    return documents.map((document: Document) => {
      return (
        <ListItem
          key={document.s3_key}
          onClick={(e) => {
            console.log(e);
            console.log("clicked document");
            console.log(document);
            handleDocumentClicked(document);
          }}>
          <DocumentTile document={document} key={document.s3_key} />
        </ListItem>
      );
    });
  }

  function handleDocumentClicked(document: Document) {
    //if the selected document is unset, or if we are clicking one that isn't already set, then set it. Don't want to unneccessarily set if already on the one we're setting
    if (selectedDocument === null || selectedDocument.s3_key !== document.s3_key) {
      setSelectedDocument(document);
    }
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
