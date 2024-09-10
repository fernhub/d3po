import { ChatIcon, DeleteIcon } from "@chakra-ui/icons";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Flex,
  Button,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { FileDeleteModal } from "./FileDeleteModal";
import { type Document } from "shared/schema/document";

type OptionTileProps = {
  document: Document;
  onClick: () => void;
};

export function DocumentTile({ document, onClick }: OptionTileProps) {
  const { isOpen: isOpenModal, onOpen, onClose } = useDisclosure();

  return (
    <Flex className="option-item" onClick={onClick}>
      <div className="deleteMenu">
        <Menu>
          {({ isOpen: isOpenMenu }) => (
            <>
              <MenuButton
                className="delete-file-button"
                as={IconButton}
                aria-label="Options"
                icon={<BsThreeDotsVertical />}
                variant="ghost"
                color="gray"
                onClick={(e) => {
                  e.stopPropagation();
                  isOpenMenu = true;
                }}
              />
              <MenuList>
                <MenuItem
                  color="black"
                  icon={<DeleteIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen();
                  }}>
                  Delete File
                </MenuItem>
              </MenuList>
            </>
          )}
        </Menu>
      </div>
      <Text fontWeight={"600"} fontSize={"1em"}>
        {document.name}
      </Text>
      <Button
        backgroundColor={"#853bce"}
        color={"white"}
        width="140px"
        alignSelf={"center"}
        shadow={"xl"}
        _hover={{ bg: "#6417b2" }}>
        <ChatIcon mr={"1em"} />
        Chat
      </Button>
      <FileDeleteModal isOpen={isOpenModal} onClose={onClose} s3_key={document.s3_key} />
    </Flex>
  );
}
