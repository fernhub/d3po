import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuGroup, MenuItem, MenuList } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";

export default function AuthenticatedUserHeader() {
  const { user, logout } = useAuth();
  return (
    <Menu>
      <MenuButton as={Button} colorScheme="pink" rightIcon={<ChevronDownIcon />}>
        {user!.name}
      </MenuButton>
      <MenuList>
        {/* <MenuGroup>
          <MenuItem>My Account</MenuItem>
          <MenuItem>Settings</MenuItem>
        </MenuGroup>
        <MenuDivider /> */}
        <MenuGroup>
          <MenuItem color="red" onClick={logout}>
            Logout
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
}
