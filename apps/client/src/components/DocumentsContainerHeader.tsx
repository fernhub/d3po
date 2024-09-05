import { RepeatIcon, AddIcon } from "@chakra-ui/icons";
import { Tooltip, useDisclosure } from "@chakra-ui/react";
import { FileUploadModal } from "./FileUploadModal";

export function DocumentsContainerHeader() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div id="document-container-header">
      <span>My documents</span>
      <Tooltip label="Refresh documents">
        <button id="refresh-documents-button">
          <RepeatIcon />
        </button>
      </Tooltip>
      <Tooltip label="Upload new document">
        <button id="add-document-button" onClick={onOpen}>
          <AddIcon />
        </button>
      </Tooltip>
      <FileUploadModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
}
