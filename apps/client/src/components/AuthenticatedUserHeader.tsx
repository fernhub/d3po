import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

interface UserInfo {
  userName: string;
}

export default function AuthenticatedUserHeader({ userName }: UserInfo) {
  return (
    <Menu>
      <MenuButton as={Button} colorScheme="pink" rightIcon={<ChevronDownIcon />}>
        {userName}
      </MenuButton>
      <MenuList>
        <MenuGroup title={userName}>
          <MenuItem>My Account</MenuItem>
          <MenuItem>Settings</MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup>
          <MenuItem color="red">Logout</MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
}
