import { useRef, useState } from "react";
import { Button, Flex, HStack, Spinner, Text, useToast } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { documentsAtom } from "../state/documents";
import { documentApi } from "../utils/documentUtils";

export function UploadTile() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useAtom(documentsAtom);
  const toast = useToast();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("handle file chagne");
    console.log(e);
    if (e.target.files !== null && e.target.files[0] !== undefined) {
      console.log(e.target.files[0].size);
      const file = e.target.files[0];
      // Changing file state
      setFile(file);
    }
  }

  function openFileSelector(e: React.MouseEvent) {
    console.log(documents.length);
    console.log(e);
    e.preventDefault();
    e.stopPropagation();
    if (!inputRef || !inputRef.current) return;

    console.log("clicking inputReg");
    inputRef.current.click();
  }

  async function uploadFile(e: React.MouseEvent) {
    console.log("uploading");
    e.stopPropagation();
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
          description: "Document has been successfully uploaded",
          position: "top",
          duration: 2000,
          status: "success",
          isClosable: true,
        });
        setUploading(false);
        setFile(undefined);
        setDocuments(docs);
      })
      .catch(() => {
        toast({
          title: "Unable to upload",
          description: "There was an error uploading this file. Please retry",
          position: "top",
          duration: 5000,
          status: "error",
          isClosable: true,
        });
        setUploading(false);
      });
  }
  return (
    <>
      <Flex
        className="option-item"
        onClick={openFileSelector}
        aria-disabled={documents.length >= 10}>
        <Text fontWeight={"600"} fontSize={"1em"}>
          {!file ? "Upload New Document" : `Upload: ${file.name}`}
        </Text>
        {!file && (
          <Button
            disabled={uploading || documents.length >= 10}
            backgroundColor={"#853bce"}
            color={"white"}
            width="140px"
            alignSelf={"center"}
            shadow={"xl"}
            _hover={{ bg: "#6417b2" }}
            onClick={openFileSelector}>
            Select pdf
          </Button>
        )}

        {file && (
          <HStack justifyContent={"center"}>
            <Button
              aria-disabled={uploading}
              backgroundColor={"red"}
              color={"white"}
              width="140px"
              alignSelf={"center"}
              shadow={"xl"}
              _hover={{ bg: "#6417b2" }}
              onClick={(e) => {
                console.log("cancelling");
                e.stopPropagation();
                setFile(undefined);
                setUploading(false);
                if (inputRef.current) {
                  inputRef.current.value = "";
                }
              }}>
              Cancel
            </Button>
            <Button
              aria-disabled={uploading}
              backgroundColor="green"
              color={"white"}
              width="140px"
              alignSelf={"center"}
              shadow={"xl"}
              _hover={{ bg: "#6417b2" }}
              onClick={uploadFile}>
              {uploading ? "Uploading" : "Upload"}
              <Spinner className="file-action-processing-spinner" hidden={!uploading} />
            </Button>
          </HStack>
        )}
      </Flex>
      <input
        type="file"
        accept="application/pdf"
        ref={inputRef}
        onChange={handleFileChange}
        hidden
      />
    </>
  );
}
