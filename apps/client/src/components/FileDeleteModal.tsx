import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { documentApi } from "../utils/documentUtils";
import { documentsAtom, selectedDocumentAtom } from "../state/documents";
import { type Document } from "shared/schema/document";
import { useAtom } from "jotai";
import { useState } from "react";
type FileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  s3_key: string;
};

export function FileDeleteModal({ isOpen, onClose, s3_key }: FileModalProps) {
  const toast = useToast();
  const [, setDocuments] = useAtom(documentsAtom);
  const [deleting, setDeleting] = useState(false);
  const [selectedDocument, setSelectedDocument] = useAtom(selectedDocumentAtom);

  async function deleteFile() {
    setDeleting(true);
    const deleteDocumentPromise = documentApi.deleteFile(s3_key);
    deleteDocumentPromise
      .then(async () => {
        onClose();
        toast({
          title: "Delete successful",
          description: "File was successfully deleted",
          position: "top",
          duration: 2000,
          status: "success",
          isClosable: true,
        });
        //if we are deleting the one that is currently selected, clear selected
        if (selectedDocument?.s3_key === s3_key) {
          setSelectedDocument(null);
        }
        const d: Document[] = await documentApi.getAll();
        setDeleting(false);
        setDocuments(d);
      })
      .catch(() => {
        toast({
          title: "Error deleting",
          description: "There was an error deleting this file. Please retry",
          position: "top",
          status: "error",
          isClosable: true,
        });
      });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} key="deleteModal">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm delete</ModalHeader>
        <ModalBody>Are you sure you want to delete this file?</ModalBody>

        <ModalFooter>
          <Button id="" colorScheme="gray" mr={3} onClick={onClose} hidden={deleting}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={deleteFile} aria-disabled={deleting}>
            {deleting ? "Deleting" : "Delete"}
            <Spinner className="file-action-processing-spinner" hidden={!deleting} />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
