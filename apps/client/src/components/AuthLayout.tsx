import { Grid, GridItem } from "@chakra-ui/react";
import ChatContainer from "./ChatContainer";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AuthLayout() {
  return (
    <Grid
      templateColumns="repeat(10, 1fr)"
      templateRows="repeat(20, 1fr)"
      gap="1"
      color="blackAlpha.700"
      fontWeight="bold"
      className="layout">
      <GridItem rowSpan={2} colSpan={10} pl="2" pt="2" bg="#807F77">
        <Header />
      </GridItem>
      <GridItem rowSpan={18} colSpan={2} className="sidebar">
        <Sidebar />
      </GridItem>
      <GridItem rowSpan={18} colSpan={8}>
        <ChatContainer />
      </GridItem>
    </Grid>
  );
}
