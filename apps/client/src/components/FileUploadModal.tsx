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
  Spinner,
  useToast,
} from "@chakra-ui/react";

type FileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function FileUploadModal({ isOpen, onClose }: FileModalProps) {
  const [file, setFile] = useState<File>();
  const [uploading, setUploading] = useState(false);
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

    const uploadNewFilePromise = documentApi.uploadNewFile(file);
    setUploading(true);
    uploadNewFilePromise
      .then(async () => {
        const docs = await documentApi.getAll();
        toast({
          title: "Upload successful",
          description: "Looks great",
          position: "top",
          status: "success",
          isClosable: true,
        });
        setUploading(false);
        onClose();
        setDocuments(docs);
      })
      .catch(() => {
        toast({
          title: "Unable to upload",
          description: "There was an error uploading this file. Please retry",
          position: "top",
          status: "error",
          isClosable: true,
        });
      });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} key="uploadModal">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload new file</ModalHeader>
        <ModalBody>
          <input type="file" onChange={handleFileChange} aria-disabled={uploading} />
        </ModalBody>

        <ModalFooter>
          <Button id="" colorScheme="red" mr={3} onClick={onClose} hidden={uploading}>
            Cancel
          </Button>
          <Button colorScheme="green" onClick={uploadFile} aria-disabled={uploading}>
            {uploading ? "Uploading" : "Upload"}
            <Spinner className="file-action-processing-spinner" hidden={!uploading} />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
