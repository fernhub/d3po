import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { documentApi } from "../utils/documentUtils";
import { documentsAtom } from "../state/documents";
import { type Document } from "shared/schema/document";
import { useAtom } from "jotai";

type FileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  s3_key: string;
};

export function DeleteModal({ isOpen, onClose, s3_key }: FileModalProps) {
  const [, setDocuments] = useAtom(documentsAtom);

  async function deleteFile() {
    await documentApi.deleteFile(s3_key);
    const d: Document[] = await documentApi.getAll();
    setDocuments(d);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} key="deleteModal">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm delete</ModalHeader>
        <ModalBody>Are you sure you want to delete this file?</ModalBody>

        <ModalFooter>
          <Button id="" colorScheme="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={deleteFile}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
