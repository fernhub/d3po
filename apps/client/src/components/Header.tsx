import { Grid, GridItem, Image } from "@chakra-ui/react";
import logo from "../assets/logo/png/d-3po-high-resolution-logo-white-transparent.png";
import HeaderUserInfo from "./HeaderUserInfo";
import { modeAtom } from "../state/mode";
import { useAtom } from "jotai";
import { selectedDocumentAtom } from "../state/documents";
import { selectedModelAtom } from "../state/selectedModel";
import { ChatModelSelector } from "./ChatModelSelector";
import { appStateAtom } from "../state/app";

function Header() {
  const [mode, setMode] = useAtom(modeAtom);
  const [, setSelectedDocument] = useAtom(selectedDocumentAtom);
  const [, setSelectedModel] = useAtom(selectedModelAtom);
  const [appState] = useAtom(appStateAtom);
  return (
    <Grid templateColumns="repeat(8, 1fr)" templateRows="1" className="app-header">
      <GridItem pl={20} colSpan={1} className="header-logo">
        <Image
          className="chat-back-button"
          src={logo}
          onClick={() => {
            if (mode === "chat") {
              setMode("options");
              setSelectedDocument(null);
              setSelectedModel(null);
            }
          }}
        />
      </GridItem>
      <GridItem colSpan={6} className="header-selector">
        {mode === "chat" && <ChatModelSelector />}
      </GridItem>
      <GridItem colSpan={1} className="header-user-info">
        {appState !== "initializing" && <HeaderUserInfo />}
      </GridItem>
    </Grid>
  );
}

export default Header;
