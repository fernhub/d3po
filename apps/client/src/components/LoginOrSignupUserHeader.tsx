import {
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
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
//import { api } from "../utils";

export default function LoginOrSignupUserHeader() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <h2 onClick={onOpen} className="login-or-signup">
        Login or Signup
      </h2>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className="login-or-signup-modal">
          <Tabs isFitted variant="enclosed" className="login-or-signup-modal">
            <TabList mb="1em">
              <Tab>Login</Tab>
              <Tooltip
                label={`As this is still in beta, new signups are temporarily unavailable. Contact fernandez.zack@icloud.com to request an account`}>
                <Tab isDisabled>Create Account</Tab>
              </Tooltip>
            </TabList>
            <ModalCloseButton />
            <TabPanels className="login-or-signup-modal">
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
            <ModalFooter className="login-or-signup-modal"></ModalFooter>
          </Tabs>
        </ModalContent>
      </Modal>
    </>
  );
}
