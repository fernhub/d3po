import { Grid, GridItem } from "@chakra-ui/react";
import Body from "./Body";
import Footer from "./Footer";
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
      <GridItem rowSpan={2} colSpan={10} pl="2" pt="2">
        <Header />
      </GridItem>
      <GridItem rowSpan={16} colSpan={2} pl="2" bg="pink.300">
        <Sidebar />
      </GridItem>
      <GridItem rowSpan={16} colSpan={8} bg="green.300">
        <Body fileSelected={true} />
      </GridItem>
      <GridItem pl="2" rowSpan={2} colSpan={10} bg="blue.300">
        <Footer />
      </GridItem>
    </Grid>
  );
}
