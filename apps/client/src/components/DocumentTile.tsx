import { DeleteIcon } from "@chakra-ui/icons";
import { Card, CardBody, Text, IconButton, HStack, useDisclosure } from "@chakra-ui/react";
import { type Document } from "shared/schema/document";
import { FileDeleteModal } from "./FileDeleteModal";
type TileProps = {
  document: Document;
};
export function DocumentTile({ document }: TileProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Card
        id={document.s3_key}
        className="document-tile"
        direction={{ base: "column", sm: "row" }}
        overflow="hidden">
        <CardBody>
          <HStack>
            <Text fontSize="sm">{document.name}</Text>
            <IconButton
              variant="ghost"
              colorScheme="gray"
              aria-label="See menu"
              float="right"
              icon={<DeleteIcon />}
              onClick={onOpen}
            />
          </HStack>
        </CardBody>
      </Card>
      <FileDeleteModal isOpen={isOpen} onClose={onClose} s3_key={document.s3_key} />
    </>
  );
}
