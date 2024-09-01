import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
//import { api } from "../utils";

export default function LoginOrSignupUserHeader() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} colorScheme="teal" variant="link">
        Login or Signup
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab>Login</Tab>
              <Tab>Create Account</Tab>
            </TabList>
            <ModalCloseButton />
            <TabPanels>
              <TabPanel>
                <ModalBody>
                  <LoginForm />
                </ModalBody>
              </TabPanel>
              <TabPanel>
                <ModalBody>
                  <RegisterForm />
                </ModalBody>
              </TabPanel>
            </TabPanels>
            <ModalFooter></ModalFooter>
          </Tabs>
        </ModalContent>
      </Modal>
    </>
  );
}
