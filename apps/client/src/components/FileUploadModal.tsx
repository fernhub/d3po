import { useState } from "react";
import { documentApi } from "../utils/documentUtils";
import { useAtom } from "jotai";
import { documentsAtom } from "../state/documents";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";

type FileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function FileUploadModal({ isOpen, onClose }: FileModalProps) {
  const [file, setFile] = useState<File>();
  const [, setDocuments] = useAtom(documentsAtom);
  const toast = useToast();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files !== null) {
      console.log(e.target.files[0].size);
      const file = e.target.files[0];
      // Changing file state
      setFile(file);
    }
  }

  async function uploadFile() {
    if (file === undefined) {
      throw new Error("File not defined, cannot upload");
    }
    onClose();

    const uploadNewFilePromise = documentApi.uploadNewFile(file);
    toast.promise(uploadNewFilePromise, {
      success: {
        title: "Upload successful",
        description: "Looks great",
        position: "top",
        isClosable: true,
      },
      error: { title: "Uh oh", description: "Something wrong", position: "top", isClosable: true },
      loading: { title: "Uploading document", description: "Please wait", position: "top" },
    });
    uploadNewFilePromise.then(async () => {
      const docs = await documentApi.getAll();
      setDocuments(docs);
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} key="uploadModal">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload new file</ModalHeader>
        <ModalBody>
          <input type="file" onChange={handleFileChange} />
        </ModalBody>

        <ModalFooter>
          <Button id="" colorScheme="red" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="green" onClick={uploadFile}>
            Upload
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
