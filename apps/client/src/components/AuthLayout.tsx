import { Grid, GridItem } from "@chakra-ui/react";
import ChatContainer from "./ChatContainer";
import Header from "./Header";
import { modeAtom } from "../state/mode";
import { useAtom } from "jotai";
import { OptionsContainer } from "./OptionsContainer";

export default function AuthLayout() {
  const [mode] = useAtom(modeAtom);
  return (
    <Grid
      templateColumns="repeat(10, 1fr)"
      templateRows="repeat(20, 1fr)"
      gap="1"
      color="blackAlpha.700"
      fontWeight="bold"
      className="layout">
      <GridItem rowSpan={2} colSpan={10} pl="2" pt="2" className="header">
        <Header />
      </GridItem>
      <GridItem rowSpan={18} colSpan={10}>
        {mode === "options" ? <OptionsContainer /> : <ChatContainer />}
      </GridItem>
    </Grid>
  );
}
